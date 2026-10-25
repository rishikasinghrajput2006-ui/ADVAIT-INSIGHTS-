import React, { useState } from 'react';

export const CircuitLab: React.FC = () => {
  const [voltage, setVoltage] = useState<number>(12); // Volts
  const [resistance, setResistance] = useState<number>(6); // Ohms
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(true);

  // Ohm's Law Calculations
  const current = isSwitchClosed ? voltage / resistance : 0; // Amperes
  const power = isSwitchClosed ? current * voltage : 0; // Watts
  const heatPerSec = power; // Joules per second

  // Bulb brightness and glow intensity
  const glowBrightness = Math.min(1, power / 40); // 0 to 1
  const glowColor = glowBrightness > 0.6 ? '#FEF08A' : glowBrightness > 0.2 ? '#FBBF24' : '#F59E0B';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">Physics Simulation Lab</span>
          <h3 className="text-xl font-bold font-heading text-white mt-0.5">Ohm’s Law & Electric Circuit Bench</h3>
          <p className="text-xs text-slate-400 mt-1">NCERT Class 10 Chapter 11 (Electricity) Live Circuit Workbench</p>
        </div>

        <button
          onClick={() => setIsSwitchClosed(!isSwitchClosed)}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            isSwitchClosed ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'
          }`}
        >
          <span>Key / Switch:</span>
          <span className="uppercase font-bold">{isSwitchClosed ? 'Closed (ON)' : 'Open (OFF)'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
        {/* Animated Circuit Visualizer */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Schematic Closed Loop (Battery + Resistor + Ammeter + Bulb)</span>
            <span className="font-mono text-amber-400 tabular-nums">Current I = V / R</span>
          </div>

          <svg viewBox="0 0 540 280" className="w-full h-64 select-none my-2">
            <defs>
              <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={glowBrightness * 12 + 2} result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Circuit Wire Loop */}
            <rect
              x="60"
              y="50"
              width="420"
              height="180"
              rx="16"
              fill="none"
              stroke={isSwitchClosed ? '#38BDF8' : '#334155'}
              strokeWidth="3.5"
            />

            {/* Animated current dots if closed */}
            {isSwitchClosed && current > 0 && (
              <rect
                x="60"
                y="50"
                width="420"
                height="180"
                rx="16"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="3.5"
                strokeDasharray="10 15"
                className="animate-pulse"
              />
            )}

            {/* Battery Source (Top center) */}
            <g transform="translate(230, 40)">
              <rect x="-10" y="0" width="80" height="20" fill="#0B0F19" />
              {/* Positive and negative plates */}
              <line x1="20" y1="-10" x2="20" y2="30" stroke="#F59E0B" strokeWidth="4" />
              <line x1="36" y1="-2" x2="36" y2="22" stroke="#94A3B8" strokeWidth="2.5" />
              <text x="14" y="-14" fill="#F59E0B" fontSize="11" fontWeight="bold">+</text>
              <text x="38" y="-14" fill="#94A3B8" fontSize="11" fontWeight="bold">-</text>
              <text x="12" y="44" fill="#F59E0B" fontSize="11" fontFamily="monospace" fontWeight="bold">
                {voltage} V
              </text>
            </g>

            {/* Switch on right branch */}
            <g transform="translate(480, 120)">
              <rect x="-10" y="-10" width="20" height="40" fill="#0B0F19" />
              <circle cx="0" cy="-6" r="3" fill="#38BDF8" />
              <circle cx="0" cy="24" r="3" fill="#38BDF8" />
              {isSwitchClosed ? (
                <line x1="0" y1="-6" x2="0" y2="24" stroke="#10B981" strokeWidth="3" />
              ) : (
                <line x1="0" y1="-6" x2="16" y2="10" stroke="#EF4444" strokeWidth="3" />
              )}
              <text x="18" y="24" fill="#94A3B8" fontSize="10">Key (K)</text>
            </g>

            {/* Light Bulb (Bottom Center) */}
            <g transform="translate(260, 230)">
              {/* Bulb Base Cutout */}
              <rect x="-24" y="-12" width="48" height="24" fill="#0B0F19" />
              {/* Glowing Bulb Dome */}
              <circle
                cx="0"
                cy="0"
                r="18"
                fill={isSwitchClosed && current > 0 ? glowColor : '#1E293B'}
                stroke="#64748B"
                strokeWidth="1.5"
                filter={isSwitchClosed && current > 0 ? 'url(#bulbGlow)' : undefined}
                opacity={isSwitchClosed ? 0.95 : 0.4}
              />
              {/* Filament */}
              <path d="M -6 6 Q 0 -8 6 6" fill="none" stroke={isSwitchClosed ? '#DC2626' : '#475569'} strokeWidth="2" />
              <text x="-16" y="36" fill="#FEF08A" fontSize="11" fontWeight="bold" fontFamily="monospace">
                {power.toFixed(1)} W
              </text>
            </g>

            {/* Ammeter on left wire */}
            <g transform="translate(60, 140)">
              <circle cx="0" cy="0" r="16" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
              <text x="-6" y="5" fill="#38BDF8" fontSize="13" fontWeight="bold">A</text>
              <text x="22" y="4" fill="#38BDF8" fontSize="10" fontFamily="monospace">
                {current.toFixed(2)} A
              </text>
            </g>
          </svg>

          {/* Real-time Summary Cards */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Electric Current (I)</span>
              <span className="font-mono text-base font-bold text-sky-400 tabular-nums">{current.toFixed(2)} A</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Power Dissipation (P)</span>
              <span className="font-mono text-base font-bold text-amber-400 tabular-nums">{power.toFixed(1)} W</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Heat Generated Rate</span>
              <span className="font-mono text-base font-bold text-rose-400 tabular-nums">{heatPerSec.toFixed(1)} J/s</span>
            </div>
          </div>
        </div>

        {/* Controls Deck */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Circuit Controls</h4>

            {/* Voltage Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Supply Potential (V)</span>
                <span className="font-mono text-amber-400 font-semibold">{voltage} Volts</span>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                step="1"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1.5 V (Dry cell)</span>
                <span>12 V (Lab)</span>
                <span>24 V</span>
              </div>
            </div>

            {/* Resistance Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Load Resistance (R)</span>
                <span className="font-mono text-sky-400 font-semibold">{resistance} Ω</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 Ω (Low)</span>
                <span>15 Ω</span>
                <span>30 Ω (High)</span>
              </div>
            </div>
          </div>

          {/* Theory & Examiner Takeaway */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2 text-xs">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Core Physics Principle</h4>
            <p className="text-slate-300 leading-relaxed text-[11.5px]">
              <strong className="text-amber-400 font-semibold">Ohm’s Law:</strong> Current is directly proportional to potential difference (I ∝ V) and inversely proportional to resistance (I ∝ 1/R).
            </p>
            <p className="text-slate-400 leading-relaxed text-[11px] pt-1 border-t border-slate-800">
              <strong className="text-white">Joule’s Law of Heating:</strong> H = I²Rt. If current doubles, heating power quadruples (×4)!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
