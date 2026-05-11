import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, CheckCircle2, Circle, Clock, Plus } from 'lucide-react';

const mockTasks = [
  { id: 1, title: 'Review Machine Learning Notes', time: '10:00 AM', completed: true },
  { id: 2, title: 'Generate Notes for Calculus Lecture', time: '1:00 PM', completed: false },
  { id: 3, title: 'Complete Backpropagation Quiz', time: '3:30 PM', completed: false },
  { id: 4, title: 'Read Research Paper on LLMs', time: '5:00 PM', completed: false }
];

const Planner = () => {
  const [tasks, setTasks] = useState(mockTasks);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto w-full px-4 mb-20 pt-6"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-3 mb-2">
            <CalendarIcon className="w-8 h-8 text-blue-600 dark:text-blue-500" /> Study Planner
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Organize your daily academic goals and tasks.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-xl font-semibold shadow-sm transition-colors">
          <Plus className="w-5 h-5" /> New Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Task List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Today's Goals</h2>
            
            <div className="space-y-3">
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    task.completed 
                      ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 opacity-60' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                    )}
                    <span className={`font-semibold ${task.completed ? 'text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Clock className="w-4 h-4" /> {task.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Widget */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Weekly Goal</h3>
              <p className="text-indigo-100 text-sm mb-6">Complete 10 lecture notes and 5 quizzes.</p>
              
              <div className="w-full bg-white/20 rounded-full h-2.5 mb-2">
                <div className="bg-white h-2.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <p className="text-xs font-semibold text-right">40% Completed</p>
            </div>
            
            {/* Decorative background shape */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Planner;
