import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))
from services.transcript_service import extract_transcript_api

transcript = extract_transcript_api("kJQP7kiw5Fk")
if transcript:
    print("SUCCESS", len(transcript))
else:
    print("FAILED")
