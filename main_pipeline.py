from video_finder_backend import get_urls_from_business_type, get_videos_brightdata
from video_generation_prompting import generate_and_download_video
import time
import argparse
def init_user_and_get_data(business_type):
    all_urls=[]
    for i in range(20):
        insta_urls=get_urls_from_business_type(business_type)
        all_urls=all_urls+insta_urls
        if(len(all_urls)>=7):
            break
        time.sleep(0)
    all_vid_data=[]
    for url in all_urls:
        try:
            vid_data=get_videos_brightdata(url)
        except:
            continue
        if(vid_data==None):
            continue
        all_vid_data=all_vid_data+vid_data
        break
    return all_vid_data

def generate_vid_from_data(all_vid_data, client_name, client_audience):
    generate_and_download_video(all_vid_data, client_audience, client_name)

if __name__ == "__main__":
    while(True):
        time.sleep(5)
        f=open("buffer.txt", "r")
        s=f.read().split(";")
        f.close()
        if(len(s)>0):
            f=open('buffer.txt', 'w')
            f.write('')
            f.close()
            generate_vid_from_data(init_user_and_get_data(s[0]), s[1], s[2])