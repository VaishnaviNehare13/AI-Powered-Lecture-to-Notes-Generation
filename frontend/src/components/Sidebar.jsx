import React from 'react';
import { 
  Brain, LayoutDashboard, History, Settings, Sparkles, User, Sun, Moon, LogOut,
  Zap, FileQuestion, BookMarked, BarChart3, CalendarDays, MessageSquare
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isMobileOpen, setMobileOpen, theme, toggleTheme }) => {
  
  const navLinkClass = ({ isActive }) => 
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive 
        ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' 
        : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
    }`;

  const handleMobileClose = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={handleMobileClose}
        />
      )}
      
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-all duration-300 flex flex-col shadow-2xl lg:shadow-none overflow-y-auto custom-scrollbar ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-800 dark:text-slate-100">Notes<span className="text-blue-500">AI</span></span>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1">
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">Menu</div>
          <NavLink to="/" onClick={handleMobileClose} className={navLinkClass}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </NavLink>
          <NavLink to="/workspace" onClick={handleMobileClose} className={navLinkClass}>
            <Brain className="w-4 h-4" /> AI Workspace
          </NavLink>
          <NavLink to="/library" onClick={handleMobileClose} className={navLinkClass}>
            <History className="w-4 h-4" /> Notes Library
          </NavLink>

          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-6 mb-3 px-2">Study Tools</div>
          <NavLink to="/flashcards" onClick={handleMobileClose} className={navLinkClass}>
            <Zap className="w-4 h-4" /> Flashcards
          </NavLink>
          <NavLink to="/quizzes" onClick={handleMobileClose} className={navLinkClass}>
            <FileQuestion className="w-4 h-4" /> Quizzes
          </NavLink>
          <NavLink to="/revision" onClick={handleMobileClose} className={navLinkClass}>
            <BookMarked className="w-4 h-4" /> Revision Hub
          </NavLink>
          <NavLink to="/chat" onClick={handleMobileClose} className={navLinkClass}>
            <MessageSquare className="w-4 h-4" /> AI Assistant
          </NavLink>

          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-6 mb-3 px-2">Progress</div>
          <NavLink to="/analytics" onClick={handleMobileClose} className={navLinkClass}>
            <BarChart3 className="w-4 h-4" /> Analytics
          </NavLink>
          <NavLink to="/planner" onClick={handleMobileClose} className={navLinkClass}>
            <CalendarDays className="w-4 h-4" /> Study Planner
          </NavLink>
        </nav>
        
        {/* User Profile & Theme Toggle Section */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-4 mt-4 shrink-0">
          <div className="flex items-center justify-between w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 pl-2">Theme</span>
            <button 
              onClick={toggleTheme}
              className="relative p-1.5 rounded-md bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>

          <NavLink to="/profile" onClick={handleMobileClose} className="flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Student</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Pro Plan</span>
              </div>
            </div>
            <Settings className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
