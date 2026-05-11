import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookMarked, Calculator, FileCode2, Beaker, ChevronRight, FileText, Zap, Loader2 } from 'lucide-react';
import axios from 'axios';

const RevisionHub = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [recentTopics, setRecentTopics] = useState([]);
  const [cheatSheets, setCheatSheets] = useState([]);
  const [factOfTheDay, setFactOfTheDay] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get('http://localhost:8000/library');
        if (res.data.success) {
          const fetchedNotes = res.data.notes;
          setNotes(fetchedNotes);
          
          if (fetchedNotes.length > 0) {
            // 1. Recent Topics
            setRecentTopics(fetchedNotes.slice(0, 5));
            
            // Extract all bullet points and headers from all notes
            let allBullets = [];
            let allHeaders = [];
            
            fetchedNotes.forEach(note => {
              const content = note.data['topic-overview']?.[0];
              if (content) {
                const lines = content.split('\n');
                lines.forEach(line => {
                  if (line.startsWith('- ') || line.startsWith('• ')) {
                     allBullets.push({ text: line.replace(/^[•-]\s*/, '').replace(/\*\*/g, '').trim(), source: note.title });
                  } else if (line.startsWith('## ')) {
                     allHeaders.push({ title: line.replace('## ', '').trim(), noteTitle: note.title });
                  }
                });
              }
            });

            // 2. Fact of the Day
            if (allBullets.length > 0) {
              const randomFact = allBullets[Math.floor(Math.random() * allBullets.length)];
              setFactOfTheDay(randomFact);
            } else {
              setFactOfTheDay({ text: "Add more notes with bullet points to generate a daily fact!", source: "System" });
            }

            // 3. Cheat Sheets
            const icons = [
              { icon: <Calculator className="w-6 h-6 text-indigo-500" />, color: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20' },
              { icon: <FileCode2 className="w-6 h-6 text-emerald-500" />, color: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20' },
              { icon: <Beaker className="w-6 h-6 text-rose-500" />, color: 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20' },
              { icon: <Zap className="w-6 h-6 text-amber-500" />, color: 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20' },
            ];
            
            // Deduplicate headers
            const uniqueHeaders = Array.from(new Set(allHeaders.map(h => h.title)))
                                       .map(title => allHeaders.find(h => h.title === title));
                                       
            // Take up to 4 random headers
            const shuffled = uniqueHeaders.sort(() => 0.5 - Math.random());
            const selectedSheets = shuffled.slice(0, 4).map((header, idx) => ({
              id: idx,
              title: header.title,
              source: header.noteTitle,
              iconInfo: icons[idx % icons.length]
            }));
            setCheatSheets(selectedSheets);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-[500px]"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  if (notes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto w-full px-4 pt-20 text-center">
        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookMarked className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Your Revision Hub is empty</h2>
        <p className="text-slate-500">Generate notes in the workspace to automatically populate this dashboard!</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto w-full px-4 mb-20 pt-6"
    >
      <div className="flex flex-col items-start justify-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-3">
          <BookMarked className="w-8 h-8 text-blue-600 dark:text-blue-500" /> Revision Hub
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Quick access to essential concepts, dynamic cheat sheets, and summarized topics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Dynamic Cheat Sheets
            </h2>
            {cheatSheets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cheatSheets.map((sheet) => (
                  <div key={sheet.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:shadow-md hover:border-blue-300 dark:hover:border-slate-600 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${sheet.iconInfo.color}`}>
                        {sheet.iconInfo.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700 dark:text-slate-200 line-clamp-1">{sheet.title}</span>
                        <span className="text-xs text-slate-400 line-clamp-1">From: {sheet.source}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic text-sm">No formatted headers found in notes to generate cheat sheets.</p>
            )}
          </section>

          <section>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Insight of the Day</h2>
              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-8 text-center border border-slate-100 dark:border-slate-800">
                <span className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 leading-relaxed">"{factOfTheDay?.text}"</span>
              </div>
              <p className="mt-6 text-slate-600 dark:text-slate-400 leading-relaxed text-sm text-center">
                <strong>Source: {factOfTheDay?.source}</strong><br/>
                Refresh this page to discover a new concept from your study library.
              </p>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Recent Topics</h2>
            <div className="space-y-4">
              {recentTopics.map((topic) => (
                <div key={topic.id} className="flex flex-col border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 last:pb-0 cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-slate-400 mt-0.5 group-hover:text-blue-500 transition-colors shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-slate-800 dark:text-slate-200 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1 line-clamp-2 leading-snug">{topic.title}</span>
                      <span className="text-xs text-slate-400">{topic.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <a href="/library" className="block w-full text-center mt-6 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              View All Topics
            </a>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default RevisionHub;
