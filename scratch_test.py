import urllib.parse as urlparse
import re

def extract_video_id(url: str):
    try:
        parsed = urlparse.urlparse(url)
        if parsed.hostname in ('youtu.be', 'www.youtu.be'):
            return parsed.path[1:12]
        if parsed.hostname in ('youtube.com', 'www.youtube.com', 'm.youtube.com'):
            if parsed.path == '/watch':
                return urlparse.parse_qs(parsed.query)['v'][0][:11]
            if parsed.path.startswith(('/embed/', '/v/', '/shorts/', '/live/')):
                return parsed.path.split('/')[2][:11]
    except Exception:
        pass
        
    match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11})", url)
    if match:
        return match.group(1)
    return None

print(extract_video_id("https://www.youtube.com/watch?v=kJQP7kiw5Fk"))
print(extract_video_id("https://youtu.be/kJQP7kiw5Fk"))

from youtube_transcript_api import YouTubeTranscriptApi
print(YouTubeTranscriptApi.get_transcript("kJQP7kiw5Fk"))
