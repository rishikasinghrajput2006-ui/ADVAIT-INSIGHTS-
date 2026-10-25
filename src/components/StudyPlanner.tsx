import React, { useState, useEffect } from 'react';
import { GradeLevel } from '../types/index.ts';

interface StudyPlannerProps {
  grade: GradeLevel;
}

interface ChapterCheckItem {
  id: string;
  name: string;
  subject: string;
  done: boolean;
}

const DEFAULT_CHAPTERS: Record<GradeLevel, ChapterCheckItem[]> = {
  class10: [
    { id: 'c1', name: 'Real Numbers & Fundamental Theorem', subject: 'Math', done: true },
    { id: 'c2', name: 'Polynomials & Coefficients', subject: 'Math', done: false },
    { id: 'c3', name: 'Quadratic Equations & Roots', subject: 'Math', done: true },
    { id: 'c4', name: 'Introduction to Trigonometry', subject: 'Math', done: false },
    { id: 'c5', name: 'Light: Reflection & Refraction', subject: 'Science', done: true },
    { id: 'c6', name: 'Electricity & Circuits', subject: 'Science', done: false },
    { id: 'c7', name: 'Acids, Bases and Salts', subject: 'Science', done: true },
    { id: 'c8', name: 'Life Processes (Nutrition & Heart)', subject: 'Science', done: false },
  ],
  class9: [
    { id: 'c9-1', name: 'Number Systems & Rationalisation', subject: 'Math', done: true },
    { id: 'c9-2', name: 'Polynomials & Algebraic Identities', subject: 'Math', done: false },
    { id: 'c9-3', name: 'Lines and Angles & Triangles', subject: 'Math', done: false },
    { id: 'c9-4', name: 'Motion & 3 Equations of Motion', subject: 'Science', done: true },
    { id: 'c9-5', name: 'Force and Laws of Motion', subject: 'Science', done: false },
    { id: 'c9-6', name: 'Gravitation & Floatation', subject: 'Science', done: true },
    { id: 'c9-7', name: 'The Fundamental Unit of Life (Cell)', subject: 'Science', done: false },
  ],
};

export const StudyPlanner: React.FC<StudyPlannerProps> = ({ grade }) => {
  const [items, setItems] = useState<ChapterCheckItem[]>(() => {
    const saved = localStorage.getItem(`advait_planner_${grade}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_CHAPTERS[grade];
      }
    }
    return DEFAULT_CHAPTERS[grade];
  });

  useEffect(() => {
    localStorage.setItem(`advait_planner_${grade}`, JSON.stringify(items));
  }, [items, grade]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it))
    );
  };

  const completedCount = items.filter((it) => it.done).length;
  const progressPct = Math.round((completedCount / items.length) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold font-mono">
            {grade === 'class10' ? 'Class 10 Board Checklist' : 'Class 9 Foundation Checklist'}
          </span>
          <h3 className="text-lg font-bold font-heading text-white">Syllabus Completion Tracker</h3>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Progress:</span>
          <span className="font-mono font-bold text-emerald-400 tabular-nums">{progressPct}%</span>
          <span className="text-slate-500 font-mono">({completedCount}/{items.length} units)</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all text-xs ${
              item.done
                ? 'bg-slate-950/60 border-emerald-900/40 text-slate-300'
                : 'bg-slate-950 border-slate-800 text-white hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold border transition-colors ${
                  item.done
                    ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                    : 'border-slate-700 text-transparent'
                }`}
              >
                ✓
              </span>
              <span className={item.done ? 'line-through text-slate-400' : 'font-medium'}>
                {item.name}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0 ml-2">
              {item.subject}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
