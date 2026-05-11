import sys
import os

# Add the root directory to sys.path so we can import backend modules
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from backend.notes_generator import generate_notes

transcript = "Artificial intelligence is a branch of computer science. It focuses on building smart machines capable of performing tasks that typically require human intelligence. Machine learning is a subset of AI. Deep learning is a subset of machine learning. Neural networks learn patterns."

try:
    print("Running generate_notes...")
    result = generate_notes(transcript)
    print("Result:", result)
except Exception as e:
    print("Error:", repr(e))
