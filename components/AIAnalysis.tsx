import React, { useState } from 'react';
import { BuckParams, CalculationResults, AIAnalysisState } from '../types';
import { analyzeDesignWithGemini } from '../services/geminiService';
import { Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIAnalysisProps {
  params: BuckParams;
  results: CalculationResults;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ params, results }) => {
  const [state, setState] = useState<AIAnalysisState>({
    isLoading: false,
    response: null,
    error: null,
  });

  const handleAnalyze = async () => {
    setState({ isLoading: true, response: null, error: null });
    try {
      const analysis = await analyzeDesignWithGemini(params, results);
      setState({ isLoading: false, response: analysis, error: null });
    } catch (err) {
      setState({ 
        isLoading: false, 
        response: null, 
        error: "Failed to generate analysis. Please try again." 
      });
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/20 rounded-xl p-6 shadow-xl mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">AI Design Engineer</h2>
        </div>
        {!state.response && !state.isLoading && (
          <button
            onClick={handleAnalyze}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-blue-500/25"
          >
            <span>Analyze Design</span>
          </button>
        )}
      </div>

      {state.isLoading && (
        <div className="flex flex-col items-center justify-center py-8 text-blue-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm font-medium animate-pulse">Analyzing topology and efficiency...</p>
        </div>
      )}

      {state.error && (
        <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg flex items-center space-x-3 text-red-400">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{state.error}</span>
        </div>
      )}

      {state.response && (
        <div className="prose prose-invert prose-sm max-w-none bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
          <ReactMarkdown
             components={{
                h1: ({node, ...props}) => <h3 className="text-blue-300 font-bold text-base mb-2 mt-0" {...props} />,
                h2: ({node, ...props}) => <h4 className="text-blue-300 font-bold text-sm mb-2 mt-4" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 text-slate-300 ml-2" {...props} />,
                li: ({node, ...props}) => <li className="text-slate-300" {...props} />,
                p: ({node, ...props}) => <p className="text-slate-300 mb-2 leading-relaxed" {...props} />,
                strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
             }}
          >
            {state.response}
          </ReactMarkdown>
          <div className="mt-4 flex justify-end">
             <button 
               onClick={handleAnalyze}
               className="text-xs text-blue-400 hover:text-blue-300 underline"
             >
               Regenerate Analysis
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;
