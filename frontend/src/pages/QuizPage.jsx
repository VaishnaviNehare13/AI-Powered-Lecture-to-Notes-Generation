import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, XCircle, ChevronRight, RotateCcw, FileText, Loader2 } from 'lucide-react';
import axios from 'axios';

const QuizPage = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get('http://localhost:8000/library');
        if (res.data.success) {
          setNotes(res.data.notes);
          if (res.data.notes.length > 0) {
            setSelectedNoteId(res.data.notes[0].id.toString());
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const generateQuizFromNote = (note) => {
    if (!note || !note.data['topic-overview'] || !note.data['topic-overview'][0]) return [];
    
    const content = note.data['topic-overview'][0];
    const lines = content.split('\n').filter(l => l.startsWith('- ') || l.startsWith('• '));
    
    // Clean lines
    const sentences = lines.map(line => line.replace(/^[•-]\s*/, '').replace(/\*\*/g, '').trim()).filter(s => s.length > 20);
    
    if (sentences.length < 2) return [];

    const generatedQuestions = [];
    const maxQuestions = Math.min(5, sentences.length); // Max 5 questions per quiz
    
    // Basic heuristic to pick a blank word
    const extractBlank = (sentence) => {
       const words = sentence.split(' ');
       // Try to find a capitalized word not at start
       for(let i = 1; i < words.length; i++) {
         if (words[i].length > 4 && /^[A-Z]/.test(words[i])) {
           return { word: words[i], index: i };
         }
       }
       // Fallback: pick the first word longer than 5 chars
       for(let i = 0; i < words.length; i++) {
         if (words[i].length > 5) {
           return { word: words[i], index: i };
         }
       }
       // Fallback: pick middle word
       const mid = Math.floor(words.length / 2);
       return { word: words[mid], index: mid };
    };

    // All long words to use as distractors
    const allWords = sentences.join(' ').split(' ').filter(w => w.length > 4).map(w => w.replace(/[^a-zA-Z]/g, ''));

    for (let i = 0; i < maxQuestions; i++) {
      const sentence = sentences[i];
      const words = sentence.split(' ');
      const blankInfo = extractBlank(sentence);
      
      if (!blankInfo) continue;

      const blankWord = blankInfo.word;
      const cleanBlankWord = blankWord.replace(/[^a-zA-Z]/g, '');
      
      const qText = words.map((w, idx) => idx === blankInfo.index ? '_____' : w).join(' ');
      
      // Generate distractors
      const distractors = new Set();
      let attempts = 0;
      while(distractors.size < 3 && attempts < 50) {
        attempts++;
        const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
        if (randomWord && randomWord.toLowerCase() !== cleanBlankWord.toLowerCase() && randomWord.length > 3) {
           distractors.add(randomWord);
        }
      }
      
      // If we couldn't find enough distractors, add some generic ones
      const fallbacks = ["Algorithm", "Process", "System", "Function", "Variable", "Component"];
      while(distractors.size < 3) {
        distractors.add(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
      }
      
      const options = [cleanBlankWord, ...Array.from(distractors).slice(0, 3)];
      // Shuffle options
      options.sort(() => Math.random() - 0.5);
      
      const correctIdx = options.findIndex(o => o === cleanBlankWord);
      
      generatedQuestions.push({
        id: i,
        question: `Fill in the blank: ${qText}`,
        options: options,
        correctAnswer: correctIdx,
        explanation: `The full sentence was: ${sentence}`
      });
    }
    
    return generatedQuestions;
  };

  useEffect(() => {
    if (selectedNoteId && notes.length > 0) {
      const note = notes.find(n => n.id.toString() === selectedNoteId);
      const generated = generateQuizFromNote(note);
      setQuestions(generated);
      setCurrentQ(0);
      setSelected(null);
      setIsSubmitted(false);
      setScore(0);
    }
  }, [selectedNoteId, notes]);

  const question = questions[currentQ];

  const handleSelect = (idx) => {
    if(!isSubmitted) setSelected(idx);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if(selected === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setIsSubmitted(false);
    setCurrentQ(currentQ + 1);
  };

  const handleRestart = () => {
    setSelected(null);
    setIsSubmitted(false);
    setCurrentQ(0);
    setScore(0);
  };

  if (loading) return <div className="flex items-center justify-center h-[500px]"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  if (notes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto w-full px-4 pt-20 text-center">
        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Your library is empty</h2>
        <p className="text-slate-500">Generate some notes in the workspace to take quizzes!</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto w-full px-4 mb-20 pt-6 text-center">
         {/* Note Selector */}
         <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm flex items-center gap-3 mb-10">
          <FileText className="w-5 h-5 text-slate-400 shrink-0" />
          <select 
            value={selectedNoteId} 
            onChange={(e) => setSelectedNoteId(e.target.value)}
            className="w-full bg-transparent border-none text-slate-800 dark:text-slate-200 text-sm font-semibold focus:ring-0 cursor-pointer"
          >
            {notes.map(note => (
              <option key={note.id} value={note.id} className="dark:bg-slate-800">{note.title}</option>
            ))}
          </select>
        </div>
        <div className="p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Not enough content to generate a quiz.</h3>
           <p className="text-slate-500 mt-2">Try selecting a different note with more bullet points.</p>
        </div>
      </motion.div>
    );
  }

  if(currentQ >= questions.length) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto w-full px-4 pt-20 text-center">
        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">Quiz Completed!</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">You scored <span className="font-bold text-blue-600 dark:text-blue-400">{score}</span> out of {questions.length}.</p>
        <button onClick={handleRestart} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto transition-colors">
          <RotateCcw className="w-5 h-5" /> Retake Quiz
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto w-full px-4 mb-20 pt-6"
    >
      <div className="flex flex-col items-center justify-center mb-10">
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl flex items-center justify-center mb-4">
          <Target className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">Knowledge Check</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Test your understanding of the generated lecture concepts.</p>

        {/* Note Selector */}
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm flex items-center gap-3">
          <FileText className="w-5 h-5 text-slate-400 shrink-0" />
          <select 
            value={selectedNoteId} 
            onChange={(e) => setSelectedNoteId(e.target.value)}
            className="w-full bg-transparent border-none text-slate-800 dark:text-slate-200 text-sm font-semibold focus:ring-0 cursor-pointer"
          >
            {notes.map(note => (
              <option key={note.id} value={note.id} className="dark:bg-slate-800">{note.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${((currentQ) / questions.length) * 100}%` }}
          />
        </div>

        <div className="flex justify-between items-center mb-8">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Question {currentQ + 1} of {questions.length}</span>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400">Score: {score}</span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 leading-relaxed">
          {question.question}
        </h2>

        <div className="space-y-4 mb-10">
          {question.options.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrect = idx === question.correctAnswer;
            
            let stateClass = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-blue-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300";
            let icon = null;

            if (isSubmitted) {
              if (isCorrect) {
                stateClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20";
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
              } else if (isSelected) {
                stateClass = "border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300";
                icon = <XCircle className="w-5 h-5 text-red-500" />;
              } else {
                stateClass = "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-50 text-slate-500";
              }
            } else if (isSelected) {
              stateClass = "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20";
            }

            return (
              <button 
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isSubmitted}
                className={`w-full text-left p-5 rounded-2xl border flex items-center justify-between transition-all duration-200 ${stateClass}`}
              >
                <span className="font-medium">{opt}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8 p-6 bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-2xl">
            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-400 mb-2">Explanation</h4>
            <p className="text-sm text-blue-900/80 dark:text-slate-300 leading-relaxed">{question.explanation}</p>
          </motion.div>
        )}

        <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
          {!isSubmitted ? (
            <button 
              onClick={handleSubmit}
              disabled={selected === null}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="px-8 py-3 bg-slate-800 dark:bg-slate-100 hover:bg-slate-700 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl font-semibold flex items-center gap-2 transition-colors"
            >
              Next Question <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default QuizPage;
