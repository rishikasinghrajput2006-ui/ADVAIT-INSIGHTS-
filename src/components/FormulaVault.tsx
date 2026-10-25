import React, { useState } from 'react';
import { GradeLevel, SubjectId } from '../types/index.ts';
import { FORMULA_VAULT } from '../data/curriculumData.ts';

interface FormulaVaultProps {
  grade: GradeLevel;
}

export const FormulaVault: React.FC<FormulaVaultProps> = ({ grade }) => {
  const [activeSubject, setActiveSubject] = useState<SubjectId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredFormulas = FORMULA_VAULT.filter((f) => {
    const gradeMatch = f.grade === grade;
    const subjectMatch = activeSubject === 'all' || f.subject === activeSubject;
    const searchMatch =
      searchQuery.trim() === '' ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.formula.toLowerCase().includes(searchQuery.toLowerCase());

    return gradeMatch && subjectMatch && searchMatch;
  });

  const handleCopyFormula = (formulaText: string, id: string) => {
    navigator.clipboard.writeText(formulaText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold font-mono">
            {grade === 'class10' ? 'Class 10 Formula Bank' : 'Class 9 Foundation Constants & Laws'}
          </span>
          <h2 className="text-2xl font-bold font-heading text-white mt-0.5">Quick Reference Identity Vault</h2>
        </div>

        {/* Search & Subject Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search formula, chapter, law..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <svg
              className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setActiveSubject('all')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeSubject === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveSubject('math')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeSubject === 'math' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Math
            </button>
            <button
              onClick={() => setActiveSubject('science')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeSubject === 'science' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Science
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Formulas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredFormulas.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div>
              {/* Unboxed Metadata (no pill) */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                <span>{item.chapter}</span>
                <span className="uppercase text-sky-400 font-semibold">{item.subject}</span>
              </div>

              <h3 className="text-base font-bold font-heading text-white">{item.name}</h3>

              {/* Formatted Formula Box */}
              <div className="my-3 p-3.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between group">
                <span className="font-mono text-sm sm:text-base font-bold text-amber-300 tracking-wide select-all">
                  {item.formula}
                </span>

                <button
                  onClick={() => handleCopyFormula(item.formula, item.id)}
                  className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-800 transition-colors text-[11px] font-mono shrink-0 ml-2"
                  title="Copy formula text"
                >
                  {copiedId === item.id ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Variable Keys */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                  Symbol Definitions &amp; Units
                </span>
                <div className="grid grid-cols-1 gap-1 text-xs text-slate-300">
                  {item.variables.map((v, i) => (
                    <div key={i} className="flex items-center justify-between text-[11.5px] bg-slate-950/40 px-2 py-1 rounded">
                      <span className="font-mono text-sky-300 font-semibold">{v.symbol}</span>
                      <span className="text-slate-300">{v.meaning}</span>
                      {v.unit && <span className="font-mono text-slate-500 text-[10.5px]">[{v.unit}]</span>}
                    </div>
                  ))}
                </div>
              </div>

              {item.note && (
                <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
                  Note: {item.note}
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredFormulas.length === 0 && (
          <div className="col-span-2 text-center p-8 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-xs">
            No formulas found matching "{searchQuery}". Try searching by chapter or subject.
          </div>
        )}
      </div>
    </div>
  );
};
