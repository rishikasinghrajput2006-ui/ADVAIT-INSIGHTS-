import React, { useState } from 'react';
import { GradeLevel } from '../../types/index.ts';

interface VisualMathSolversProps {
  grade: GradeLevel;
}

export const VisualMathSolvers: React.FC<VisualMathSolversProps> = ({ grade }) => {
  const [activeSolver, setActiveSolver] = useState<'quadratic' | 'euclid' | 'ap'>('quadratic');

  // Quadratic State
  const [qa, setQa] = useState<number>(1);
  const [qb, setQb] = useState<number>(-5);
  const [qc, setQc] = useState<number>(6);

  // Euclid State
  const [numA, setNumA] = useState<number>(225);
  const [numB, setNumB] = useState<number>(135);

  // AP State
  const [apA, setApA] = useState<number>(2);
  const [apD, setApD] = useState<number>(3);
  const [apN, setApN] = useState<number>(10);

  // Quadratic Math computation
  const D = qb * qb - 4 * qa * qc;
  let root1: string = 'N/A';
  let root2: string = 'N/A';
  let natureOfRoots = '';

  if (qa === 0) {
    natureOfRoots = 'Linear equation (a cannot be 0 in a quadratic equation)';
  } else if (D > 0) {
    natureOfRoots = 'Two distinct real roots (D > 0)';
    root1 = ((-qb + Math.sqrt(D)) / (2 * qa)).toFixed(2);
    root2 = ((-qb - Math.sqrt(D)) / (2 * qa)).toFixed(2);
  } else if (D === 0) {
    natureOfRoots = 'Two equal real roots (D = 0)';
    root1 = (-qb / (2 * qa)).toFixed(2);
    root2 = root1;
  } else {
    natureOfRoots = 'No real roots (D < 0, complex conjugates)';
    const realPart = (-qb / (2 * qa)).toFixed(2);
    const imagPart = (Math.sqrt(-D) / (2 * qa)).toFixed(2);
    root1 = `${realPart} + ${imagPart}i`;
    root2 = `${realPart} - ${imagPart}i`;
  }

  // Euclid steps calculation
  const getEuclidSteps = (a: number, b: number) => {
    let x = Math.max(Math.abs(a), Math.abs(b));
    let y = Math.min(Math.abs(a), Math.abs(b));
    if (y === 0) return [{ dividend: x, divisor: 0, quotient: 0, remainder: x }];

    const steps = [];
    while (y > 0) {
      const q = Math.floor(x / y);
      const r = x % y;
      steps.push({ dividend: x, divisor: y, quotient: q, remainder: r });
      x = y;
      y = r;
    }
    return steps;
  };

  const euclidSteps = getEuclidSteps(numA, numB);
  const finalHcf = euclidSteps.length > 0 ? euclidSteps[euclidSteps.length - 1].divisor : 0;

  // AP Calculation
  const apNthTerm = apA + (apN - 1) * apD;
  const apSum = (apN / 2) * (2 * apA + (apN - 1) * apD);
  const apTerms = Array.from({ length: Math.min(apN, 7) }, (_, i) => apA + i * apD);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-sky-400 font-bold">
            Interactive Visual Math Solvers
          </span>
          <h2 className="text-2xl font-bold font-heading text-white mt-1">
            Step-by-Step Mathematical Derivation Engines
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Experiment with numbers and watch the formulas break down step-by-step with live visual feedback.
          </p>
        </div>

        {/* Solver Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveSolver('quadratic')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeSolver === 'quadratic' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quadratic Solver
          </button>
          <button
            onClick={() => setActiveSolver('euclid')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeSolver === 'euclid' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Euclid HCF Solver
          </button>
          <button
            onClick={() => setActiveSolver('ap')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeSolver === 'ap' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            AP Series Solver
          </button>
        </div>
      </div>

      {/* Solver 1: Quadratic Equations */}
      {activeSolver === 'quadratic' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
            <h4 className="text-sm font-bold uppercase text-sky-400 font-heading">
              Quadratic Equation: ax² + bx + c = 0
            </h4>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Coefficient a (x² coefficient):</span>
                  <span className="font-mono text-sky-400 font-bold">{qa}</span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="1"
                  value={qa}
                  onChange={(e) => setQa(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Coefficient b (x coefficient):</span>
                  <span className="font-mono text-amber-400 font-bold">{qb}</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="1"
                  value={qb}
                  onChange={(e) => setQb(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Constant c:</span>
                  <span className="font-mono text-emerald-400 font-bold">{qc}</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="1"
                  value={qc}
                  onChange={(e) => setQc(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-2">
              <span className="text-xs text-slate-400 block mb-2 font-mono">Sample Board Equations:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setQa(1); setQb(-5); setQc(6); }}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
                >
                  x² - 5x + 6 = 0
                </button>
                <button
                  onClick={() => { setQa(2); setQb(-4); setQc(2); }}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
                >
                  2x² - 4x + 2 = 0
                </button>
                <button
                  onClick={() => { setQa(1); setQb(2); setQc(5); }}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
                >
                  x² + 2x + 5 = 0
                </button>
              </div>
            </div>
          </div>

          {/* Derivation Steps & Visual Graph */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Equation Form:</span>
                <p className="text-lg font-bold font-mono text-white mt-0.5">
                  {qa}x² {qb >= 0 ? `+ ${qb}` : `- ${Math.abs(qb)}`}x {qc >= 0 ? `+ ${qc}` : `- ${Math.abs(qc)}`} = 0
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Discriminant D:</span>
                <p className={`text-xl font-bold font-mono ${D > 0 ? 'text-emerald-400' : D === 0 ? 'text-sky-400' : 'text-red-400'}`}>
                  D = {D}
                </p>
              </div>
            </div>

            {/* Step-by-Step Derivation */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="font-bold text-sky-400 block mb-1">Step 1: Compute Discriminant D = b² - 4ac</span>
                <p className="font-mono text-slate-300">
                  D = ({qb})² - 4 × ({qa}) × ({qc}) = {qb * qb} - {4 * qa * qc} = <strong className="text-white">{D}</strong>
                </p>
                <p className="mt-1 text-slate-400">Nature of Roots: <strong className="text-amber-300">{natureOfRoots}</strong></p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="font-bold text-sky-400 block mb-1">Step 2: Apply Quadratic Formula x = (-b ± √D) / (2a)</span>
                <p className="font-mono text-slate-300">
                  x = (-({qb}) ± √{D}) / (2 × {qa}) = ({ -qb } ± √{D}) / {2 * qa}
                </p>
              </div>

              <div className="p-3 bg-sky-950/30 rounded-xl border border-sky-800/60">
                <span className="font-bold text-sky-300 block mb-1">Step 3: Final Computed Roots</span>
                <div className="flex items-center gap-4 text-sm font-mono font-bold text-white mt-1">
                  <span className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">Root α = {root1}</span>
                  <span className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">Root β = {root2}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Solver 2: Euclid's Division Lemma */}
      {activeSolver === 'euclid' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">First Positive Integer (a):</label>
              <input
                type="number"
                value={numA}
                onChange={(e) => setNumA(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Second Positive Integer (b):</label>
              <input
                type="number"
                value={numB}
                onChange={(e) => setNumB(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
          </div>

          {/* Euclid Step Table */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase text-sky-400 font-heading">
              Euclid's Division Algorithm: a = bq + r (0 ≤ r &lt; b)
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="p-3">Step</th>
                    <th className="p-3">Dividend (a)</th>
                    <th className="p-3">Divisor (b)</th>
                    <th className="p-3">Quotient (q)</th>
                    <th className="p-3">Remainder (r)</th>
                    <th className="p-3">Equation a = bq + r</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {euclidSteps.map((s, idx) => (
                    <tr key={idx} className={s.remainder === 0 ? 'bg-emerald-950/30 text-emerald-300 font-bold' : 'text-slate-300'}>
                      <td className="p-3">Step {idx + 1}</td>
                      <td className="p-3">{s.dividend}</td>
                      <td className="p-3">{s.divisor}</td>
                      <td className="p-3">{s.quotient}</td>
                      <td className="p-3">{s.remainder}</td>
                      <td className="p-3 font-semibold">
                        {s.dividend} = {s.divisor} × {s.quotient} + {s.remainder}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-400 font-bold block">Final Highest Common Factor (HCF):</span>
                <p className="text-lg font-bold font-mono text-white mt-0.5">
                  HCF({numA}, {numB}) = <strong className="text-emerald-300">{finalHcf}</strong>
                </p>
              </div>
              <span className="text-xs text-emerald-300 font-mono">Remainder reached 0 ✓</span>
            </div>
          </div>
        </div>
      )}

      {/* Solver 3: Arithmetic Progression */}
      {activeSolver === 'ap' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">First Term (a):</label>
              <input
                type="number"
                value={apA}
                onChange={(e) => setApA(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Common Difference (d):</label>
              <input
                type="number"
                value={apD}
                onChange={(e) => setApD(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Number of Terms (n):</label>
              <input
                type="number"
                min="1"
                max="50"
                value={apN}
                onChange={(e) => setApN(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs font-mono text-sky-400 font-bold">nth Term a_n = a + (n-1)d</span>
              <p className="text-lg font-bold font-mono text-white">
                a_{apN} = {apA} + ({apN} - 1) × {apD} = <span className="text-sky-300">{apNthTerm}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs font-mono text-emerald-400 font-bold">Sum of n terms S_n = n/2 [2a + (n-1)d]</span>
              <p className="text-lg font-bold font-mono text-white">
                S_{apN} = {apN}/2 [2({apA}) + {apN - 1}({apD})] = <span className="text-emerald-300">{apSum}</span>
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400 font-mono block mb-2">First Few Terms of Sequence:</span>
            <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
              {apTerms.map((t, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-white">
                  {t}
                </span>
              ))}
              {apN > 7 && <span className="text-slate-500">... ({apNthTerm})</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
