import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, Clock, BookOpen, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto w-full px-4 mb-20 pt-6"
    >
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
          Welcome back, Student 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Ready to conquer your next lecture?</p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Link to="/workspace" className="block group">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 relative overflow-hidden shadow-md transition-transform hover:scale-[1.02]">
            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500">
              <Brain className="w-48 h-48 text-white" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Generate Notes</h2>
              <p className="text-blue-100 text-sm max-w-sm mb-6">Upload a lecture audio, video, or YouTube link to instantly extract structured notes.</p>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-semibold rounded-lg transition-colors">
                Start Workspace <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
        
        <Link to="/flashcards" className="block group">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-amber-500 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Quick Review</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm mb-6">Jump back into your flashcards. You have 12 cards pending review today.</p>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-semibold rounded-lg transition-colors">
                Start Review <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Overview */}
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Study Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
            <BookOpen className="w-6 h-6 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Notes Library</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">24</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
            <Clock className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Hours Saved</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">85h</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center border border-purple-100 dark:border-purple-500/20">
            <TrendingUp className="w-6 h-6 text-purple-500 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Study Streak</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">12 Days</h3>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default Dashboard;
