import { BuckParams, CalculationResults, ConductionMode } from '../types';

export const calculateBuckConverter = (params: BuckParams): CalculationResults => {
  const { vin, vout, iout, fsw, l, rdsOn, vf, dcr, tr, tf } = params;

  // Convert units to SI base units for calculation
  const fswHz = fsw * 1000;
  const lHenry = l * 1e-6;
  const rdsOnOhm = rdsOn * 1e-3;
  const dcrOhm = dcr * 1e-3;
  const trSec = tr * 1e-9;
  const tfSec = tf * 1e-9;
  const period = 1 / fswHz;

  // 1. Determine Mode (CCM vs DCM)
  // Calculate ripple assuming CCM first
  let dutyCycle = vout / vin; 
  // Refined CCM duty cycle considering losses (approx): D = (Vout + Vf) / (Vin - Iout*Rds + Vf)
  // But for mode determination, simple Vout/Vin is usually sufficient to check ripple.
  
  const rippleCurrentCCM = ((vin - vout) * dutyCycle) / (lHenry * fswHz);
  const criticalCurrent = rippleCurrentCCM / 2;

  let mode = ConductionMode.CCM;
  let peakCurrent = 0;
  let valleyCurrent = 0;
  let rippleCurrent = 0;
  let waveformPoints: { time: number; current: number }[] = [];

  // Variables for loss calc
  let iRmsMosfet = 0;
  let iAvgDiode = 0;
  let iRmsInductor = 0;

  if (iout < criticalCurrent) {
    // DCM Mode
    mode = ConductionMode.DCM;
    
    // In DCM, Duty Cycle adapts to support the load.
    // D_dcm = sqrt( (2 * L * fsw * Iout * Vout) / (Vin * (Vin - Vout)) )
    // Note: This is an approximation.
    const vDiff = vin - vout;
    if (vDiff <= 0) {
        // Handle invalid case safely
        dutyCycle = 0;
    } else {
        dutyCycle = Math.sqrt((2 * lHenry * fswHz * iout * vout) / (vin * (vin - vout)));
        // Clamp D
        if (dutyCycle > 1) dutyCycle = 1; 
    }

    const tOn = dutyCycle * period;
    peakCurrent = ((vin - vout) / lHenry) * tOn;
    rippleCurrent = peakCurrent; // In DCM, ripple is 0 to peak
    valleyCurrent = 0;
    
    // Time for current to fall to zero: tFall = (L * Ipeak) / Vout
    const tFall = (lHenry * peakCurrent) / vout;
    const tOff = period - tOn; // Remaining time in cycle
    const tIdle = period - tOn - tFall; // Time where current is 0

    // Waveform Construction for DCM
    // We plot 2 cycles for better visibility
    waveformPoints = [
      { time: 0, current: 0 },
      { time: tOn * 1e6, current: peakCurrent },
      { time: (tOn + tFall) * 1e6, current: 0 },
      { time: period * 1e6, current: 0 },
      { time: (period + tOn) * 1e6, current: peakCurrent },
      { time: (period + tOn + tFall) * 1e6, current: 0 },
      { time: 2 * period * 1e6, current: 0 },
    ];

    // Current approximations for losses in DCM
    // Triangle wave approximation
    const d1 = dutyCycle;
    const d2 = tFall / period;
    
    // RMS of a triangle wave with peak Ip over period T (active for D1+D2)
    // I_rms = I_pk * sqrt((D1 + D2) / 3)
    iRmsInductor = peakCurrent * Math.sqrt((d1 + d2) / 3);
    
    // MOSFET current is the triangle during D1
    // I_rms_fet = I_pk * sqrt(D1 / 3)
    iRmsMosfet = peakCurrent * Math.sqrt(d1 / 3);
    
    // Diode current is the triangle during D2
    // I_avg_diode = 0.5 * I_pk * D2
    iAvgDiode = 0.5 * peakCurrent * d2;

  } else {
    // CCM Mode
    mode = ConductionMode.CCM;
    // Recalculate basic params just to be clean
    dutyCycle = vout / vin;
    rippleCurrent = rippleCurrentCCM;
    peakCurrent = iout + (rippleCurrent / 2);
    valleyCurrent = iout - (rippleCurrent / 2);
    
    const tOn = dutyCycle * period;

    // Waveform Construction for CCM (2 cycles)
    waveformPoints = [
      { time: 0, current: valleyCurrent },
      { time: tOn * 1e6, current: peakCurrent },
      { time: period * 1e6, current: valleyCurrent },
      { time: (period + tOn) * 1e6, current: peakCurrent },
      { time: 2 * period * 1e6, current: valleyCurrent },
    ];

    // RMS Currents for CCM (Trapezoidal approximation)
    // I_rms_inductor^2 = I_out^2 + (dI^2 / 12)
    iRmsInductor = Math.sqrt(Math.pow(iout, 2) + Math.pow(rippleCurrent, 2) / 12);
    
    // MOSFET RMS: I_rms_fet = I_out * sqrt(D) * sqrt(1 + (ripple^2 / (12 * Iout^2)))
    // Simplified: I_rms_fet approx I_out * sqrt(D)
    iRmsMosfet = iout * Math.sqrt(dutyCycle);

    // Diode Average: I_avg_diode = I_out * (1 - D)
    iAvgDiode = iout * (1 - dutyCycle);
  }

  // --- Loss Calculations ---

  // 1. MOSFET Conduction Loss: P = I_rms^2 * Rds
  const mosfetConduction = Math.pow(iRmsMosfet, 2) * rdsOnOhm;

  // 2. MOSFET Switching Loss: P = 0.5 * Vin * Iout * (tr + tf) * fsw
  // Note: In DCM, turn-on might be zero voltage/current switching (ZVS/ZCS) somewhat, 
  // but let's stick to the standard formula for worst-case/simplicity or clamp Iout to Peak/2 for switching.
  // We use Iout for CCM, or Peak/2 roughly for DCM average during switch event? 
  // Standard hard switching approx:
  const switchingCurrent = mode === ConductionMode.CCM ? iout : peakCurrent / 2; 
  const mosfetSwitching = 0.5 * vin * switchingCurrent * (trSec + tfSec) * fswHz;

  // 3. Diode Conduction Loss: P = Vf * I_avg
  const diodeConduction = vf * iAvgDiode;

  // 4. Diode Reverse Recovery: P = Qrr * Vin * fsw (Simplified estimate)
  // We don't have Qrr, lets estimate it as a small percentage of conduction or ignore if not provided.
  // Let's assume a small fixed loss factor or derive roughly. 
  // For this generic tool, we will assume 0 or included in switching for simplicity unless we ask for Qrr.
  // Let's just add a small fixed overhead based on frequency to simulate it: 
  const diodeReverseRecovery = (mode === ConductionMode.CCM) ? (vin * 10e-9 * fswHz) : 0; // rough guess 10nC Qrr

  // 5. Inductor DCR Loss: P = I_rms_ind^2 * DCR
  const inductorDcr = Math.pow(iRmsInductor, 2) * dcrOhm;

  const totalLoss = mosfetConduction + mosfetSwitching + diodeConduction + diodeReverseRecovery + inductorDcr;
  const outputPower = vout * iout;
  const inputPower = outputPower + totalLoss;
  const efficiency = inputPower > 0 ? (outputPower / inputPower) * 100 : 0;

  return {
    dutyCycle,
    rippleCurrent,
    peakCurrent,
    valleyCurrent,
    mode,
    losses: {
      mosfetConduction,
      mosfetSwitching,
      diodeConduction,
      diodeReverseRecovery,
      inductorDcr,
      total: totalLoss,
    },
    efficiency,
    waveformPoints,
  };
};
