
import os
import time
from google import genai
from google.genai.types import GenerateVideosConfig
import requests
from typing import Optional, Dict, Any
import requests
from generate_sora2video import create_video
OPENROUTER_BASE = "https://openrouter.ai/api/v1"
CHAT_ENDPOINT = f"{OPENROUTER_BASE}/chat/completions"

def send_prompt(prompt: str,
                model: str = "openai/gpt-4o",
                api_key: Optional[str] = None,
                extra: Optional[Dict[str, Any]] = None) -> str:
    api_key="deleted for security"
    """
    Send a single-user prompt to an OpenRouter model and return the text response.
    - prompt: the user's prompt string
    - model: model id to request (e.g. "openai/gpt-4o" or "openrouter/auto")
    - api_key: if None, will read OPENROUTER_API_KEY from env
    - extra: optional dict to pass extra parameters (temperature, max_tokens, etc.)
    """
    api_key = "deleted for security"
    if not api_key:
        raise ValueError("Provide OPENROUTER_API_KEY env var or pass api_key arg")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        # you can include other options here; merge extras if provided
    }

    if extra:
        payload.update(extra)

    resp = requests.post(CHAT_ENDPOINT, json=payload, headers=headers, timeout=30)
    # raise for HTTP errors
    resp.raise_for_status()
    data = resp.json()

    # Basic safe extraction of the first message text
    try:
        print(data)
        choice = data["choices"][0]
        message = choice.get("message") or {}
        content = message.get("content") or ""
        return content
    except Exception:
        # fallback: return raw json for debugging
        return f"Unexpected response shape: {data!r}"
    
def get_description_dict(json_response):
    print(json_response)
    description=json_response["description"]
    statistic_set={}
    statistic_set["likes"]=json_response["likes"]
    statistic_set["views"]=json_response["views"]
    statistic_set["follower_count"]=json_response["followers"]
    return (description, statistic_set)


def generate_video_prompt(description_stat_set, client_audience, company_name):
    prompt= f"""
    You are an expert creative strategist and video marketing copywriter. Your job is to generate highly engaging, goal-aligned video ad descriptions based on the company’s objectives, audience insights, and prior video performance statistics.
    You analyze data, infer what types of storytelling or visuals perform best, and produce a detailed creative description for the next video advertisement, ready to be used by a video generation or production system.
    Your current goal is to create an engaging advertisement for {company_name}. {company_name} has the following goals for their ad: \n {client_audience}. 
    \nBelow is a set of similar videos with descriptions and statistics about them. Based on this data, optimize the video description you create to maximize engagement on some social media site.
    """
    for description, statistic_set in description_stat_set:
        print(description)
        print(statistic_set)
        prompt+=f"""
        \nVideo Description: {description} \
        \nViews: {statistic_set["views"]}
        \nLikes: {statistic_set["likes"]}
        \nFollower Count: {statistic_set["follower_count"]}        
        """
    return send_prompt(prompt)

def vid_from_prompt(prompt_vid):
        generate_url = "https://api.atlascloud.ai/api/v1/model/generateVideo"
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer deleted for security"
        }
        data = {
            "model": "openai/sora-2/text-to-video",
            "duration": 12,
            "prompt": prompt_vid,
            "size": "720*1280"
        }

        generate_response = requests.post(generate_url, headers=headers, json=data)
        generate_result = generate_response.json()
        prediction_id = generate_result["data"]["id"]

        # Step 2: Poll for result
        poll_url = f"https://api.atlascloud.ai/api/v1/model/prediction/{prediction_id}"

        def check_status():
            while True:
                response = requests.get(poll_url, headers={"Authorization": "Bearer deleted for security"})
                result = response.json()

                if result["data"]["status"] in ["completed", "succeeded"]:
                    print("Generated video:", result["data"]["outputs"][0])
                    return result["data"]["outputs"][0]
                elif result["data"]["status"] == "failed":
                    raise Exception(result["data"]["error"] or "Generation failed")
                else:
                    # Still processing, wait 2 seconds
                    time.sleep(2)

        video_url = check_status()


