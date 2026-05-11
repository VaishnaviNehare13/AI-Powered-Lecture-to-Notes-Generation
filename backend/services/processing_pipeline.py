import os
import traceback
from .transcript_service import extract_transcript_api
from .youtube_service import extract_video_id, download_audio_ytdlp
from .whisper_service import transcribe_audio_whisper
from notes_generator import generate_notes

def process_youtube_video(url: str, uploads_dir: str):
    """
    Orchestrates the entire hybrid YouTube pipeline.
    Returns structured dicts that app.py can pass directly to the frontend.
    """
    video_id = extract_video_id(url)
    
    print(f"[Pipeline] Processing YouTube Video ID: {video_id} for URL: {url}")
    
    # STEP 1: Attempt direct transcript extraction
    transcript = extract_transcript_api(video_id)
    
    if transcript:
        print("[Pipeline] STEP 1: Transcript extraction SUCCESS.")
    else:
        print("[Pipeline] STEP 1: Transcript extraction FAILED.")
        
    # STEP 2 & 3: Fallback to yt-dlp audio extraction + Whisper
    if not transcript:
        try:
            print("[Pipeline] STEP 2: Downloading audio using yt-dlp fallback...")
            audio_path = download_audio_ytdlp(url, uploads_dir)
            print("[Pipeline] yt-dlp download SUCCESS.")
            
            print("[Pipeline] STEP 3: Starting Whisper transcription...")
            transcript = transcribe_audio_whisper(audio_path)
            print("[Pipeline] Whisper transcription SUCCESS.")
            
            # Cleanup temporary audio file
            try:
                os.remove(audio_path)
            except Exception as e:
                print(f"[Pipeline] Cleanup warning: {e}")
                
        except Exception as yt_error:
            print("[Pipeline] Hybrid extraction failed. Printing full exception:")
            traceback.print_exc()
            
            # Return safe structured error indicating manual fallback needed
            # ONLY return this if ALL METHODS FAIL.
            return {
                "success": False,
                "stage": "transcription",
                "message": f"YouTube Transcript Unavailable. All automated extraction methods failed. Please download the lecture and upload it manually. Details: {yt_error}",
                "fallback_upload": True
            }
            
    if not transcript or not transcript.strip():
        return {
            "success": False,
            "stage": "transcription",
            "message": "We could not extract any meaningful text from this video. Please upload manually.",
            "fallback_upload": True
        }
        
    # STEP 4: Generate Notes and Return
    try:
        print("[Pipeline] STEP 4: Generating smart notes from transcript...")
        notes_data = generate_notes(transcript)
        
        return {
            "success": True,
            "filename": f"YouTube Video ({video_id})" if video_id else "YouTube Video",
            "transcript": transcript,
            "selected_sentences": notes_data.get("selected_sentences", []),
            "formatted_notes": notes_data.get("formatted_notes", "No notes generated.")
        }
    except Exception as notes_err:
        print("[Pipeline] Notes generation failed. Printing full exception:")
        traceback.print_exc()
        return {
            "success": False,
            "stage": "structuring",
            "message": "Successfully transcribed, but failed to structure notes using the AI model."
        }
