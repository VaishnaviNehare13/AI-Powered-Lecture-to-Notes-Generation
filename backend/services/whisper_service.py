import os
import shutil
import whisper

class WhisperService:
    _instance = None
    _model = None
    
    @classmethod
    def get_model(cls):
        """Lazy loads the Whisper model to save memory during startup."""
        if cls._model is None:
            print("[WhisperService] Loading Whisper 'base' model for the first time...")
            cls._model = whisper.load_model("tiny")
            print("[WhisperService] Model loaded successfully.")
        return cls._model

def transcribe_audio_whisper(file_path: str) -> str:
    """Transcribes audio file using the locally managed Whisper model."""
    if not os.path.exists(file_path):
        raise Exception("Audio file not found for transcription.")
        
    if shutil.which("ffmpeg") is None:
        raise Exception("FFmpeg is missing from the system. Cannot process audio file.")
        
    print(f"[WhisperService] Transcribing audio via Whisper: {file_path}")
    model = WhisperService.get_model()
    result = model.transcribe(file_path)
    return result["text"].strip()
