import os
from services.processing_pipeline import process_youtube_video

def main():
    urls = [
        "https://www.youtube.com/watch?v=7VYLpDkYI8M",
        "https://www.youtube.com/watch?v=aircAruvnKk"
    ]
    uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    
    for url in urls:
        print(f"\n======================================")
        print(f"Testing URL: {url}")
        print(f"======================================")
        result = process_youtube_video(url, uploads_dir)
        print("\n[Result Object]:")
        print({k: str(v)[:100] + "..." if isinstance(v, str) and len(str(v)) > 100 else v for k, v in result.items()})

if __name__ == "__main__":
    main()
