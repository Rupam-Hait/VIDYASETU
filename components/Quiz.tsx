import React, { useState } from 'react';
import { BrainCircuit, CheckCircle, XCircle, Trophy, ArrowRight, Loader } from 'lucide-react';
import { generateQuizQuestions } from '../services/geminiService';
import { QuizQuestion } from '../types';

export const Quiz: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const startQuiz = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setQuestions([]);
    setShowResult(false);
    setScore(0);
    setCurrentQuestion(0);

    const quizData = await generateQuizQuestions(topic);
    setQuestions(quizData);
    setLoading(false);
  };

  const handleAnswer = (index: number) => {
    setSelectedOption(index);
    // Auto advance after short delay
    setTimeout(() => {
      if (index === questions[currentQuestion].correctAnswer) {
        setScore(prev => prev + 1);
      }
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setTopic('');
    setQuestions([]);
    setShowResult(false);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedOption(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <BrainCircuit className="text-cyan-400 w-8 h-8" /> 
        AI Knowledge Quiz
      </h2>

      {questions.length === 0 && !loading && (
        <div className="glass-panel p-8 rounded-2xl text-center">
          <h3 className="text-xl text-white mb-4">What do you want to test yourself on?</h3>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Photosynthesis, World War II, Calculus"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && startQuiz()}
            />
            <button 
              onClick={startQuiz}
              disabled={!topic.trim()}
              className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition disabled:opacity-50"
            >
              Start Quiz
            </button>
          </div>
          <p className="text-slate-400 mt-6 text-sm">
            Powered by Gemini AI • Generates unique questions every time
          </p>
        </div>
      )}

      {loading && (
        <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center animate-fadeIn">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-xl text-cyan-400 font-bold animate-pulse">Generating your quiz...</p>
          <p className="text-slate-400 mt-2">Preparing questions on "{topic}"</p>
        </div>
      )}

      {!loading && !showResult && questions.length > 0 && (
        <div className="glass-panel p-6 md:p-10 rounded-2xl animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-400 font-mono text-sm">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-cyan-400 font-bold">Score: {score}</span>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white leading-relaxed">
              {questions[currentQuestion].question}
            </h3>
          </div>

          <div className="grid gap-4">
            {questions[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedOption !== null}
                className={`p-4 rounded-xl text-left transition-all border ${
                  selectedOption === idx 
                    ? idx === questions[currentQuestion].correctAnswer 
                      ? 'bg-green-500/20 border-green-500 text-green-300'
                      : 'bg-red-500/20 border-red-500 text-red-300'
                    : 'bg-slate-800 border-slate-700 hover:border-cyan-500 hover:bg-slate-750 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                     selectedOption === idx
                      ? 'border-current'
                      : 'border-slate-600 bg-slate-900'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  {option}
                  {selectedOption !== null && idx === questions[currentQuestion].correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                  )}
                  {selectedOption === idx && idx !== questions[currentQuestion].correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {showResult && (
        <div className="glass-panel p-10 rounded-2xl text-center animate-fadeIn">
          <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-bounce" />
          <h3 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h3>
          <p className="text-slate-400 mb-8">You tested your knowledge on <span className="text-cyan-400">{topic}</span></p>
          
          <div className="inline-block p-6 rounded-2xl bg-slate-800 border border-slate-700 mb-8">
            <span className="block text-sm text-slate-500 uppercase tracking-wider mb-1">Final Score</span>
            <span className="text-5xl font-bold text-white">{score} <span className="text-2xl text-slate-500">/ {questions.length}</span></span>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={resetQuiz}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition"
            >
              Take Another Quiz <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
