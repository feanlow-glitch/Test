
import React, { useState, useMemo } from 'react';
import { QUESTIONS, CATEGORY_DESCRIPTIONS, CAREER_DATABASE, PATHWAYS_BY_CATEGORY } from './constants';
import { CategoryKey, QuizResults } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'quiz' | 'results'>('intro');
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswer = (val: boolean) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[currentQuestionIndex].id]: val }));
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(curr => curr + 1);
    } else {
      setStep('results');
    }
  };

  const results = useMemo((): QuizResults => {
    const scores: Record<CategoryKey, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    QUESTIONS.forEach(q => {
      if (answers[q.id]) {
        scores[q.category]++;
      }
    });

    const topThree = (Object.keys(scores) as CategoryKey[])
      .sort((a, b) => scores[b] - scores[a])
      .slice(0, 3);

    return {
      scores,
      topThree,
      code: topThree.join('')
    };
  }, [answers]);

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Pathfinder Career Quest</h1>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            Discover your professional personality using the RIASEC model. Answer 42 simple questions about your interests to find your matching career pathways.
          </p>
          <button
            onClick={() => setStep('quiz')}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-200"
          >
            Start Interest Test
          </button>
          <p className="mt-4 text-sm text-slate-400">Takes approximately 5-7 minutes</p>
        </div>
      </div>
    );
  }

  if (step === 'quiz') {
    const q = QUESTIONS[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
        <div className="max-w-xl w-full">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Question {currentQuestionIndex + 1} of 42</span>
              <span className="text-sm font-medium text-slate-400">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-6 min-h-[300px] flex flex-col justify-center text-center">
            <h2 className="text-2xl md:text-3xl font-medium text-slate-800 leading-snug">
              "{q.text}"
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(true)}
              className="py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 text-xl flex flex-col items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              YES
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="py-6 bg-white hover:bg-slate-50 text-slate-600 border-2 border-slate-200 font-bold rounded-2xl shadow-sm transition-all active:scale-95 text-xl flex flex-col items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              NO
            </button>
          </div>
          
          <button 
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            className="mt-8 text-slate-400 hover:text-slate-600 text-sm font-medium underline underline-offset-4 w-full"
            disabled={currentQuestionIndex === 0}
          >
            Go Back to Previous Question
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-emerald-600 text-white pt-16 pb-24 px-4 text-center">
        <h2 className="text-emerald-100 text-sm font-bold uppercase tracking-widest mb-2">Quiz Results</h2>
        <h1 className="text-5xl font-black mb-4">My Interest Code: {results.code}</h1>
        <p className="max-w-2xl mx-auto opacity-90 text-lg">
          Based on your answers, these are the three areas that best describe your vocational interests.
        </p>
      </div>

      <div className="max-w-6xl mx-auto -mt-12 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Top 3 Details */}
        <div className="lg:col-span-2 space-y-6">
          {results.topThree.map((key) => {
            const desc = CATEGORY_DESCRIPTIONS[key];
            const score = results.scores[key];
            return (
              <div key={key} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-sm mb-2">Category: {key}</span>
                    <h3 className="text-2xl font-bold text-slate-900">{desc.title}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-emerald-600">{score}</div>
                    <div className="text-xs text-slate-400 font-bold uppercase">Points</div>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {desc.description}
                </p>
                
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Matching Career Pathways</h4>
                <div className="flex flex-wrap gap-2">
                  {PATHWAYS_BY_CATEGORY[key].map(path => (
                    <span key={path} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200">
                      {path}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Score Summary & Occupations */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Score Breakdown
            </h3>
            <div className="space-y-4">
              {(Object.keys(results.scores) as CategoryKey[]).map(key => (
                <div key={key}>
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                    <span>{CATEGORY_DESCRIPTIONS[key].title}</span>
                    <span>{results.scores[key]}/7</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${results.topThree.includes(key) ? 'bg-emerald-500' : 'bg-slate-300'}`} 
                      style={{ width: `${(results.scores[key] / 7) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-900 text-white rounded-2xl shadow-lg p-6 overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4">Sample Occupations</h3>
              <p className="text-emerald-100 text-sm mb-6 leading-relaxed">
                Based on your primary interest ({CATEGORY_DESCRIPTIONS[results.topThree[0]].title}), here are some careers to explore:
              </p>
              <ul className="space-y-3">
                {CAREER_DATABASE[results.topThree[0]].slice(0, 10).map(occ => (
                  <li key={occ} className="flex items-center text-sm group">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    {occ}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => window.location.reload()}
                className="mt-8 w-full py-3 bg-white text-emerald-900 font-bold rounded-xl text-sm hover:bg-emerald-50 transition-colors"
              >
                Retake Assessment
              </button>
            </div>
            {/* Background Decoration */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
