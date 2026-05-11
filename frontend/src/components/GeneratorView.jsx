import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle, MonitorPlay, FileAudio, Brain, Loader2, Upload, ArrowRight, Link as LinkIcon } from 'lucide-react';

const Hero = () => (
  <div className="py-12 text-center px-4 relative max-w-4xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold mb-6 shadow-sm transition-colors"
    >
      <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
      <span>AI Study Workspace</span>
    </motion.div>
    <motion.h1 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 mb-5 leading-tight transition-colors"
    >
      Transform Knowledge into <br className="hidden md:block"/>
      <span className="text-blue-600 dark:text-blue-500">Intelligent Insights</span>
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed transition-colors"
    >
      Upload audio, video, or a YouTube link. Our academic AI instantly extracts, categorizes, and beautifully structures your study material.
    </motion.p>
  </div>
);

const PipelineProgress = ({ status }) => {
  const steps = [
    { id: 'idle', label: 'Ready', icon: CheckCircle },
    { id: 'uploading', label: 'Processing', icon: MonitorPlay },
    { id: 'downloading', label: 'Downloading', icon: FileAudio },
    { id: 'transcribing', label: 'Transcribing', icon: Brain },
    { id: 'generating', label: 'Structuring', icon: Sparkles },
    { id: 'pdf', label: 'Finalizing', icon: CheckCircle }
  ];

  let currentIndex = steps.findIndex(s => s.id === status);
  if (currentIndex === -1) currentIndex = 0;

  return (
    <div className="w-full max-w-3xl mx-auto mb-10 px-4 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-colors">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-6 right-6 top-1/2 h-px bg-slate-200 dark:bg-slate-800 -z-10 -translate-y-1/2 transition-colors"></div>
        <div 
          className="absolute left-6 top-1/2 h-0.5 bg-blue-500 -z-10 -translate-y-1/2 transition-all duration-700 ease-in-out"
          style={{ width: `calc(${currentIndex * 20}% - 1.5rem)` }}
        ></div>
        
        {steps.map((step, idx) => {
          const isActive = idx === currentIndex && status !== 'idle';
          const isPast = idx < currentIndex || (status === 'idle' && idx === 0);
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                isActive ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-110' :
                isPast ? 'bg-white dark:bg-slate-800 text-blue-500 dark:text-blue-400 border border-slate-200 dark:border-slate-700' :
                'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800'
              }`}>
                {isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : <step.icon className="w-4 h-4" />}
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                isActive ? 'text-blue-600 dark:text-blue-400' : isPast ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400 dark:text-slate-600'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MediaInputSection = ({ onUpload, onYoutubeSubmit, status }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const isProcessing = status !== 'idle';

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (['mp3', 'wav', 'm4a', 'mp4'].includes(ext)) {
      setFile(selectedFile);
      setYoutubeUrl(''); 
    } else {
      alert("Invalid file type. Please upload .mp3, .wav, .m4a, or .mp4");
    }
  };

  const handleSubmit = () => {
    if (file) onUpload(file);
    else if (youtubeUrl) onYoutubeSubmit(youtubeUrl);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto w-full px-4 mb-20 relative z-20"
    >
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-8 shadow-sm transition-all duration-300 relative overflow-hidden ${dragActive ? 'border-blue-500/50 dark:border-blue-500/50 bg-blue-50 dark:bg-blue-500/5' : ''}`}>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          
          {/* File Upload Area */}
          <div 
            className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 group ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              id="audio-upload" 
              className="hidden" 
              accept=".mp3,.wav,.m4a,.mp4" 
              onChange={handleChange}
              disabled={isProcessing}
            />
            
            {!file ? (
              <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center w-full py-4">
                <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm mb-4 group-hover:scale-105 group-hover:border-blue-300 dark:group-hover:border-blue-500/30 transition-all duration-300">
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Upload Media</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Drag & drop or click to browse</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-3 font-semibold bg-white dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-200 dark:border-none">.MP4, .MP3, .WAV</p>
              </label>
            ) : (
              <div className="flex flex-col items-center w-full py-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-xl mb-3 border border-blue-200 dark:border-blue-500/20">
                  <FileAudio className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-full px-4">{file.name}</p>
                <p className="text-[10px] text-slate-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                <button onClick={() => setFile(null)} className="mt-4 text-[10px] font-bold uppercase tracking-wider text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 bg-red-50 dark:bg-red-400/10 hover:bg-red-100 dark:hover:bg-red-400/20 px-3 py-1.5 rounded-md transition-colors">Remove File</button>
              </div>
            )}
          </div>

          {/* OR Divider for Desktop */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full items-center justify-center z-10 text-[10px] font-bold text-slate-400 dark:text-slate-500">
            OR
          </div>

          {/* YouTube URL Area */}
          <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-8 md:pt-0 md:pl-8 group">
            <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm mb-4 mx-auto md:mx-0 transition-all duration-300 group-focus-within:border-blue-300 dark:group-focus-within:border-blue-500/30">
              <MonitorPlay className="w-6 h-6 text-slate-400 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1 text-center md:text-left">YouTube Link</h3>
            <p className="text-xs text-slate-500 mb-5 text-center md:text-left">Process public lecture videos directly</p>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="https://youtube.com/watch?v=..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                value={youtubeUrl}
                onChange={(e) => {
                  setYoutubeUrl(e.target.value);
                  setFile(null);
                }}
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-8 flex justify-center relative z-10 pt-6 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={handleSubmit}
            disabled={(!file && !youtubeUrl) || isProcessing}
            className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
          >
            {isProcessing ? 'Processing AI Pipeline...' : 'Generate Smart Notes'}
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const FallbackUI = ({ setStatus }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    className="max-w-2xl mx-auto w-full px-4 mb-20"
  >
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm text-center relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
      
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <FileAudio className="w-8 h-8 text-blue-500 dark:text-blue-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">YouTube Transcript Unavailable</h2>
      
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
        This YouTube video does not provide publicly accessible captions for AI processing.
        <br />Some videos restrict public transcript access due to platform limitations.
      </p>

      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 mb-8 flex flex-col items-center">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
          <Brain className="w-4 h-4 text-blue-500 dark:text-blue-400" /> Manual Upload Required
        </h4>
        <p className="text-xs text-slate-500 mb-4 text-center max-w-sm">
          Please upload the lecture audio or video file manually. Our AI will automatically process it using the Whisper Transcription pipeline.
        </p>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-[10px] font-bold text-slate-500 dark:text-slate-400">.MP4</span>
          <span className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-[10px] font-bold text-slate-500 dark:text-slate-400">.MP3</span>
          <span className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-[10px] font-bold text-slate-500 dark:text-slate-400">.WAV</span>
        </div>
      </div>

      <button 
        onClick={() => setStatus('idle')}
        className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2 w-full transition-all shadow-sm group"
      >
        <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> Use Manual Upload Instead
      </button>
    </div>
  </motion.div>
);

const GeneratorView = ({ onUpload, onYoutubeSubmit, status, setStatus }) => {
  return (
    <div className="w-full">
      <Hero />
      <AnimatePresence mode="wait">
        {status === 'fallback_upload' ? (
          <FallbackUI key="fallback" setStatus={setStatus} />
        ) : (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {status !== 'idle' && <PipelineProgress status={status} />}
            <MediaInputSection onUpload={onUpload} onYoutubeSubmit={onYoutubeSubmit} status={status} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GeneratorView;
