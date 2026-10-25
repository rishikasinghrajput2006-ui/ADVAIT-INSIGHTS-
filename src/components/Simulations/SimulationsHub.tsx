import React, { useState } from 'react';
import { RayOpticsLab } from './RayOpticsLab.tsx';
import { ChemistryLab } from './ChemistryLab.tsx';
import { MathParabolaLab } from './MathParabolaLab.tsx';
import { CircuitLab } from './CircuitLab.tsx';

interface SimulationsHubProps {
  initialLabId?: string;
}

export const SimulationsHub: React.FC<SimulationsHubProps> = ({ initialLabId = 'parabola' }) => {
  const [activeLab, setActiveLab] = useState<string>(initialLabId);

  return (
    <div className="space-y-6">
      {/* Simulation Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold font-mono">
            Advait Interactive Visualizers
          </span>
          <h2 className="text-2xl font-bold font-heading text-white mt-0.5">Academic Simulation Laboratory</h2>
        </div>

        {/* Segmented Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveLab('optics')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeLab === 'optics' ? 'bg-sky-500 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ray Optics Lab
          </button>
          <button
            onClick={() => setActiveLab('chemistry')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeLab === 'chemistry' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            pH &amp; Titration Lab
          </button>
          <button
            onClick={() => setActiveLab('parabola')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeLab === 'parabola' ? 'bg-sky-500 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Parabola Math Lab
          </button>
          <button
            onClick={() => setActiveLab('circuit')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeLab === 'circuit' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Circuit &amp; Ohm's Lab
          </button>
        </div>
      </div>

      {/* Render Active Lab */}
      <div>
        {activeLab === 'optics' && <RayOpticsLab />}
        {activeLab === 'chemistry' && <ChemistryLab />}
        {activeLab === 'parabola' && <MathParabolaLab />}
        {activeLab === 'circuit' && <CircuitLab />}
      </div>
    </div>
  );
};
