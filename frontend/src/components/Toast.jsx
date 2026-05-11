import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = ({ message, type = 'error', onClose }) => {
  
  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />,
          styles: "bg-emerald-50 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-100 shadow-emerald-500/10"
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />,
          styles: "bg-amber-50 dark:bg-amber-500/20 border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-100 shadow-amber-500/10"
        };
      case 'info':
        return {
          icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />,
          styles: "bg-blue-50 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/30 text-blue-800 dark:text-blue-100 shadow-blue-500/10"
        };
      case 'error':
      default:
        return {
          icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />,
          styles: "bg-red-50 dark:bg-red-500/20 border-red-200 dark:border-red-500/30 text-red-800 dark:text-red-100 shadow-red-500/10"
        };
    }
  };

  const { icon, styles } = getConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="fixed top-6 right-6 z-[100] max-w-sm w-full"
    >
      <div className={`p-4 rounded-xl shadow-lg border backdrop-blur-xl flex items-start gap-3 transition-colors ${styles}`}>
        {icon}
        <div className="flex-1">
          <p className="text-sm font-medium leading-relaxed">{message}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors shrink-0">
          <X className="w-4 h-4 opacity-70 hover:opacity-100" />
        </button>
      </div>
    </motion.div>
  );
};

export default Toast;
