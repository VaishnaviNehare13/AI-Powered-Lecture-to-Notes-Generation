import time
import traceback
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

def extract_transcript_api(video_id: str) -> str:
    """Attempts to extract transcript using youtube-transcript-api with retry logic."""
    if not video_id:
        return None
        
    print(f"[TranscriptService] Attempting direct transcript extraction for Video ID: {video_id}")
    
    # User Requirement 1: Use youtube-transcript-api as PRIMARY transcript method
    # and try YouTubeTranscriptApi.get_transcript(video_id)
    try:
        print("[TranscriptService] Trying YouTubeTranscriptApi.get_transcript()...")
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        transcript = " ".join([t['text'] for t in transcript_list])
        print(f"[TranscriptService] Successfully extracted transcript using get_transcript()!")
        return transcript
    except Exception as e:
        print(f"[TranscriptService] get_transcript() failed or not available: {e}")
        # Not printing full stack trace here yet because we have a fallback
    
    print("[TranscriptService] Trying fallback to YouTubeTranscriptApi.list()...")
    max_retries = 3
    
    for attempt in range(max_retries):
        try:
            api = YouTubeTranscriptApi()
            transcripts = api.list(video_id)
            
            try:
                transcript_obj = transcripts.find_transcript(['en'])
            except NoTranscriptFound:
                try:
                    transcript_obj = transcripts.find_generated_transcript(['en'])
                except NoTranscriptFound:
                    transcript_obj = next(iter(transcripts))
                    
            transcript_list = transcript_obj.fetch()
            transcript = " ".join([t['text'] for t in transcript_list])
            print(f"[TranscriptService] Successfully extracted transcript (Language: {transcript_obj.language})!")
            return transcript
            
        except TranscriptsDisabled:
            print("[TranscriptService] Transcripts are explicitly disabled for this video.")
            return None
            
        except Exception as e:
            print(f"[TranscriptService] Attempt {attempt+1} failed: {e}")
            if attempt == max_retries - 1:
                print("[TranscriptService] Exhausted retries. Printing full exception:")
                traceback.print_exc()
            if attempt < max_retries - 1:
                sleep_time = 2 ** attempt
                print(f"[TranscriptService] Retrying in {sleep_time} seconds...")
                time.sleep(sleep_time)
    
    print("[TranscriptService] Transcript extraction failed.")
    return None
