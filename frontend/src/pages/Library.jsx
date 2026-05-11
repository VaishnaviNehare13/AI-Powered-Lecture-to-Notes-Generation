import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotesHistory from '../components/NotesHistory';
import ResultsDashboard from '../components/ResultsDashboard';
import { ChevronLeft } from 'lucide-react';

const Library = () => {
  const [selectedNote, setSelectedNote] = useState(null);

  const handleReview = (note) => {
    setSelectedNote(note);
  };

  const handleBack = () => {
    setSelectedNote(null);
  };

  // Map the Library note structure to what ResultsDashboard expects
  const dashboardData = selectedNote ? {
    title: selectedNote.title,
    formatted_notes: selectedNote.data?.['topic-overview']?.[0] || '',
    transcript: null // We don't save the raw transcript in DB currently
  } : null;

  return (
    <div className="min-h-full pb-20 pt-6 relative">
      <AnimatePresence mode="wait">
        {!selectedNote ? (
          <motion.div 
            key="history"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <NotesHistory onReview={handleReview} />
          </motion.div>
        ) : (
          <motion.div 
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full max-w-7xl mx-auto px-4"
          >
            <div className="mb-6 flex items-center justify-between">
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm font-semibold text-sm"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Library
              </button>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 line-clamp-1 max-w-md text-center">{selectedNote.title}</h2>
              <div className="w-24 shrink-0"></div> {/* Spacer for centering */}
            </div>
            
            <ResultsDashboard 
              data={dashboardData} 
              onSaveToLibrary={() => {}} // Note is already in library
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Library;
