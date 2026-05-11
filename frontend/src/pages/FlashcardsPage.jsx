import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronLeft, ChevronRight, CheckCircle, XCircle, BrainCircuit, FileText, Loader2 } from 'lucide-react';
import axios from 'axios';

const Flashcard = ({ card, flipped, onFlip }) => {
  return (
    <div 
      className="relative w-full max-w-xl mx-auto h-80 cursor-pointer group"
      style={{ perspective: "1000px" }}
      onClick={onFlip}
    >
      <motion.div 
        className="w-full h-full absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-lg group-hover:border-blue-400 dark:group-hover:border-blue-500/50 transition-colors overflow-hidden"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <Zap className="w-8 h-8 text-blue-500 dark:text-blue-400 mb-4 opacity-50" />
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-widest">Concept</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{card.concept}</p>
          <span className="absolute bottom-6 text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">Tap to reveal</span>
        </div>
        
        {/* Back */}
        <div 
          className="absolute inset-0 bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-500/30 rounded-3xl flex flex-col items-center justify-start p-8 text-center shadow-xl overflow-hidden"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-widest w-full pb-3 border-b border-blue-100 dark:border-slate-800">Definition</h3>
          <div className="w-full flex-1 flex items-center justify-center overflow-y-auto custom-scrollbar">
             <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed text-left w-full">{card.definition}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FlashcardsPage = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get('http://localhost:8000/library');
        if (res.data.success) {
          setNotes(res.data.notes);
          if (res.data.notes.length > 0) {
            setSelectedNoteId(res.data.notes[0].id.toString());
          }
        }
      } catch (e) {
        console.error("Error fetching notes:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  useEffect(() => {
    if (selectedNoteId && notes.length > 0) {
      const note = notes.find(n => n.id.toString() === selectedNoteId);
      if (note && note.data['topic-overview'] && note.data['topic-overview'][0]) {
        const content = note.data['topic-overview'][0];
        const lines = content.split('\n').filter(l => l.startsWith('- ') || l.startsWith('• '));
        const cards = lines.map(line => {
          const text = line.replace(/^[•-]\s*/, '').replace(/\*\*/g, '').trim();
          if (text.includes(':')) {
            const parts = text.split(':');
            return { concept: parts[0].trim(), definition: parts.slice(1).join(':').trim() };
          } else {
            const words = text.split(' ');
            const concept = words.slice(0, Math.min(4, words.length)).join(' ') + "...";
            return { concept, definition: text };
          }
        });
        setFlashcards(cards.length > 0 ? cards : [{ concept: "No concepts found", definition: "Could not extract bullet points from this note." }]);
        setIndex(0);
        setFlipped(false);
      }
    }
  }, [selectedNoteId, notes]);

  const nextCard = () => {
    setFlipped(false);
    setTimeout(() => setIndex((prev) => Math.min(flashcards.length - 1, prev + 1)), 150);
  };

  const prevCard = () => {
    setFlipped(false);
    setTimeout(() => setIndex((prev) => Math.max(0, prev - 1)), 150);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-[500px]"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto w-full px-4 mb-20 pt-6"
    >
      <div className="flex flex-col items-center justify-center mb-10">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl flex items-center justify-center mb-4">
          <BrainCircuit className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">AI Flashcards</h1>
        <p className="text-slate-600 dark:text-slate-400 text-center max-w-lg mb-6">Master your lecture notes through active recall. Flip the cards to test your memory.</p>
        
        {/* Note Selector */}
        {notes.length > 0 && (
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm flex items-center gap-3">
            <FileText className="w-5 h-5 text-slate-400 shrink-0" />
            <select 
              value={selectedNoteId} 
              onChange={(e) => setSelectedNoteId(e.target.value)}
              className="w-full bg-transparent border-none text-slate-800 dark:text-slate-200 text-sm font-semibold focus:ring-0 cursor-pointer"
            >
              {notes.map(note => (
                <option key={note.id} value={note.id} className="dark:bg-slate-800">{note.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Your library is empty</h2>
          <p className="text-slate-500">Go to the Workspace and generate some notes to start reviewing flashcards!</p>
        </div>
      ) : (
        <div className="relative max-w-2xl mx-auto">
          {flashcards.length > 0 ? (
            <>
              <Flashcard 
                card={flashcards[index]} 
                flipped={flipped} 
                onFlip={() => setFlipped(!flipped)} 
              />

              <div className="flex items-center justify-between mt-8">
                <button 
                  onClick={prevCard}
                  disabled={index === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" /> Previous
                </button>
                
                <span className="text-sm font-bold text-slate-500">
                  {index + 1} <span className="text-slate-300 dark:text-slate-600">/</span> {flashcards.length}
                </span>

                <button 
                  onClick={nextCard}
                  disabled={index === flashcards.length - 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Action Ratings */}
              <AnimatePresence>
                {flipped && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex justify-center gap-4 mt-8"
                  >
                    <button onClick={nextCard} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors font-semibold text-sm">
                      <XCircle className="w-4 h-4" /> Hard
                    </button>
                    <button onClick={nextCard} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors font-semibold text-sm">
                      Good
                    </button>
                    <button onClick={nextCard} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors font-semibold text-sm">
                      <CheckCircle className="w-4 h-4" /> Easy
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-500">No flashcards could be generated from this note.</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default FlashcardsPage;
