import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, FileText, CheckCircle2 } from 'lucide-react';

const Analytics = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto w-full px-4 mb-20 pt-6"
    >
      <div className="flex flex-col items-start justify-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-500" /> Productivity Analytics
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Track your learning progress and time saved with AI.</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Notes", value: "24", icon: <FileText className="w-5 h-5 text-blue-500" />, color: "bg-blue-50 dark:bg-blue-500/10" },
          { label: "Hours Saved", value: "85h", icon: <Clock className="w-5 h-5 text-emerald-500" />, color: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "AI Accuracy", value: "94%", icon: <CheckCircle2 className="w-5 h-5 text-purple-500" />, color: "bg-purple-50 dark:bg-purple-500/10" },
          { label: "Study Streak", value: "12 Days", icon: <TrendingUp className="w-5 h-5 text-amber-500" />, color: "bg-amber-50 dark:bg-amber-500/10" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Mockup */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Learning Activity</h3>
          <div className="h-64 flex items-end justify-between gap-2 pb-6 border-b border-slate-100 dark:border-slate-800 relative">
            {/* Y-axis lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full border-b border-dashed border-slate-100 dark:border-slate-800" />
              ))}
            </div>
            
            {/* Bars */}
            {[40, 70, 45, 90, 65, 80, 50].map((height, idx) => (
              <div key={idx} className="w-full max-w-[40px] flex flex-col items-center gap-3 z-10 group">
                <div 
                  className="w-full bg-blue-100 dark:bg-blue-900/40 rounded-t-lg relative overflow-hidden transition-all group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50" 
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-0 w-full bg-blue-500" style={{ height: '100%' }} />
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Source Breakdown</h3>
          <div className="space-y-6">
            {[
              { label: 'YouTube Lectures', percentage: 65, color: 'bg-red-500' },
              { label: 'Audio Recordings', percentage: 25, color: 'bg-emerald-500' },
              { label: 'Video Files', percentage: 10, color: 'bg-blue-500' }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2 text-sm font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                  <span className="text-slate-500">{item.percentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
