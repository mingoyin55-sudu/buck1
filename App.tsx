import React, { useState, useEffect, useMemo } from 'react';
import { BuckParams, CalculationResults } from './types';
import { DEFAULT_PARAMS } from './constants';
import { calculateBuckConverter } from './utils/calculations';
import InputSection from './components/InputSection';
import ResultsDisplay from './components/ResultsDisplay';
import Charts from './components/Charts';
import AIAnalysis from './components/AIAnalysis';
import { Zap } from 'lucide-react';

const App: React.FC = () => {
  const [params, setParams] = useState<BuckParams>(DEFAULT_PARAMS);

  // Memoize calculations to prevent unnecessary re-runs
  // However, since calculation is cheap and inputs drive it directly, standard useMemo is fine.
  const results: CalculationResults = useMemo(() => {
    return calculateBuckConverter(params);
  }, [params]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12 selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  Buck<span className="text-blue-500">Master</span>
                </h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Converter Design Tool</p>
              </div>
            </div>
            <div className="text-sm text-slate-400 hidden sm:block">
              v1.0.0
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="xl:col-span-4 space-y-6">
            <InputSection params={params} setParams={setParams} />
            
            {/* Quick Tips */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Design Tips</h4>
              <ul className="text-xs text-slate-500 space-y-2 list-disc list-inside">
                <li>Higher frequency reduces inductor size but increases switching loss.</li>
                <li>Ensure inductor saturation current is &gt; Peak Current.</li>
                <li>DCM mode occurs at light loads; check stability requirements.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Visualization & Results */}
          <div className="xl:col-span-8 space-y-6">
            <ResultsDisplay results={results} />
            <Charts results={results} />
            <AIAnalysis params={params} results={results} />
          </div>

        </div>
      </main>
      
      <footer className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} BuckMaster Design Tool. Powered by React, Recharts & Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
