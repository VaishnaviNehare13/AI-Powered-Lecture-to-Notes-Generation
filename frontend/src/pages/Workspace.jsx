import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GeneratorView from '../components/GeneratorView';
import ResultsDashboard from '../components/ResultsDashboard';
import Toast from '../components/Toast';
import axios from 'axios';

const Workspace = () => {
  const [status, setStatus] = useState('idle'); 
  const [results, setResults] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 5000);
  };

  const handleUpload = async (file) => {
    setStatus('uploading');
    setResults(null);
    const formData = new FormData();
    formData.append("file", file);

    const t1 = setTimeout(() => setStatus('transcribing'), 1500);
    const t2 = setTimeout(() => setStatus('generating'), 4500);

    try {
      const response = await axios.post('http://localhost:8000/upload-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      clearTimeout(t1); clearTimeout(t2);
      setStatus('pdf');
      setTimeout(() => {
        setResults(response.data);
        setStatus('idle');
      }, 1000);
    } catch (error) {
      clearTimeout(t1); clearTimeout(t2);
      console.error("Error generating notes:", error);
      const errMsg = error.response?.data?.detail || error.response?.data?.error || error.message;
      showToast(errMsg, 'error');
      setStatus('idle');
    }
  };

  const handleYoutubeSubmit = async (url) => {
    setStatus('uploading'); 
    setResults(null);
    
    const t1 = setTimeout(() => setStatus('downloading'), 800);
    const t2 = setTimeout(() => setStatus('transcribing'), 4000);
    const t3 = setTimeout(() => setStatus('generating'), 12000);
      
    try {
      const response = await axios.post('http://localhost:8000/youtube-notes', { url }, {
        headers: { 'Content-Type': 'application/json' }
      });
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      setStatus('pdf');
      setTimeout(() => {
        setResults(response.data);
        setStatus('idle');
      }, 800);
    } catch (error) {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      console.error("Error generating from Youtube:", error);
      const isFallback = error.response?.data?.detail?.fallback_upload;
      
      if (isFallback) {
        setStatus('fallback_upload');
      } else {
        setStatus('idle');
        const errMsg = error.response?.data?.detail?.message || error.response?.data?.detail || error.message;
        showToast(errMsg, 'error');
      }
    }
  };

  const handleSaveToLibrary = async () => {
    try {
      const payload = {
        title: results.title || "Generated Notes",
        topic_overview: results["topic-overview"] || [],
        markdown_content: results.formatted_notes || ''
      };
      const response = await axios.post('http://localhost:8000/save-note', payload);
      if(response.data.success) {
        showToast("Note saved to library successfully!", "success");
      }
    } catch(err) {
      console.error(err);
      showToast("Failed to save note to library.", "error");
    }
  };

  return (
    <div className="min-h-full pb-20 pt-6">
      <AnimatePresence>
        {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!results && (
          <motion.div key="hero" exit={{ opacity: 0, y: -20, filter: "blur(10px)" }} className="w-full">
            <GeneratorView onUpload={handleUpload} onYoutubeSubmit={handleYoutubeSubmit} status={status} setStatus={setStatus} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {results && (
        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="w-full flex justify-center mb-6">
          <button 
            onClick={() => setResults(null)}
            className="px-6 py-2.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 text-sm font-semibold transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            ← Back to Generator
          </button>
        </motion.div>
      )}

      {results && <ResultsDashboard data={results} onSaveToLibrary={handleSaveToLibrary} />}
    </div>
  );
};

export default Workspace;