def generate_and_download_video(json_responses, client_audience, client_name, output_filename: str = "generated_video.mp4"):
    """
    Generates a video using the Veo 3.1 model and downloads it to a file.

    Assumes the GOOGLE_API_KEY environment variable is set.
    """
    try:
        # --- 1. Configure the API Key ---
        # Make sure the GOOGLE_API_KEY environment variable is set in your
        # terminal: export GOOGLE_API_KEY='your-api-key'
        # Your API key must be from a billing-enabled project.
        api_key = "deleted for security"
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set.")
        print(json_responses)
        print("TYPETYPETYPETYPE")
        print(type(json_responses))
       # genai.configure(api_key=api_key)
        video_prompt=generate_video_prompt([get_description_dict(js) for js in json_responses], client_audience, client_name)
        print(video_prompt)
        vid_from_prompt(video_prompt)
        return
        
    #     video_prompt=(
    #     "A cinematic, aerial drone shot flying slowly over a "
    #     "snow-covered forest. The sun is low on the horizon, "
    #     "casting long shadows."
    # )
        # --- 2. Initialize the Client ---
        # This client will be used to make the API calls.
        client = genai.Client(vertexai=True, project="able-source-477619-c7")

        # --- 3. Submit the Generation Request ---
        print(f"Submitting video generation request for: '{video_prompt}'")
        
        # Define the model and prompt configuration
        # Using "veo-3.1-fast-generate-preview" for a faster (but still high-quality) result.
        # Use "veo-3.1-generate-preview" for the highest quality.
    #     operation = client.models.generate_videos(
    #     model="veo-3.0-generate-001",
    #     prompt="a cat reading a book",
    #     config=GenerateVideosConfig(
    #         aspect_ratio="16:9",
    #         output_gcs_uri=output_gcs_uri,
    #     ),
    # )

    #     while not operation.done:
    #         time.sleep(15)
    #         operation = client.operations.get(operation)
    #         print(operation)

    #     if operation.response:
    #         print(operation.result.generated_videos[0].video.uri)
    #     return
        
        operation = client.models.generate_videos(
            model="veo-3.1-fast-generate-preview",
            prompt=video_prompt,
            config=GenerateVideosConfig(
                negative_prompt="blurry, low resolution, watermark, text",
            ),
        )
        print()

        print(f"Job started. Operation name: {operation.name}")
        print("Waiting for job to complete... This may take several minutes.")

        # --- 4. Poll for Completion ---
        # Video generation is an asynchronous task. We need to poll the
        # operation's status until it's "done".
        while not operation.done:
            print("  Still processing... waiting 10 seconds.")
            time.sleep(10)
        
        print("Job finished.")

        # --- 5. Get the Result and Download ---
        if operation.result().video:
            # The result contains the raw video data.
            video_data = operation.result().video.data
            
            with open(output_filename, "wb") as f:
                f.write(video_data)
            
            print(f"\nSuccess! Video downloaded to '{output_filename}'")
        else:
            print("\nJob completed, but no video data was returned.")
            print(f"Full response: {operation.result()}")

    except Exception as e:
        print(f"\nAn error occurred: {e}")
        print("Please ensure 'pip install google-generativeai' is run,")
        print("your GOOGLE_API_KEY is correct and from a billing-enabled project,")
        print("and you have access to the Veo 3.1 preview.")

# --- Main execution ---
if __name__ == "__main__":
    # Define your video prompt here
    video_prompt = (
        "A cinematic, aerial drone shot flying slowly over a "
        "snow-covered forest. The sun is low on the horizon, "
        "casting long shadows."
    )
    
    generate_and_download_video(None, None, None, output_filename="my_forest_video.mp4")
