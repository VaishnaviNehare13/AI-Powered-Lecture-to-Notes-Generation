import os
import re
import urllib.parse as urlparse
import yt_dlp
import random
import time

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
]

def extract_video_id(url: str):
    """Extract YouTube Video ID safely."""
    try:
        parsed = urlparse.urlparse(url)

        if parsed.hostname in ('youtu.be', 'www.youtu.be'):
            return parsed.path[1:12]

        if parsed.hostname in (
            'youtube.com',
            'www.youtube.com',
            'm.youtube.com'
        ):
            if parsed.path == '/watch':
                return urlparse.parse_qs(parsed.query)['v'][0][:11]

            if parsed.path.startswith(
                ('/embed/', '/v/', '/shorts/', '/live/')
            ):
                return parsed.path.split('/')[2][:11]

    except Exception as e:
        print(f"[YouTubeService] Video ID extraction error: {e}")

    match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11})", url)

    if match:
        return match.group(1)

    return None


def download_audio_ytdlp(url: str, output_dir: str) -> str:
    """
    Downloads audio safely using yt-dlp.
    Uses anti-bot resistant headers.
    """

    print("[YouTubeService] Starting yt-dlp audio extraction...")

    os.makedirs(output_dir, exist_ok=True)

    max_retries = 3

    for attempt in range(max_retries):

        user_agent = random.choice(USER_AGENTS)

        print(f"[YouTubeService] Attempt {attempt+1}")

        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': os.path.join(output_dir, '%(id)s.%(ext)s'),

            'quiet': False,
            'no_warnings': True,
            'noplaylist': True,

            'nocheckcertificate': True,
            'ignoreerrors': False,

            'socket_timeout': 60,

            'geo_bypass': True,
            'geo_bypass_country': 'US',

            'retries': 10,
            'fragment_retries': 10,

            'extractaudio': True,
            'audioformat': 'mp3',
            'ffmpeg_location': r'D:\ffmpeg-2026-05-06-git-f2e5eff3ff-essentials_build\bin',



            'http_headers': {
                'User-Agent': user_agent,
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.youtube.com/',
                'Origin': 'https://www.youtube.com',
            },

            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:

                print("[YouTubeService] Downloading audio...")

                info = ydl.extract_info(url, download=True)

                audio_path = os.path.join(
                    output_dir,
                    f"{info['id']}.mp3"
                )

                print(f"[YouTubeService] Audio downloaded: {audio_path}")

                if os.path.exists(audio_path):
                    return audio_path

                raise Exception("Audio file not found after download.")

        except Exception as e:

            print(f"[YouTubeService] Download attempt failed: {e}")

            if attempt < max_retries - 1:
                print("[YouTubeService] Retrying...")
                time.sleep(3)
                continue

    raise Exception(
        "YouTube audio extraction failed after multiple retries."
    )