import React, { useState } from 'react';

export const MathParabolaLab: React.FC = () => {
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-2);
  const [c, setC] = useState<number>(-3);

  // Quadratic calculations
  const safeA = a === 0 ? 0.001 : a;
  const D = b * b - 4 * safeA * c;
  const vertexX = -b / (2 * safeA);
  const vertexY = -D / (4 * safeA);

  let root1: number | null = null;
  let root2: number | null = null;
  let natureOfRoots = '';

  if (D > 0) {
    root1 = (-b + Math.sqrt(D)) / (2 * safeA);
    root2 = (-b - Math.sqrt(D)) / (2 * safeA);
    natureOfRoots = 'Two Distinct Real Roots';
  } else if (Math.abs(D) < 0.0001) {
    root1 = -b / (2 * safeA);
    root2 = root1;
    natureOfRoots = 'Two Equal Real Roots (Tangent)';
  } else {
    natureOfRoots = 'No Real Roots (Complex Conjugates)';
  }

  // Visual SVG scaling (Domain x: -8 to +8, y: -10 to +10)
  const width = 500;
  const height = 300;
  const originX = width / 2;
  const originY = height / 2;
  const scaleX = 26; // pixels per unit
  const scaleY = 14;

  const toSvgX = (valX: number) => originX + valX * scaleX;
  const toSvgY = (valY: number) => originY - valY * scaleY;

  // Generate Parabola Path Points
  const points: string[] = [];
  for (let x = -8; x <= 8; x += 0.2) {
    const y = safeA * x * x + b * x + c;
    if (Math.abs(y) <= 15) {
      points.push(`${toSvgX(x)},${toSvgY(y)}`);
    }
  }
  const parabolaD = points.length > 0 ? `M ${points.join(' L ')}` : '';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold">Mathematics Geometry Lab</span>
          <h3 className="text-xl font-bold font-heading text-white mt-0.5">Quadratic Parabola & Discriminant Grapher</h3>
          <p className="text-xs text-slate-400 mt-1">NCERT Class 10 & 9 Polynomials & Coordinate Plane Dynamic Visualizer</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-sky-400">
          <span>f(x) = {a}x² {b >= 0 ? `+ ${b}x` : `${b}x`} {c >= 0 ? `+ ${c}` : `${c}`}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
        {/* Parabola Canvas */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
            <span>Coordinate Plane (X-Axis: Real Domain, Y-Axis: Range)</span>
            <span className="font-mono text-sky-400 tabular-nums">Vertex: ({vertexX.toFixed(2)}, {vertexY.toFixed(2)})</span>
          </div>

          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64 select-none">
            {/* Grid */}
            <defs>
              <pattern id="mathGrid" width="26" height="26" patternUnits="userSpaceOnUse">
                <path d="M 26 0 L 0 0 0 26" fill="none" stroke="#1E293B" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width={width} height={height} fill="url(#mathGrid)" />

            {/* Axes */}
            <line x1="10" y1={originY} x2={width - 10} y2={originY} stroke="#64748B" strokeWidth="1.5" />
            <line x1={originX} y1="10" x2={originX} y2={height - 10} stroke="#64748B" strokeWidth="1.5" />

            {/* Axis Arrows */}
            <polygon points={`${width - 8},${originY - 3} ${width - 8},${originY + 3} ${width - 2},${originY}`} fill="#64748B" />
            <polygon points={`${originX - 3},8 ${originX + 3},8 ${originX},2`} fill="#64748B" />

            <text x={width - 20} y={originY + 16} fill="#94A3B8" fontSize="11" fontFamily="sans-serif">X</text>
            <text x={originX + 8} y="18" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">Y</text>

            {/* Axis of Symmetry (dashed line) */}
            <line
              x1={toSvgX(vertexX)}
              y1="15"
              x2={toSvgX(vertexX)}
              y2={height - 15}
              stroke="#6366F1"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />

            {/* Parabola Curve */}
            {parabolaD && (
              <path d={parabolaD} fill="none" stroke="#38BDF8" strokeWidth="2.8" strokeLinecap="round" />
            )}

            {/* Roots points on X-axis */}
            {root1 !== null && (
              <g>
                <circle cx={toSvgX(root1)} cy={originY} r="4.5" fill="#10B981" />
                <text x={toSvgX(root1) - 10} y={originY - 10} fill="#10B981" fontSize="10" fontWeight="bold">
                  x₁ = {root1.toFixed(1)}
                </text>
              </g>
            )}
            {root2 !== null && root2 !== root1 && (
              <g>
                <circle cx={toSvgX(root2)} cy={originY} r="4.5" fill="#10B981" />
                <text x={toSvgX(root2) - 10} y={originY - 10} fill="#10B981" fontSize="10" fontWeight="bold">
                  x₂ = {root2.toFixed(1)}
                </text>
              </g>
            )}

            {/* Vertex Marker */}
            <circle cx={toSvgX(vertexX)} cy={toSvgY(vertexY)} r="5" fill="#F59E0B" />
            <text x={toSvgX(vertexX) + 8} y={toSvgY(vertexY) + 4} fill="#F59E0B" fontSize="11" fontWeight="bold">
              V
            </text>
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-sky-400 rounded-sm" /> Parabola y = ax² + bx + c
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm" /> Vertex ({vertexX.toFixed(1)}, {vertexY.toFixed(1)})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" /> Real Roots (x-intercepts)
            </span>
          </div>
        </div>

        {/* Sliders & Math Breakdown */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Coefficients (ax² + bx + c)</h4>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Leading Coefficient (a)</span>
                <span className="font-mono text-sky-400 font-semibold">{a}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.5"
                value={a}
                onChange={(e) => setA(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-3 (Concave down)</span>
                <span>0</span>
                <span>+3 (Concave up)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Linear Coefficient (b)</span>
                <span className="font-mono text-emerald-400 font-semibold">{b}</span>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="1"
                value={b}
                onChange={(e) => setB(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Constant Term (c)</span>
                <span className="font-mono text-amber-400 font-semibold">{c}</span>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="1"
                value={c}
                onChange={(e) => setC(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Mathematical Analysis */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Discriminant & Nature</h4>

            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Discriminant D = b² - 4ac</span>
                <span className={`font-mono font-bold ${D > 0 ? 'text-emerald-400' : D === 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {D.toFixed(1)}
                </span>
              </div>
              <span className="text-xs font-semibold text-white mt-1 block">{natureOfRoots}</span>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-900/40 p-2 rounded border border-slate-800/60 font-mono">
              Formula: x = (-b ± √D) / 2a
              {root1 !== null && `  =>  x₁ = ${root1.toFixed(2)}, x₂ = ${root2?.toFixed(2)}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
