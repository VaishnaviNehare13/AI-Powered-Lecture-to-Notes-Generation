from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import sqlite3
import json
from datetime import datetime

from notes_generator import generate_notes
from services.whisper_service import transcribe_audio_whisper
from services.processing_pipeline import process_youtube_video

DB_NAME = "notes.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            summary TEXT,
            key_learnings TEXT,
            important_concepts TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

try:
    import imageio_ffmpeg
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    ffmpeg_dir = os.path.dirname(ffmpeg_exe)
    
    ffmpeg_standard_path = os.path.join(ffmpeg_dir, "ffmpeg.exe")
    if not os.path.exists(ffmpeg_standard_path):
        shutil.copy(ffmpeg_exe, ffmpeg_standard_path)
        
    if ffmpeg_dir not in os.environ.get("PATH", ""):
        os.environ["PATH"] += os.pathsep + ffmpeg_dir
except ImportError:
    pass

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("Backend Started Successfully")
    init_db()
    
    # Check FFmpeg globally
    ffmpeg_path = shutil.which("ffmpeg")
    if ffmpeg_path is None:
        print("WARNING: FFmpeg not found in system PATH!")
        print("Whisper transcription and YouTube downloads will fail.")
        
    # Lazy load Whisper model on startup via the service
    from services.whisper_service import WhisperService
    WhisperService.get_model()


@app.get("/")
def home():
    return {"message": "Smart Notes Backend Running"}

class SaveNoteRequest(BaseModel):
    title: str
    markdown_content: str

@app.post("/save-note")
async def save_note(request: SaveNoteRequest):
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute('''
            INSERT INTO notes (title, summary, key_learnings, important_concepts)
            VALUES (?, ?, ?, ?)
        ''', (
            request.title,
            request.markdown_content,
            "[]",
            "[]"
        ))
        conn.commit()
        conn.close()
        return {"success": True, "message": "Note saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/library")
async def get_library():
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute('SELECT * FROM notes ORDER BY created_at DESC')
        rows = c.fetchall()
        
        notes = []
        for r in rows:
            date_str = ""
            if r["created_at"]:
                try:
                    date_str = datetime.strptime(r["created_at"], "%Y-%m-%d %H:%M:%S").strftime("%m/%d/%Y")
                except:
                    date_str = r["created_at"]

            notes.append({
                "id": r["id"],
                "title": r["title"],
                "date": date_str,
                "data": {
                    "topic-overview": [r["summary"]] if r["summary"] else [],
                    "key-points": json.loads(r["key_learnings"]) if r["key_learnings"] else [],
                    "important-concepts": json.loads(r["important_concepts"]) if r["important_concepts"] else []
                }
            })
        conn.close()
        return {"success": True, "notes": notes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/library/{note_id}")
async def delete_note(note_id: int):
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute('DELETE FROM notes WHERE id = ?', (note_id,))
        conn.commit()
        conn.close()
        return {"success": True, "message": "Note deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-video")
async def upload_video(file: UploadFile = File(...)):
    try:
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        uploads_dir = os.path.join(BASE_DIR, "uploads")
        os.makedirs(uploads_dir, exist_ok=True)

        file_path = os.path.join(uploads_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        transcript = transcribe_audio_whisper(file_path)
        notes_data = generate_notes(transcript)

        # Cleanup
        try:
            os.remove(file_path)
        except:
            pass

        return {
            "filename": file.filename,
            "transcript": transcript,
            "selected_sentences": notes_data.get("selected_sentences", []),
            "formatted_notes": notes_data.get("formatted_notes", "No notes generated.")
        }
    except Exception as e:
        print("ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

class YouTubeRequest(BaseModel):
    url: str

@app.post("/youtube-notes")
async def youtube_notes(request: YouTubeRequest):
    try:
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        uploads_dir = os.path.join(BASE_DIR, "uploads")
        os.makedirs(uploads_dir, exist_ok=True)
        
        result = process_youtube_video(request.url, uploads_dir)
        
        if not result.get("success"):
            # Returns a clean dictionary to the frontend indicating failure
            raise HTTPException(status_code=400, detail=result)
            
        return result
    except HTTPException as he:
        raise he
    except Exception as e:
        print("ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))