from flask import Flask, request, jsonify, Response, abort, send_file
from flask_cors import CORS  # <-- Add this line
from pathlib import Path
from uuid import uuid4
import json
import threading
import time
import math
import mimetypes

app = Flask(__name__)
CORS(app)  # <-- Enable CORS for all routes and origins

# --- Config / paths ---
BASE_DIR = Path(__file__).parent.resolve()
BUFFER_FILE = BASE_DIR / "buffer.txt"
MAPPING_FILE = BASE_DIR / "mapping.json"
VIDEOS_DIR = BASE_DIR / "videos"
VIDEOS_DIR.mkdir(exist_ok=True)

_lock = threading.Lock()

# --- Helpers to load/save mapping.json safely ---
def _init_mapping():
    if not MAPPING_FILE.exists():
        MAPPING_FILE.write_text(json.dumps({"next_id": 1, "items": {}}, indent=2))

def load_mapping():
    _init_mapping()
    return json.loads(MAPPING_FILE.read_text())

def save_mapping(mapping):
    tmp = MAPPING_FILE.with_suffix(".tmp")
    tmp.write_text(json.dumps(mapping, indent=2))
    tmp.replace(MAPPING_FILE)

# --- Endpoint: POST/PUT /buffer ---
@app.route("/buffer", methods=["POST", "PUT"])
def buffer_write():
    data = {}
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form.to_dict()

    text = data.get("text")
    video_filename = data.get("video_filename")

    if not text:
        return jsonify({"error": "Missing 'text'"}), 400

    if video_filename:
        video_filename = Path(video_filename).name

    with _lock:
        mapping = load_mapping()
        next_id = mapping.get("next_id", 1)
        entry_id = int(next_id)

        ts = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        record = {"id": entry_id, "timestamp": ts, "text": text, "video_filename": video_filename}
        with BUFFER_FILE.open("a", encoding="utf-8") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")

        mapping["items"][str(entry_id)] = {
            "timestamp": ts,
            "video_filename": video_filename,
        }
        mapping["next_id"] = entry_id + 1
        save_mapping(mapping)

    return jsonify({"id": entry_id}), 201


# --- Helper: serve file with Range support ---
def partial_response(path: Path):
    if not path.exists():
        abort(404)

    file_size = path.stat().st_size
    range_header = request.headers.get("Range", None)
    if not range_header:
        return send_file(
            str(path),
            as_attachment=False,
            conditional=True,
            mimetype=mimetypes.guess_type(str(path))[0] or "application/octet-stream",
        )

    try:
        units, rng = range_header.split("=")
        start_str, end_str = rng.split("-")
        start = int(start_str) if start_str else 0
        end = int(end_str) if end_str else file_size - 1
    except Exception:
        return Response(status=400)

    if start >= file_size:
        return Response(status=416, headers={"Content-Range": f"bytes */{file_size}"})

    end = min(end, file_size - 1)
    length = end - start + 1

    def generate():
        with path.open("rb") as f:
            f.seek(start)
            bytes_left = length
            chunk_size = 8192
            while bytes_left > 0:
                read_bytes = f.read(min(chunk_size, bytes_left))
                if not read_bytes:
                    break
                bytes_left -= len(read_bytes)
                yield read_bytes

    content_type = mimetypes.guess_type(str(path))[0] or "application/octet-stream"
    rv = Response(generate(), status=206, mimetype=content_type)
    rv.headers.add("Content-Range", f"bytes {start}-{end}/{file_size}")
    rv.headers.add("Accept-Ranges", "bytes")
    rv.headers.add("Content-Length", str(length))
    return rv


# --- Endpoint: GET /video/<id> ---
@app.route("/video/<int:entry_id>", methods=["GET"])
def get_video(entry_id):
    mapping = load_mapping()
    item = mapping.get("items", {}).get(str(entry_id))
    if not item:
        return jsonify({"error": "id not found"}), 404

    video_filename = item.get("video_filename")
    if not video_filename:
        return jsonify({"error": "no video associated with this id"}), 404

    safe_name = Path(video_filename).name
    video_path = VIDEOS_DIR / safe_name
    if not video_path.exists():
        return jsonify({"error": "video file not found on server"}), 404

    return partial_response(video_path)


# --- Optional: helper route to list mapping (dev only) ---
@app.route("/_mapping", methods=["GET"])
def mapping_list():
    return jsonify(load_mapping())


if __name__ == "__main__":
    _init_mapping()
    app.run(host="0.0.0.0", port=5000, debug=True)
