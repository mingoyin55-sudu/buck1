import { BuckParams } from './types';

export const DEFAULT_PARAMS: BuckParams = {
  vin: 12,
  vout: 5,
  iout: 2,
  fsw: 100, // kHz
  l: 10,    // uH
  rdsOn: 50, // mOhm
  vf: 0.5,   // V
  dcr: 20,   // mOhm
  tr: 20,    // ns
  tf: 20,    // ns
};

export const COLORS = {
  primary: '#3b82f6', // blue-500
  grid: '#334155',    // slate-700
  text: '#cbd5e1',    // slate-300
  chartLine: '#10b981', // emerald-500
  chartArea: '#10b981', // emerald-500 (with opacity)
  pie: [
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#f43f5e', // rose
    '#f59e0b', // amber
    '#10b981', // emerald
  ]
};
