import React from 'react';
import { Menu, Search, Bell, Sun, Moon } from 'lucide-react';

const Topbar = ({ setMobileOpen, theme, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 h-16 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4">
        <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 focus-within:border-blue-500/50 dark:focus-within:border-blue-500/50 transition-colors shadow-sm">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input type="text" placeholder="Search your workspace..." className="bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 w-64" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors relative rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
        <button className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors relative rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
