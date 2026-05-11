import torch
import numpy as np
import nltk
import re
from keybert import KeyBERT
from model_utils import model, embedding_model, device

# Ensure NLTK punkt is available for sentence splitting
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

from nltk.tokenize import sent_tokenize

print("Loading KeyBERT model...")
keybert_model = KeyBERT()
print("KeyBERT model loaded!")

def clean_filler_words(text: str) -> str:
    """Removes common colloquialisms and filler words to make transcript academic."""
    # List of filler words/phrases to remove
    fillers = [
        r'\b(so|okay|basically|right|hmm|uh|um|like|you know|i mean|sort of|kind of|let\'s say)\b',
        r'\b(as i said|to be honest|at the end of the day)\b'
    ]
    cleaned = text
    for filler in fillers:
        cleaned = re.sub(filler, '', cleaned, flags=re.IGNORECASE)
    
    # Fix spacing issues caused by removal
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    # Fix dangling commas
    cleaned = re.sub(r'\s+,', ',', cleaned)
    # Fix beginning of sentences (capitalize after space if needed)
    return cleaned

def generate_notes(transcript: str, top_n_ratio: float = 0.4):
    """
    1. Cleans transcript heavily.
    2. Embeds and scores sentences.
    3. Groups them into Introduction, Key Concepts, Detailed Explanation, Summary.
    """
    # 0. Clean transcript of random newlines and filler words
    clean_transcript = " ".join(transcript.split())
    clean_transcript = clean_filler_words(clean_transcript)

    # 1. Sentence Splitting
    raw_sentences = sent_tokenize(clean_transcript)
    
    # Filter out very short/noisy sentences
    sentences = [s.strip() for s in raw_sentences if len(s.split()) > 3]
    
    # Fallback if over-filtered
    if not sentences and raw_sentences:
        sentences = raw_sentences

    print(f"[DEBUG] Total raw sentences: {len(raw_sentences)}")
    print(f"[DEBUG] Sentences after filtering: {len(sentences)}")
    
    if not sentences:
        print("[DEBUG] No sentences found. Returning empty.")
        return {"selected_sentences": [], "formatted_notes": ""}

    # 2. Generate S-BERT embeddings
    embeddings = embedding_model.encode(sentences)
    
    # 3. BiLSTM Inference
    tensor_embeddings = torch.tensor(embeddings, dtype=torch.float32).unsqueeze(1).to(device)
    
    model.eval()
    with torch.no_grad():
        scores = model(tensor_embeddings)
        scores = scores.squeeze().cpu().numpy()

    if scores.ndim == 0:
        scores = np.array([scores])
        
    # 4. Rank and Select Important Sentences
    num_to_select = max(3, int(len(sentences) * top_n_ratio))
    top_indices = scores.argsort()[-num_to_select:][::-1] # Sort descending
    
    # Re-sort to chronological order for smooth reading
    top_indices_chrono = sorted(top_indices)
    selected_sentences = [sentences[i] for i in top_indices_chrono]
    
    # Remove duplicates
    seen = set()
    unique_selected = []
    for s in selected_sentences:
        if s not in seen:
            unique_selected.append(s)
            seen.add(s)

    # 5. Extract Overall Topic & Key Concepts
    keywords = keybert_model.extract_keywords(
        clean_transcript, 
        keyphrase_ngram_range=(1, 2), 
        stop_words='english', 
        top_n=5
    )
    
    main_topic = keywords[0][0].title() if keywords else "Lecture Notes"
    
    # Structure the Output
    formatted_notes = f"# {main_topic}\n\n"
    
    total_len = len(unique_selected)
    
    # A. Introduction (First 15% of selected sentences)
    intro_count = max(1, int(total_len * 0.15))
    intro_sentences = unique_selected[:intro_count]
    formatted_notes += "## Introduction\n\n"
    formatted_notes += " ".join([s.capitalize() for s in intro_sentences]) + "\n\n"
    
    # B. Key Concepts (Extract concepts from next batch of sentences)
    concept_count = max(2, int(total_len * 0.25))
    concept_sentences = unique_selected[intro_count : intro_count + concept_count]
    
    formatted_notes += "## Key Concepts\n\n"
    for sent in concept_sentences:
        # Extract 1 keyword from the sentence to use as the concept prefix
        s_kw = keybert_model.extract_keywords(sent, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=1)
        if s_kw:
            concept = s_kw[0][0].title()
            if sent.lower().startswith(concept.lower()):
                sent_stripped = sent[len(concept):].strip(' :-,.')
                formatted_notes += f"* **{concept}**: {sent_stripped.capitalize()}\n"
            else:
                formatted_notes += f"* **{concept}**: {sent.capitalize()}\n"
        else:
            formatted_notes += f"* {sent.capitalize()}\n"
    formatted_notes += "\n"
    
    # C. Detailed Explanation (Merge remaining body sentences into paragraphs)
    body_start = intro_count + concept_count
    summary_count = max(2, int(total_len * 0.15))
    body_end = total_len - summary_count
    
    body_sentences = unique_selected[body_start : body_end]
    
    formatted_notes += "## Detailed Explanation\n\n"
    
    # Chunk body sentences into paragraphs of ~3-4 sentences
    paragraph = []
    for i, sent in enumerate(body_sentences):
        paragraph.append(sent.capitalize())
        if len(paragraph) >= 3 or i == len(body_sentences) - 1:
            formatted_notes += " ".join(paragraph) + "\n\n"
            paragraph = []
            
    # D. Summary (Last few sentences, plus top overall scored sentence if missing)
    summary_sentences = unique_selected[body_end:]
    
    formatted_notes += "## Summary\n\n"
    for sent in summary_sentences:
        formatted_notes += f"- {sent.capitalize()}\n"

    final_notes = formatted_notes.strip()
    
    print("[DEBUG] Formatted Notes:\n", final_notes)

    return {
        "selected_sentences": unique_selected,
        "formatted_notes": final_notes
    }
