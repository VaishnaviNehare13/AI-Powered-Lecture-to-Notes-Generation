import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, FileText, Download, Trash2, Eye, Search, Filter, Loader2, BookOpen } from 'lucide-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const NotesHistory = ({ onReview }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:8000/library');
      if (res.data.success) {
        setNotes(res.data.notes);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/library/${id}`);
      setNotes(notes.filter(n => n.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadCard = (note) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(note.title, 20, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${note.date}`, 20, 30);
    
    let y = 45;
    Object.entries(note.data).forEach(([key, lines]) => {
      if(y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(14);
      doc.setTextColor(59, 130, 246); // Blue
      doc.text(key.replace('-', ' ').toUpperCase(), 20, y);
      y += 10;
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      lines.forEach(line => {
        const splitText = doc.splitTextToSize(`• ${line}`, 170);
        if(y + (splitText.length * 6) > 280) { doc.addPage(); y = 20; }
        doc.text(splitText, 20, y);
        y += splitText.length * 6 + 4;
      });
      y += 5;
    });
    doc.save(`${note.title.replace(/\s+/g, '_')}.pdf`);
  };

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-[500px]"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto w-full px-4 mb-20"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 transition-colors">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            Study Library
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Access, review, and manage your generated lecture notes.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 dark:text-slate-200 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-colors shadow-sm"
            />
          </div>
          <button className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm transition-colors">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-700">
            <FileText className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No notes found</h3>
          <p className="mt-2 text-sm text-slate-500">Your library is currently empty. Go generate some notes!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note, idx) => {
            const rawPreview = note.data['topic-overview']?.[0] || 'No preview available.';
            const preview = rawPreview.replace(/[#*`>-]/g, '').trim();
            return (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                key={note.id} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-tight">{note.title}</h3>
                  <button onClick={() => handleDelete(note.id)} className="text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-md p-1.5 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">📝 Lecture</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">📅 {note.date}</span>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">{preview}</p>
                
                <div className="flex gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50">
                  <button onClick={() => onReview && onReview(note)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white text-xs font-semibold transition-colors">
                    <Eye className="w-3.5 h-3.5" /> Review
                  </button>
                  <button onClick={() => handleDownloadCard(note)} className="flex items-center justify-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default NotesHistory;
