import React, { useState } from 'react';

type IndicatorType = 'universal' | 'litmus' | 'phenolphthalein' | 'methyl_orange';

interface SampleSolution {
  name: string;
  basePH: number;
  description: string;
  chemicalFormula: string;
}

const SAMPLE_SOLUTIONS: SampleSolution[] = [
  { name: 'Gastric Juice (Stomach HCl)', basePH: 1.4, description: 'Highly acidic digestive fluid containing dilute hydrochloric acid.', chemicalFormula: 'HCl (aq)' },
  { name: 'Lemon Juice (Citric Acid)', basePH: 2.2, description: 'Natural organic citric acid solution.', chemicalFormula: 'C₆H₈O₇' },
  { name: 'Pure Water', basePH: 7.0, description: 'Neutral medium where [H⁺] = [OH⁻] = 10⁻⁷ M.', chemicalFormula: 'H₂O' },
  { name: 'Human Blood', basePH: 7.4, description: 'Slightly alkaline biological buffer solution.', chemicalFormula: 'Buffer (HCO₃⁻)' },
  { name: 'Milk of Magnesia (Antacid)', basePH: 10.5, description: 'Mild basic suspension used to neutralize stomach acidity.', chemicalFormula: 'Mg(OH)₂' },
  { name: 'Sodium Hydroxide (Lye)', basePH: 13.8, description: 'Strong alkaline solution containing dissociated OH⁻ ions.', chemicalFormula: 'NaOH (aq)' },
];

