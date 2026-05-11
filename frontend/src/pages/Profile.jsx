import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, CreditCard, LogOut, Moon, Sun, Monitor, Bell } from 'lucide-react';

const Profile = ({ theme, setTheme }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto w-full px-4 mb-20 pt-6"
    >
      <div className="flex flex-col items-center justify-center mb-10 text-center">
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-md mb-4">
          <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-1">Student User</h1>
        <p className="text-slate-500 dark:text-slate-400">Pro Plan Member</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Settings Menu */}
        <div className="md:col-span-1 space-y-2">
          {[
            { icon: <User className="w-5 h-5" />, label: 'Account Details', active: true },
            { icon: <Settings className="w-5 h-5" />, label: 'Preferences', active: false },
            { icon: <Bell className="w-5 h-5" />, label: 'Notifications', active: false },
            { icon: <CreditCard className="w-5 h-5" />, label: 'Subscription', active: false },
          ].map((item, idx) => (
            <button key={idx} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              item.active 
                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}>
              {item.icon} {item.label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Appearance</h2>
            
            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Theme Preference</p>
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                    theme === 'light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Sun className="w-6 h-6" /> Light
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                    theme === 'dark' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Moon className="w-6 h-6" /> Dark
                </button>
                <button 
                  onClick={() => {
                    localStorage.removeItem('theme');
                    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    setTheme(isSystemDark ? 'dark' : 'light');
                  }}
                  className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400 transition-all"
                >
                  <Monitor className="w-6 h-6" /> System
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Account Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Email Address</label>
                <input type="email" disabled value="student@university.edu" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Password</label>
                <button className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-semibold transition-colors text-sm">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Profile;
