import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))
from services.youtube_service import download_audio_ytdlp

try:
    audio_path = download_audio_ytdlp("https://www.youtube.com/watch?v=kJQP7kiw5Fk", "backend/uploads")
    print("SUCCESS yt-dlp", audio_path)
except Exception as e:
    print("FAILED yt-dlp", e)