export const ChemistryLab: React.FC = () => {
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState<number>(0);
  const [indicator, setIndicator] = useState<IndicatorType>('universal');
  const [addedReagent, setAddedReagent] = useState<number>(0); // -10 (excess acid drops) to +10 (excess base drops)

  const currentSample = SAMPLE_SOLUTIONS[selectedSolutionIndex];

  // Dynamic pH calculated based on initial pH and added titrant
  const currentPH = Math.max(0, Math.min(14, Number((currentSample.basePH + addedReagent * 0.45).toFixed(1))));

  // Color calculation based on indicator and pH
  const getSolutionColor = (ph: number, ind: IndicatorType): { bg: string; text: string; name: string } => {
    if (ind === 'phenolphthalein') {
      if (ph < 8.3) return { bg: 'rgba(241, 245, 249, 0.4)', text: '#e2e8f0', name: 'Colorless' };
      if (ph < 10) return { bg: 'rgba(244, 114, 182, 0.6)', text: '#f472b6', name: 'Faint Pink' };
      return { bg: 'rgba(219, 39, 119, 0.85)', text: '#db2777', name: 'Vibrant Magenta Pink' };
    }

    if (ind === 'methyl_orange') {
      if (ph < 3.1) return { bg: 'rgba(239, 68, 68, 0.8)', text: '#ef4444', name: 'Red / Pink' };
      if (ph < 4.4) return { bg: 'rgba(249, 115, 22, 0.8)', text: '#f97316', name: 'Orange' };
      return { bg: 'rgba(234, 179, 8, 0.85)', text: '#eab308', name: 'Yellow' };
    }

    if (ind === 'litmus') {
      if (ph < 7) return { bg: 'rgba(239, 68, 68, 0.75)', text: '#f87171', name: 'Red (Acidic)' };
      if (ph === 7) return { bg: 'rgba(168, 85, 247, 0.75)', text: '#c084fc', name: 'Purple (Neutral)' };
      return { bg: 'rgba(59, 130, 246, 0.8)', text: '#60a5fa', name: 'Blue (Basic)' };
    }

    // Universal Indicator (Vibrant rainbow spectrum)
    if (ph <= 2) return { bg: 'rgba(220, 38, 38, 0.85)', text: '#ef4444', name: 'Deep Crimson Red' };
    if (ph <= 4) return { bg: 'rgba(249, 115, 22, 0.85)', text: '#f97316', name: 'Orange' };
    if (ph <= 6) return { bg: 'rgba(234, 179, 8, 0.85)', text: '#eab308', name: 'Yellowish Green' };
    if (ph <= 8) return { bg: 'rgba(34, 197, 94, 0.85)', text: '#22c55e', name: 'Neutral Green' };
    if (ph <= 10) return { bg: 'rgba(14, 165, 233, 0.85)', text: '#38bdf8', name: 'Cyan / Blue' };
    if (ph <= 12) return { bg: 'rgba(99, 102, 241, 0.85)', text: '#818cf8', name: 'Navy / Indigo' };
    return { bg: 'rgba(147, 51, 234, 0.85)', text: '#a855f7', name: 'Violet / Purple' };
  };

  const solutionColor = getSolutionColor(currentPH, indicator);

  // [H+] and [OH-] concentration
  const hConc = Math.pow(10, -currentPH);
  const ohConc = Math.pow(10, -(14 - currentPH));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">Chemistry Simulation Lab</span>
          <h3 className="text-xl font-bold font-heading text-white mt-0.5">Acid-Base Titration & pH Spectrum</h3>
          <p className="text-xs text-slate-400 mt-1">NCERT Class 10 Chapter 2 (Acids, Bases & Salts) Dynamic Ionic Reactor</p>
        </div>

        {/* Indicator Segmented Control */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto">
          {(
            [
              { id: 'universal', label: 'Universal Indicator' },
              { id: 'litmus', label: 'Litmus Paper' },
              { id: 'phenolphthalein', label: 'Phenolphthalein' },
              { id: 'methyl_orange', label: 'Methyl Orange' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setIndicator(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                indicator === item.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
        {/* Visual Reaction Chamber & Beaker */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Beaker Reaction Vessel (250 mL)</span>
            <span className="font-mono text-amber-400">{currentSample.chemicalFormula}</span>
          </div>

          {/* SVG Beaker Animation */}
          <div className="my-4 flex items-center justify-center">
            <svg viewBox="0 0 240 260" className="w-56 h-60 drop-shadow-lg">
              <defs>
                <linearGradient id="beakerFluid" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={solutionColor.bg} stopOpacity="0.75" />
                  <stop offset="100%" stopColor={solutionColor.bg} stopOpacity="0.95" />
                </linearGradient>
              </defs>

              {/* Glass Beaker Outline */}
              <rect x="40" y="40" width="160" height="200" rx="8" fill="none" stroke="#475569" strokeWidth="3" />
              {/* Beaker Lip */}
              <path d="M 35 40 L 45 40 M 195 40 L 205 40" stroke="#475569" strokeWidth="4" />

              {/* Beaker Measurement Ticks */}
              <line x1="40" y1="80" x2="65" y2="80" stroke="#64748B" strokeWidth="1.5" />
              <text x="70" y="84" fill="#64748B" fontSize="10" fontFamily="monospace">200ml</text>
              <line x1="40" y1="120" x2="60" y2="120" stroke="#64748B" strokeWidth="1.5" />
              <text x="65" y="124" fill="#64748B" fontSize="10" fontFamily="monospace">150ml</text>
              <line x1="40" y1="160" x2="65" y2="160" stroke="#64748B" strokeWidth="1.5" />
              <text x="70" y="164" fill="#64748B" fontSize="10" fontFamily="monospace">100ml</text>
              <line x1="40" y1="200" x2="60" y2="200" stroke="#64748B" strokeWidth="1.5" />
              <text x="65" y="204" fill="#64748B" fontSize="10" fontFamily="monospace">50ml</text>

              {/* Liquid Level */}
              <rect x="43" y="105" width="154" height="132" rx="4" fill="url(#beakerFluid)" className="transition-all duration-300" />

              {/* Fluid Top Surface Wave */}
              <path
                d="M 43 105 Q 80 102 120 105 T 197 105"
                fill="none"
                stroke={solutionColor.text}
                strokeWidth="2"
                opacity="0.8"
              />

              {/* Floating Ion Particles */}
              <text x="85" y="145" fill="#FFFFFF" fontSize="11" fontWeight="bold" opacity="0.85">
                {currentPH < 7 ? 'H⁺' : currentPH > 7 ? 'OH⁻' : 'H₂O'}
              </text>
              <text x="135" y="180" fill="#FFFFFF" fontSize="11" fontWeight="bold" opacity="0.85">
                {currentPH < 7 ? 'H₃O⁺' : currentPH > 7 ? 'Na⁺' : 'Cl⁻'}
              </text>
              <text x="100" y="210" fill="#FFFFFF" fontSize="10" fontWeight="bold" opacity="0.7">
                pH = {currentPH}
              </text>
            </svg>
          </div>

          {/* Solution Observation Banner */}
          <div className="p-3 bg-slate-900 border border-slate-800 rounded flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Observed Indicator Hue</span>
              <span className="font-semibold text-white">{solutionColor.name}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">Ionic Medium</span>
              <span className="font-semibold" style={{ color: solutionColor.text }}>
                {currentPH < 6.8 ? 'Strongly Acidic' : currentPH > 7.4 ? 'Alkaline / Basic' : 'Neutral Solution'}
              </span>
            </div>
          </div>
        </div>

        {/* Titration & Parameters Deck */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Sample Selector</h4>

            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_SOLUTIONS.map((s, idx) => (
                <button
                  key={s.name}
                  onClick={() => {
                    setSelectedSolutionIndex(idx);
                    setAddedReagent(0);
                  }}
                  className={`p-2 rounded text-left text-xs transition-colors border ${
                    selectedSolutionIndex === idx
                      ? 'bg-slate-800 border-amber-500 text-white font-medium'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="block truncate font-medium text-[11.5px]">{s.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Base pH: {s.basePH}</span>
                </button>
              ))}
            </div>

            {/* Titration Dropper Slider */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Add Acid (HCl) or Base (NaOH) Drops</span>
                <span className="font-mono text-amber-400">
                  {addedReagent < 0 ? `${Math.abs(addedReagent)} drops 0.1M HCl` : addedReagent > 0 ? `${addedReagent} drops 0.1M NaOH` : 'Equilibrium'}
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                step="1"
                value={addedReagent}
                onChange={(e) => setAddedReagent(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>-10 (Acidic shift)</span>
                <span>0 (Neutral base)</span>
                <span>+10 (Basic shift)</span>
              </div>
            </div>

            <button
              onClick={() => setAddedReagent(0)}
              className="w-full py-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition-colors"
            >
              Reset Reaction Vessel
            </button>
          </div>

          {/* Quantitative Readouts */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-400">Measured pH Value</span>
              <span className="font-mono text-2xl font-bold text-white tabular-nums">{currentPH}</span>
            </div>

            {/* Rainbow Visual pH Gauge */}
            <div className="h-2.5 rounded-full w-full bg-gradient-to-r from-red-600 via-yellow-400 via-green-500 via-sky-400 to-purple-600 relative">
              <div
                className="w-3.5 h-3.5 bg-white border-2 border-slate-900 rounded-full absolute -top-0.5 shadow-md transition-all duration-200"
                style={{ left: `calc(${(currentPH / 14) * 100}% - 7px)` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (Battery Acid)</span>
              <span>7 (Neutral)</span>
              <span>14 (Caustic Soda)</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">[H⁺] Concentration</span>
                <span className="font-mono text-white">{hConc.toExponential(1)} mol/L</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">[OH⁻] Concentration</span>
                <span className="font-mono text-white">{ohConc.toExponential(1)} mol/L</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
