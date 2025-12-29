export interface BuckParams {
  vin: number;      // Input Voltage (V)
  vout: number;     // Output Voltage (V)
  iout: number;     // Output Current (A)
  fsw: number;      // Switching Frequency (kHz)
  l: number;        // Inductance (uH)
  rdsOn: number;    // MOSFET On-Resistance (mOhm)
  vf: number;       // Diode Forward Voltage (V)
  dcr: number;      // Inductor DCR (mOhm)
  tr: number;       // Rise Time (ns) - Estimated
  tf: number;       // Fall Time (ns) - Estimated
}

export enum ConductionMode {
  CCM = 'Continuous Conduction Mode',
  DCM = 'Discontinuous Conduction Mode',
}

export interface CalculationResults {
  dutyCycle: number;
  rippleCurrent: number;
  peakCurrent: number;
  valleyCurrent: number;
  mode: ConductionMode;
  losses: {
    mosfetConduction: number;
    mosfetSwitching: number;
    diodeConduction: number;
    diodeReverseRecovery: number; // Simplified
    inductorDcr: number;
    total: number;
  };
  efficiency: number;
  waveformPoints: { time: number; current: number }[];
}

export interface AIAnalysisState {
  isLoading: boolean;
  response: string | null;
  error: string | null;
}
