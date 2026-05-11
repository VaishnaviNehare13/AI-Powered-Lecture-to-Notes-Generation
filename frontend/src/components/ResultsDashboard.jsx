import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, FileText, Download, Bookmark, Copy, ChevronLeft, ChevronRight, Zap, Check, ListTree } from 'lucide-react';
import { jsPDF } from 'jspdf';
import MarkdownRenderer from './MarkdownRenderer';
import TableOfContents from './TableOfContents';

const Flashcard = ({ concept, definition }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div 
      className="relative w-full h-56 cursor-pointer group"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div 
        className="w-full h-full absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-md group-hover:border-blue-400 dark:group-hover:border-blue-500/50 transition-colors overflow-hidden"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <Zap className="w-6 h-6 text-blue-500 dark:text-blue-400 mb-2 opacity-50 shrink-0" />
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Concept</h3>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-3">{concept}</p>
          <span className="absolute bottom-4 text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">Tap to reveal</span>
        </div>
        
        {/* Back */}
        <div 
          className="absolute inset-0 bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-500/30 rounded-2xl flex flex-col items-center justify-start p-6 text-center shadow-lg overflow-hidden"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-3 shrink-0 uppercase tracking-wider w-full pb-2 border-b border-blue-100 dark:border-slate-800">Definition</h3>
          <div className="w-full flex-1 overflow-y-auto custom-scrollbar pr-2 flex items-center justify-center">
             <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-left w-full">{definition}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ResultsDashboard = ({ data, onSaveToLibrary }) => {
  const [copied, setCopied] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    if (data?.formatted_notes) {
      // Basic heuristic flashcard generation from markdown bullet points
      const lines = data.formatted_notes.split('\n').filter(l => l.startsWith('- ') || l.startsWith('* '));
      const cards = lines.slice(0, 5).map(line => {
        const text = line.replace(/^[-*]\s*/, '').replace(/\*\*/g, '');
        if(text.includes(':')) {
          const parts = text.split(':');
          return { concept: parts[0].trim(), definition: parts.slice(1).join(':').trim() };
        } else {
          const words = text.split(' ');
          const concept = words.slice(0, Math.min(4, words.length)).join(' ') + "...";
          return { concept, definition: text };
        }
      });
      setFlashcards(cards);
    }
  }, [data]);

  if (!data) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(data.formatted_notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Lecture Notes", 20, 20);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 28);
      doc.setTextColor(0);
      doc.setFontSize(12);
      
      const content = data.formatted_notes || "No notes available.";
      const lines = doc.splitTextToSize(content.replace(/#/g, ''), 170);
      
      let y = 40;
      lines.forEach(line => {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(line, 20, y);
        y += 7;
      });
      doc.save("Smart_Notes.pdf");
    } catch (e) {
      console.error(e);
      alert("Failed to generate PDF.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1400px] mx-auto w-full px-4 mb-10"
    >
      {/* Top Header Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm mb-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-500" />
          Academic Notes Generated
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={onSaveToLibrary} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors shadow-sm">
            <Bookmark className="w-4 h-4" /> Save
          </button>
          <button onClick={handleCopy} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-sm" title="Copy Markdown">
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm">
            <Download className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Column: TOC */}
        <div className="hidden lg:block w-56 xl:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm sticky top-24">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 mb-4">
              <ListTree className="w-4 h-4 text-blue-500" /> Navigation
            </h3>
            <TableOfContents content={data.formatted_notes} />
          </div>
        </div>

        {/* Center Column: Main Notes (MarkdownRenderer) */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm min-w-0">
          <MarkdownRenderer content={data.formatted_notes} />
        </div>

        {/* Right Column: Flashcards & Transcript Snippet */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-6">
          {flashcards.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> Key Concept Cards
              </h3>
              <Flashcard {...flashcards[flashcardIndex]} />
              <div className="flex items-center justify-between mt-4">
                <button 
                  onClick={() => setFlashcardIndex(prev => Math.max(0, prev - 1))}
                  disabled={flashcardIndex === 0}
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-slate-500">{flashcardIndex + 1} / {flashcards.length}</span>
                <button 
                  onClick={() => setFlashcardIndex(prev => Math.min(flashcards.length - 1, prev + 1))}
                  disabled={flashcardIndex === flashcards.length - 1}
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm h-64 flex flex-col">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-4 shrink-0">
              <FileText className="w-4 h-4 text-slate-500" /> Raw Transcript
            </h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar text-xs leading-loose text-slate-600 dark:text-slate-400 font-mono pr-2">
              {data.transcript ? (
                <p className="whitespace-pre-wrap">{data.transcript}</p>
              ) : (
                <span className="italic text-slate-500">No transcript available.</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ResultsDashboard;
