import React, { useState } from 'react';

type OpticalElementType = 'convex_lens' | 'concave_lens' | 'concave_mirror' | 'convex_mirror';

export const RayOpticsLab: React.FC = () => {
  const [opticalType, setOpticalType] = useState<OpticalElementType>('convex_lens');
  const [objectDistance, setObjectDistance] = useState<number>(30); // in cm (positive value input)
  const [focalLength, setFocalLength] = useState<number>(15); // in cm
  const [objectHeight, setObjectHeight] = useState<number>(8); // in cm

  // Mathematical Calculations using Sign Convention
  // For Cartesian coordinate: optical center at (0, 0)
  // Object is always on left, u < 0
  const u = -Math.abs(objectDistance);
  let f = focalLength;
  let isLens = opticalType.includes('lens');

  if (opticalType === 'concave_lens' || opticalType === 'concave_mirror') {
    f = -Math.abs(focalLength);
  } else {
    f = Math.abs(focalLength);
  }

  let v = 0;
  let m = 0;
  let isImageInfinity = false;

  if (isLens) {
    // 1/f = 1/v - 1/u => 1/v = 1/f + 1/u => v = (f * u) / (u + f)
    if (Math.abs(u + f) < 0.001) {
      isImageInfinity = true;
    } else {
      v = (f * u) / (u + f);
      m = v / u;
    }
  } else {
    // Mirror: 1/f = 1/v + 1/u => 1/v = 1/f - 1/u => v = (f * u) / (u - f)
    if (Math.abs(u - f) < 0.001) {
      isImageInfinity = true;
    } else {
      v = (f * u) / (u - f);
      m = -v / u;
    }
  }

  const imageHeight = isImageInfinity ? 0 : objectHeight * m;
  const isReal = isLens ? v > 0 : v < 0;
  const isErect = m > 0;

  // Visual Coordinates in SVG (width 600, height 300)
  const originX = 300;
  const originY = 150;
  const scale = 5; // pixels per cm

  const objX = originX + u * scale;
  const objY = originY - objectHeight * scale;
  const fLeftX = originX - Math.abs(f) * scale;
  const fRightX = originX + Math.abs(f) * scale;

  const imgX = isImageInfinity ? originX + 280 : originX + v * scale;
  const imgY = isImageInfinity ? originY : originY - imageHeight * scale;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold">Physics Simulation Lab</span>
          <h3 className="text-xl font-bold font-heading text-white mt-0.5">Ray Optics & Lens / Mirror Bench</h3>
          <p className="text-xs text-slate-400 mt-1">NCERT Class 10 Light (Reflection & Refraction) Interactive Ray Tracing</p>
        </div>

        {/* Optical Element Selectors */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto">
          {(
            [
              { id: 'convex_lens', label: 'Convex Lens' },
              { id: 'concave_lens', label: 'Concave Lens' },
              { id: 'concave_mirror', label: 'Concave Mirror' },
              { id: 'convex_mirror', label: 'Convex Mirror' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setOpticalType(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                opticalType === item.id
                  ? 'bg-sky-500 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Zone Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
        {/* Stage: Interactive SVG Diagram */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Principal Optical Axis (Cartesian Origin O = (0, 0))</span>
            <span className="tabular-nums font-mono text-sky-400">Scale: 1 cm = {scale} px</span>
          </div>

          <svg viewBox="0 0 600 300" className="w-full h-64 select-none">
            {/* Grid Lines */}
            <defs>
              <pattern id="opticsGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1E293B" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="600" height="300" fill="url(#opticsGrid)" />

            {/* Principal Axis */}
            <line x1="20" y1={originY} x2="580" y2={originY} stroke="#475569" strokeWidth="1.5" strokeDasharray="4 3" />

            {/* Optical Element at originX */}
            {isLens ? (
              // Lens representation
              <g>
                <line x1={originX} y1="30" x2={originX} y2="270" stroke="#38BDF8" strokeWidth="2.5" />
                {opticalType === 'convex_lens' ? (
                  // Convex arrows at ends
                  <path d="M 292 40 L 300 28 L 308 40 M 292 260 L 300 272 L 308 260" stroke="#38BDF8" strokeWidth="2.5" fill="none" />
                ) : (
                  // Concave outward arrows
                  <path d="M 292 28 L 300 40 L 308 28 M 292 272 L 300 260 L 308 272" stroke="#38BDF8" strokeWidth="2.5" fill="none" />
                )}
                <circle cx={originX} cy={originY} r="3" fill="#38BDF8" />
                <text x={originX + 6} y={originY - 8} fill="#94A3B8" fontSize="11" fontFamily="sans-serif">O</text>
              </g>
            ) : (
              // Curved mirror representation
              <g>
                <path
                  d={
                    opticalType === 'concave_mirror'
                      ? `M ${originX + 15} 35 Q ${originX - 10} 150 ${originX + 15} 265`
                      : `M ${originX - 15} 35 Q ${originX + 10} 150 ${originX - 15} 265`
                  }
                  stroke="#38BDF8"
                  strokeWidth="3.5"
                  fill="none"
                />
                <circle cx={originX} cy={originY} r="3" fill="#38BDF8" />
                <text x={originX + 8} y={originY - 8} fill="#94A3B8" fontSize="11" fontFamily="sans-serif">P</text>
              </g>
            )}

            {/* Foci Markers */}
            <circle cx={fLeftX} cy={originY} r="3.5" fill="#F59E0B" />
            <text x={fLeftX - 10} y={originY + 18} fill="#F59E0B" fontSize="11" fontWeight="600">F₁</text>

            <circle cx={fRightX} cy={originY} r="3.5" fill="#F59E0B" />
            <text x={fRightX - 6} y={originY + 18} fill="#F59E0B" fontSize="11" fontWeight="600">F₂</text>

            {/* Object Arrow (Green) */}
            <g>
              <line x1={objX} y1={originY} x2={objX} y2={objY} stroke="#10B981" strokeWidth="3" />
              {/* Arrow Head */}
              <polygon
                points={`${objX - 5},${objY + 8} ${objX + 5},${objY + 8} ${objX},${objY}`}
                fill="#10B981"
              />
              <text x={objX - 8} y={objY - 8} fill="#10B981" fontSize="11" fontWeight="700">AB</text>
            </g>

            {/* Ray 1: Parallel to axis, passes through Focus */}
            <line x1={objX} y1={objY} x2={originX} y2={objY} stroke="#EF4444" strokeWidth="1.6" />
            {!isImageInfinity && isLens && opticalType === 'convex_lens' && (
              <line x1={originX} y1={objY} x2={imgX} y2={imgY} stroke="#EF4444" strokeWidth="1.6" />
            )}

            {/* Ray 2: Passing through Optical Center O (undeviated for lens) */}
            {!isImageInfinity && isLens && (
              <line x1={objX} y1={objY} x2={imgX} y2={imgY} stroke="#EAB308" strokeWidth="1.6" strokeDasharray="3 2" />
            )}

            {/* Image Arrow (Purple / Amber) */}
            {!isImageInfinity && (
              <g>
                <line
                  x1={imgX}
                  y1={originY}
                  x2={imgX}
                  y2={imgY}
                  stroke={isReal ? '#818CF8' : '#F43F5E'}
                  strokeWidth="3"
                  strokeDasharray={isReal ? 'none' : '4 3'}
                />
                <polygon
                  points={
                    imageHeight < 0
                      ? `${imgX - 5},${imgY - 8} ${imgX + 5},${imgY - 8} ${imgX},${imgY}`
                      : `${imgX - 5},${imgY + 8} ${imgX + 5},${imgY + 8} ${imgX},${imgY}`
                  }
                  fill={isReal ? '#818CF8' : '#F43F5E'}
                />
                <text x={imgX + 4} y={imgY + (imageHeight < 0 ? 16 : -8)} fill={isReal ? '#818CF8' : '#F43F5E'} fontSize="11" fontWeight="700">
                  A'B'
                </text>
              </g>
            )}

            {isImageInfinity && (
              <text x="350" y="80" fill="#F87171" fontSize="13" fontWeight="bold">
                Image at Infinity (Parallel Rays)
              </text>
            )}
          </svg>

          {/* Real-time Legend bar */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" /> Object (h = {objectHeight} cm)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-indigo-400 rounded-sm" /> Real Image
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-rose-400 rounded-sm" /> Virtual Image
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm" /> Focal Points (F)
            </span>
          </div>
        </div>

        {/* Controls Deck & Formula Readout */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Optical Parameters</h4>

            {/* Object Distance Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Object Distance (|u|)</span>
                <span className="font-mono text-sky-400 font-semibold">{objectDistance} cm</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={objectDistance}
                onChange={(e) => setObjectDistance(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>5 cm</span>
                <span>Near Focus</span>
                <span>50 cm</span>
              </div>
            </div>

            {/* Focal Length Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Focal Length (|f|)</span>
                <span className="font-mono text-amber-400 font-semibold">{focalLength} cm</span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                step="1"
                value={focalLength}
                onChange={(e) => setFocalLength(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>10 cm</span>
                <span>20 cm</span>
                <span>30 cm</span>
              </div>
            </div>

            {/* Object Height */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Object Height (h)</span>
                <span className="font-mono text-emerald-400 font-semibold">{objectHeight} cm</span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                step="1"
                value={objectHeight}
                onChange={(e) => setObjectHeight(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Computed Physical Metrics Output */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Live Mathematical Output</h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Image Distance (v)</span>
                <span className="font-mono text-sm font-bold text-white tabular-nums">
                  {isImageInfinity ? 'Infinity (∞)' : `${v.toFixed(1)} cm`}
                </span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Magnification (m)</span>
                <span className="font-mono text-sm font-bold text-sky-400 tabular-nums">
                  {isImageInfinity ? '—' : m.toFixed(2)}
                </span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Nature of Image</span>
                <span className={`text-xs font-bold ${isReal ? 'text-indigo-400' : 'text-rose-400'}`}>
                  {isImageInfinity ? 'At Infinity' : isReal ? 'Real & Inverted' : 'Virtual & Erect'}
                </span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Optical Power</span>
                <span className="font-mono text-sm font-bold text-amber-400 tabular-nums">
                  {((1 / (f / 100))).toFixed(2)} D
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-900/40 p-2 rounded border border-slate-800/60 leading-relaxed font-mono">
              Formula: {isLens ? '1/f = 1/v - 1/u' : '1/f = 1/v + 1/u'}  ·  m = {isLens ? 'v/u' : '-v/u'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
