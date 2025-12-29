import React from 'react';
import { BuckParams } from '../types';
import { Settings, RefreshCw } from 'lucide-react';

interface InputSectionProps {
  params: BuckParams;
  setParams: React.Dispatch<React.SetStateAction<BuckParams>>;
}

const InputSection: React.FC<InputSectionProps> = ({ params, setParams }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const InputGroup = ({ label, name, unit, step = 0.1, min = 0 }: { label: string, name: keyof BuckParams, unit: string, step?: number, min?: number }) => (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="text-xs font-medium text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          id={name}
          name={name}
          value={params[name]}
          onChange={handleChange}
          step={step}
          min={min}
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-8 transition-colors"
        />
        <span className="absolute right-3 top-2.5 text-slate-500 text-sm font-medium pointer-events-none">
          {unit}
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center space-x-2 mb-6 border-b border-slate-800 pb-4">
        <Settings className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-semibold text-white">Design Parameters</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 sm:col-span-1 space-y-4">
          <h3 className="text-sm font-semibold text-blue-400 mb-2">Power Stage</h3>
          <InputGroup label="Input Voltage" name="vin" unit="V" />
          <InputGroup label="Output Voltage" name="vout" unit="V" />
          <InputGroup label="Load Current" name="iout" unit="A" />
          <InputGroup label="Switching Freq" name="fsw" unit="kHz" step={10} />
          <InputGroup label="Inductance" name="l" unit="μH" step={1} />
        </div>

        <div className="col-span-2 sm:col-span-1 space-y-4">
          <h3 className="text-sm font-semibold text-blue-400 mb-2">Component Parasitics</h3>
          <InputGroup label="MOSFET Rds(on)" name="rdsOn" unit="mΩ" step={1} />
          <InputGroup label="Diode Vf" name="vf" unit="V" step={0.1} />
          <InputGroup label="Inductor DCR" name="dcr" unit="mΩ" step={1} />
          <div className="grid grid-cols-2 gap-2">
            <InputGroup label="Rise Time" name="tr" unit="ns" step={1} />
            <InputGroup label="Fall Time" name="tf" unit="ns" step={1} />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center gap-2">
        <RefreshCw className="w-3 h-3" />
        <span>Calculations update automatically</span>
      </div>
    </div>
  );
};

export default InputSection;
