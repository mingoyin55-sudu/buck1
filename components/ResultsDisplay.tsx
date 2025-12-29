import React from 'react';
import { CalculationResults, ConductionMode } from '../types';
import { Activity, Zap, TrendingDown, Percent } from 'lucide-react';

interface ResultsDisplayProps {
  results: CalculationResults;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const Card = ({ title, value, unit, icon: Icon, color }: any) => (
    <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-lg flex flex-col items-center justify-center text-center hover:bg-slate-800 transition-colors">
      <div className={`p-2 rounded-full bg-opacity-20 mb-2 ${color.replace('text-', 'bg-')}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <span className="text-xs text-slate-400 uppercase font-medium tracking-wide">{title}</span>
      <div className="text-xl font-bold text-slate-100 mt-1">
        {value} <span className="text-sm text-slate-500 font-normal">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Primary Efficiency Banner */}
      <div className={`relative overflow-hidden rounded-xl p-6 flex items-center justify-between border ${results.efficiency > 90 ? 'bg-emerald-900/20 border-emerald-500/30' : results.efficiency > 80 ? 'bg-blue-900/20 border-blue-500/30' : 'bg-orange-900/20 border-orange-500/30'}`}>
        <div>
            <h3 className="text-slate-300 font-medium mb-1">Total Efficiency</h3>
            <div className={`text-4xl font-bold ${results.efficiency > 90 ? 'text-emerald-400' : results.efficiency > 80 ? 'text-blue-400' : 'text-orange-400'}`}>
                {results.efficiency.toFixed(2)}%
            </div>
        </div>
        <div className="text-right">
            <div className="text-slate-300 font-medium mb-1">Total Power Loss</div>
            <div className="text-2xl font-bold text-slate-100">
                {results.losses.total.toFixed(2)} <span className="text-sm">W</span>
            </div>
        </div>
      </div>

      {/* Mode Indicator */}
      <div className={`flex items-center justify-center p-3 rounded-lg border text-sm font-semibold tracking-wide ${results.mode === ConductionMode.CCM ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
        Current Mode: {results.mode}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card 
          title="Duty Cycle" 
          value={(results.dutyCycle * 100).toFixed(1)} 
          unit="%" 
          icon={Percent} 
          color="text-blue-400" 
        />
        <Card 
          title="Inductor Ripple" 
          value={results.rippleCurrent.toFixed(2)} 
          unit="A" 
          icon={Activity} 
          color="text-violet-400" 
        />
        <Card 
          title="Peak Current" 
          value={results.peakCurrent.toFixed(2)} 
          unit="A" 
          icon={TrendingDown} 
          color="text-rose-400" 
        />
        <Card 
          title="Valley Current" 
          value={results.valleyCurrent.toFixed(2)} 
          unit="A" 
          icon={TrendingDown} 
          color="text-emerald-400" 
          // Rotate icon for visual variety
          className="transform rotate-180"
        />
      </div>
    </div>
  );
};

export default ResultsDisplay;
