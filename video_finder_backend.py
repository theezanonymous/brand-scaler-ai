EXA_API_KEY="deleted for security"
from exa_py import Exa
import re
import requests
import time
import json
import argparse
DATASET_ID = "deleted for security"
def get_urls_from_business_type(business_type, cutoff_thousand=5):
    exa = Exa(api_key = EXA_API_KEY)

    research = exa.research.create(
    instructions = f"Instagram pages of {business_type} with {cutoff_thousand} thousand or more followers on instagram",
    model = "exa-research-fast",
    )
    event_last=None
    for event in exa.research.get(research.research_id, stream = True):
        event_last=event
    return find_urls_string(event_last.output.content)

def find_urls_string(content_string):
    # Regex pattern to match Instagram URLs
    pattern = r'https?://(?:www\.)?instagram\.com/[^\s\)\]]+'

    # Extract all URLs
    urls = re.findall(pattern, content_string)

    # Optional: remove duplicates and clean trailing punctuation if any
    urls = list(dict.fromkeys(url.rstrip(').,;') for url in urls))

    return urls

def get_videos_brightdata(url):
    headers = {
        "Authorization": f"Bearer {"deleted for security"}",
        "Content-Type": "application/json",
    }

    # Step 1: Start the scrape job
    data = json.dumps({
        "input": [{"url":url,"num_of_posts":20,"start_date":"","end_date":""}],
    })
    print(f"Starting scrape for {url}")
    start_response = requests.post(
        f"https://api.brightdata.com/datasets/v3/scrape?dataset_id={DATASET_ID}&notify=false&include_errors=true&type=discover_new&discover_by=url_all_reels",
        headers=headers,
        data=data
    )

    if start_response.status_code != 202:
        print("Error starting scrape:", start_response.text)
        return None

    result = start_response.json()
    print("Scrape started:", result)

    # Step 2: Extract snapshot ID or job ID
    # snapshot_id = result.get("snapshot_id")  # some versions return this
    # if not snapshot_id:
    #     print("Waiting for dataset snapshot to complete...")
    
    # Step 3: Poll the API until data is ready
    for i in range(20):  # wait up to ~10 minutes
        time.sleep(30)
        print(f"Checking status... (attempt {i+1})")

        status_response = requests.get(
            f"https://api.brightdata.com/datasets/v3/snapshots?dataset_id={DATASET_ID}",
            headers=headers
        )
        status_data = status_response.json()

        # Find the most recent snapshot that has 'status': 'done'
        snapshots = status_data.get("data", [])
        done_snapshots = [s for s in snapshots if s.get("status") == "done"]
        if done_snapshots:
            snapshot_id = done_snapshots[0]["id"]
            print(f"Snapshot ready! ID: {snapshot_id}")
            break
    else:
        print("Timed out waiting for Bright Data snapshot.")
        return None

    # Step 4: Fetch the results
    print("Fetching dataset results...")
    results_response = requests.get(
        f"https://api.brightdata.com/datasets/v3/data?dataset_id={DATASET_ID}&format=json",
        headers=headers
    )

    if results_response.status_code != 200:
        print("Error fetching results:", results_response.text)
        return None

    data = results_response.json()
    print(f"Retrieved {len(data)} items.")
    return list(data)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Handle the --b argument.")
    parser.add_argument("--b", type=str, help="Value for argument b")
    args = parser.parse_args()

    if args.b:
        # Do something with args.b
        urls=get_urls_from_business_type(args.b)
        for url in urls:
            print(f"Url found: {url}")
        if(len(urls)==0):
            print("nothing fetched")
        else:
            print(get_videos_brightdata(urls[0].strip()))
        # Example: call a function or perform logic here
        # do_something(args.b)
    else:
        print(get_videos_brightdata("https://www.instagram.com/dlapiper".strip()))
        print("No --b argument provided.")
