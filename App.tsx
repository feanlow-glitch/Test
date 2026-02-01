
import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { QUESTIONS, CATEGORY_DESCRIPTIONS, CAREER_DATABASE, PATHWAYS_BY_CATEGORY } from './constants';
import { CategoryKey, QuizResults } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'quiz' | 'results'>('intro');
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [occupationSearch, setOccupationSearch] = useState('');
  
  // AI Insights State
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [groundingLinks, setGroundingLinks] = useState<{title: string, uri: string}[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
      .sort((a, b) => {
        if (scores[b] !== scores[a]) return scores[b] - scores[a];
        const order: CategoryKey[] = ['R', 'I', 'A', 'S', 'E', 'C'];
        return order.indexOf(a) - order.indexOf(b);
      })
      .slice(0, 3);

    return {
      scores,
      topThree,
      code: topThree.join('')
    };
  }, [answers]);

  const filteredOccupations = useMemo(() => {
    const allMatching = results.topThree.flatMap(key => CAREER_DATABASE[key]);
    const unique = Array.from(new Set(allMatching)) as string[];
    if (!occupationSearch) return unique;
    return unique.filter((occ: string) => occ.toLowerCase().includes(occupationSearch.toLowerCase()));
  }, [results, occupationSearch]);

  const fetchRealTimeInsights = async () => {
    setIsSearching(true);
    setAiInsights(null);
    setGroundingLinks([]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Based on the RIASEC career interest code "${results.code}" (Top interest: ${CATEGORY_DESCRIPTIONS[results.topThree[0]].title}), what are the top 5 high-demand careers and 3 trending college majors for 2025? Provide a concise summary and explain why they are trending. Use Google Search to ensure data is current.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text;
      setAiInsights(text || "Unable to fetch specific insights at this time.");
      
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const links = chunks
          .filter(chunk => chunk.web)
          .map(chunk => ({
            title: chunk.web?.title || "Reference",
            uri: chunk.web?.uri || ""
          }))
          .filter(link => link.uri);
        setGroundingLinks(links);
      }
    } catch (error) {
      console.error("AI Insight error:", error);
      setAiInsights("An error occurred while fetching real-time data. Please try again later.");
    } finally {
      setIsSearching(false);
    }
  };

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-14 text-center border border-blue-100">
          <div className="w-20 h-20 bg-blue-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4 tracking-tight">Career Pathfinder</h1>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed max-w-lg mx-auto">
            Discover your interests and find the right educational pathway for your future.
          </p>
          <button
            onClick={() => setStep('quiz')}
            className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95 text-lg"
          >
            Start Interest Assessment
          </button>
          <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-700">42</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Statements</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-700">6</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-700">100+</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Careers</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'quiz') {
    const q = QUESTIONS[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

    return (
      <div className="min-h-screen bg-[#f8fafc] p-4 md:p-12 flex flex-col items-center">
        <div className="max-w-xl w-full">
          <div className="mb-12">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Statement {currentQuestionIndex + 1} of 42</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-10 md:p-16 mb-8 min-h-[300px] flex flex-col justify-center text-center border border-slate-200 relative">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 leading-relaxed">
              {q.text}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(true)}
              className="py-5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg shadow-md transition-all active:scale-95 text-xl flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              Yes
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="py-5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 font-bold rounded-lg shadow-sm transition-all active:scale-95 text-xl flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
              No
            </button>
          </div>
          
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              className={`text-slate-400 hover:text-blue-700 text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${currentQuestionIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-100'}`}
              disabled={currentQuestionIndex === 0}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header Section */}
      <div className="bg-blue-900 text-white pt-20 pb-32 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1 bg-blue-800 text-blue-200 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-blue-700">Assessment Result</span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Your Holland Code: <span className="text-blue-300">{results.code}</span></h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium opacity-90 leading-relaxed max-w-2xl mx-auto">
            Your interests are primarily focused on <span className="text-white font-bold">{CATEGORY_DESCRIPTIONS[results.topThree[0]].title}</span> environments.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto -mt-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Real-time Insights (NEW) */}
            <section className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-blue-900 mb-1">2025 Career Insights</h2>
                  <p className="text-slate-500 text-sm">Powered by Google Search grounding for real-time market data.</p>
                </div>
                <button 
                  onClick={fetchRealTimeInsights}
                  disabled={isSearching}
                  className="px-6 py-3 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-400 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  {isSearching ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Updating Data...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Get Latest Trends
                    </>
                  )}
                </button>
              </div>

              {aiInsights ? (
                <div className="space-y-6">
                  <div className="prose prose-blue max-w-none text-slate-700 leading-relaxed">
                    <div className="whitespace-pre-wrap font-medium">{aiInsights}</div>
                  </div>
                  
                  {groundingLinks.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Sources & Further Reading</h4>
                      <div className="flex flex-wrap gap-3">
                        {groundingLinks.map((link, idx) => (
                          <a 
                            key={idx} 
                            href={link.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-md hover:bg-blue-100 transition-colors border border-blue-100"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            {link.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : !isSearching && (
                <div className="py-12 text-center border-2 border-dashed border-blue-50 rounded-xl">
                  <p className="text-slate-400 font-medium">Click the button above to discover current trending careers for your code.</p>
                </div>
              )}
            </section>

            {/* Interest Area Breakdown */}
            <section className="space-y-6">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Top Interest Areas</h2>
              {results.topThree.map((key) => {
                const desc = CATEGORY_DESCRIPTIONS[key];
                return (
                  <div key={key} className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden group hover:border-blue-200 transition-all">
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center font-black text-white text-xl shadow-md" style={{ backgroundColor: desc.color }}>
                          {key}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">{desc.title}</h3>
                        <div className="ml-auto text-right">
                          <span className="text-2xl font-black text-blue-900">{results.scores[key]}</span>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-widest">Score</span>
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed mb-8 italic font-medium">
                        "{desc.description}"
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
                        <div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Common Majors</h4>
                          <div className="flex flex-wrap gap-2">
                            {desc.majors.map(m => (
                              <span key={m} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-[11px] font-bold border border-blue-100">{m}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Career Pathways</h4>
                          <div className="flex flex-wrap gap-2">
                            {PATHWAYS_BY_CATEGORY[key].map(p => (
                              <span key={p} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-md text-[11px] font-bold border border-slate-200">{p}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Occupation Table */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 sticky top-8">
              <h3 className="text-lg font-bold text-blue-900 mb-6">Occupation List</h3>
              <div className="mb-6 relative">
                <input 
                  type="text" 
                  placeholder="Filter careers..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={occupationSearch}
                  onChange={(e) => setOccupationSearch(e.target.value)}
                />
                <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredOccupations.map(occ => (
                  <div key={occ} className="p-3 text-xs font-bold text-slate-600 bg-slate-50 rounded-md border border-slate-100 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-default">
                    {occ}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all"
                >
                  Retake Quiz
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default App;
