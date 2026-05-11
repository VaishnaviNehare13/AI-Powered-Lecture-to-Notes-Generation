import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, TrendingUp, CheckCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm"
  >
    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
      <Icon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
    </div>
    <div>
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</h3>
    </div>
  </motion.div>
);

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 mt-6 px-4 max-w-7xl mx-auto w-full">
      <StatCard title="Notes Generated" value={stats?.totalNotes || 12} icon={FileText} delay={0.1} />
      <StatCard title="Hours Saved" value={`${stats?.hoursSaved || 48}h`} icon={Clock} delay={0.2} />
      <StatCard title="Accuracy Avg" value={`${stats?.accuracy || 98}%`} icon={CheckCircle} delay={0.3} />
      <StatCard title="Study Streak" value={`${stats?.streak || 5} Days`} icon={TrendingUp} delay={0.4} />
    </div>
  );
};

export default DashboardStats;
