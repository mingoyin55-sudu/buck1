import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { CalculationResults } from '../types';
import { COLORS } from '../constants';

interface ChartsProps {
  results: CalculationResults;
}

const Charts: React.FC<ChartsProps> = ({ results }) => {
  // Prepare data for Pie Chart
  const lossData = [
    { name: 'FET Conduction', value: results.losses.mosfetConduction },
    { name: 'FET Switching', value: results.losses.mosfetSwitching },
    { name: 'Diode Cond.', value: results.losses.diodeConduction },
    { name: 'Diode Rev. Rec.', value: results.losses.diodeReverseRecovery },
    { name: 'Inductor DCR', value: results.losses.inductorDcr },
  ].filter(d => d.value > 0);

  const formatXAxis = (tickItem: number) => {
    return tickItem.toFixed(1);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-2 rounded shadow-lg text-xs">
          <p className="text-slate-300">{`Time: ${Number(label).toFixed(2)} μs`}</p>
          <p className="text-emerald-400 font-semibold">{`Current: ${payload[0].value.toFixed(2)} A`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Waveform Chart */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Inductor Current Waveform (IL)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={results.waveformPoints}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="time" 
                type="number" 
                domain={['dataMin', 'dataMax']} 
                tickFormatter={formatXAxis}
                stroke="#94a3b8"
                label={{ value: 'Time (μs)', position: 'insideBottomRight', offset: -5, fill: '#94a3b8', fontSize: 12 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#94a3b8" 
                label={{ value: 'Current (A)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
                tick={{ fontSize: 12 }}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="linear" 
                dataKey="current" 
                stroke={COLORS.chartLine} 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 6, fill: COLORS.chartLine }}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Loss Breakdown Chart */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Power Loss Breakdown</h3>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={lossData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {lossData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.pie[index % COLORS.pie.length]} />
                ))}
              </Pie>
              <Tooltip 
                 formatter={(value: number) => [`${value.toFixed(3)} W`, 'Loss']}
                 contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
              />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                iconSize={10}
                formatter={(value) => <span className="text-slate-400 text-xs ml-1">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;