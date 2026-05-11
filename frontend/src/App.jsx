import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

// Layout Components
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Pages
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import Library from './pages/Library';
import FlashcardsPage from './pages/FlashcardsPage';
import QuizPage from './pages/QuizPage';
import RevisionHub from './pages/RevisionHub';
import Analytics from './pages/Analytics';
import Planner from './pages/Planner';
import AssistantChat from './pages/AssistantChat';
import Profile from './pages/Profile';

const FloatingAssistant = () => (
  <motion.div 
    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }}
    className="fixed bottom-6 right-6 z-40 hidden md:flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer hover:scale-110 transition-transform group"
  >
    <MessageSquare className="w-6 h-6 text-white" />
    <div className="absolute right-full mr-4 bg-slate-800 border border-slate-700 text-slate-200 text-sm px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
      Need help? Ask AI
    </div>
  </motion.div>
);

function App() {
  const [isMobileOpen, setMobileOpen] = useState(false);

  // Theme State
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('notesai-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('notesai-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30 transition-colors duration-300">
        
        <Sidebar 
          isMobileOpen={isMobileOpen} 
          setMobileOpen={setMobileOpen} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />

        <div className="flex-1 flex flex-col relative overflow-hidden h-full">
          <Topbar setMobileOpen={setMobileOpen} theme={theme} toggleTheme={toggleTheme} />

          <main className="flex-1 overflow-y-auto custom-scrollbar relative w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workspace" element={<Workspace />} />
              <Route path="/library" element={<Library />} />
              <Route path="/flashcards" element={<FlashcardsPage />} />
              <Route path="/quizzes" element={<QuizPage />} />
              <Route path="/revision" element={<RevisionHub />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/chat" element={<AssistantChat />} />
              <Route path="/profile" element={<Profile theme={theme} setTheme={setTheme} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <FloatingAssistant />
        </div>
      </div>
    </Router>
  );
}

export default App;
