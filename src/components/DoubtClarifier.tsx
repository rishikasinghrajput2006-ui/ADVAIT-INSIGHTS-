import React, { useState } from 'react';
import { GradeLevel, SubjectId } from '../types/index.ts';
import { DOUBTS_FAQS } from '../data/curriculumData.ts';

interface DoubtClarifierProps {
  grade: GradeLevel;
  onOpenLab: (labId: string) => void;
}

export const DoubtClarifier: React.FC<DoubtClarifierProps> = ({ grade, onOpenLab }) => {
  const [activeSubject, setActiveSubject] = useState<SubjectId | 'all'>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Ask Advait Interactive Prompt
  const [studentQuestion, setStudentQuestion] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<{
    topic: string;
    guidance: string;
    relevantLab?: string;
  } | null>(null);

  const filteredDoubts = DOUBTS_FAQS.filter((d) => {
    const gradeMatch = d.grade === grade;
    const subjectMatch = activeSubject === 'all' || d.subject === activeSubject;
    const searchMatch =
      searchFilter === '' ||
      d.question.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.shortAnswer.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.deepExplanation.toLowerCase().includes(searchFilter.toLowerCase());
    return gradeMatch && subjectMatch && searchMatch;
  });

  const handleAskClarifier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentQuestion.trim()) return;

    const qLower = studentQuestion.toLowerCase();
    if (qLower.includes('light') || qLower.includes('lens') || qLower.includes('mirror') || qLower.includes('reflection') || qLower.includes('refraction')) {
      setAiResponse({
        topic: 'Optics & Spherical Surfaces',
        guidance: 'In Cartesian sign conventions, object distance u is always negative. When drawing ray diagrams, minimum two distinct incident rays (one parallel to axis, one through center/focus) are required to determine image position.',
        relevantLab: 'optics',
      });
    } else if (qLower.includes('acid') || qLower.includes('base') || qLower.includes('ph') || qLower.includes('litmus') || qLower.includes('neutral')) {
      setAiResponse({
        topic: 'Acids, Bases & pH Equilibrium',
        guidance: 'pH represents the negative logarithm of hydronium ion concentration. Strong acids dissociate completely in aqueous solution, while weak acids like acetic acid remain in partial ionic equilibrium.',
        relevantLab: 'chemistry',
      });
    } else if (qLower.includes('quadratic') || qLower.includes('root') || qLower.includes('parabola') || qLower.includes('discriminant')) {
      setAiResponse({
        topic: 'Quadratic Equations & Discriminant',
        guidance: 'Equal roots occur strictly when D = b² - 4ac = 0. If D > 0, the parabola cuts the X-axis twice. If D < 0, the parabola never crosses the real X-axis.',
        relevantLab: 'parabola',
      });
    } else if (qLower.includes('current') || qLower.includes('resistance') || qLower.includes('ohm') || qLower.includes('volt')) {
      setAiResponse({
        topic: 'Current Electricity & Circuit Laws',
        guidance: 'Remember: In series connections, current stays identical across each resistor while voltage divides. In parallel, voltage is identical while current branches.',
        relevantLab: 'circuit',
      });
    } else {
      setAiResponse({
        topic: 'Syllabus Conceptual Guidance',
        guidance: 'Core concept registered. Review the NCERT textbook definitions and watch the dedicated one-shot walkthrough on our YouTube channel @AdvaitInsights_AI for detailed graphical and numerical derivation!',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold font-mono">
            {grade === 'class10' ? 'Class 10 Board Doubt Breaker' : 'Class 9 Conceptual Clarifier'}
          </span>
          <h2 className="text-2xl font-bold font-heading text-white mt-0.5">Frequent Conceptual Doubts &amp; Traps</h2>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setActiveSubject('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubject === 'all' ? 'bg-sky-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Doubts
          </button>
          <button
            onClick={() => setActiveSubject('science')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubject === 'science' ? 'bg-sky-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Science
          </button>
          <button
            onClick={() => setActiveSubject('math')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubject === 'math' ? 'bg-sky-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Math
          </button>
        </div>
      </div>

      {/* Ask Question Clarifier Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold font-heading text-white mb-1">
          Have a Tricky Concept Question?
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Type your topic or doubt (e.g., "Why does convex lens converge?", "What happens when wire is stretched?", "Equal roots condition") for immediate guidance.
        </p>

        <form onSubmit={handleAskClarifier} className="flex gap-2">
          <input
            type="text"
            placeholder="Type your question or concept here..."
            value={studentQuestion}
            onChange={(e) => setStudentQuestion(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 shadow-sm"
          >
            Get Clarification
          </button>
        </form>

        {aiResponse && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-sky-900/50 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-sky-400 font-mono">{aiResponse.topic}</span>
              {aiResponse.relevantLab && (
                <button
                  onClick={() => onOpenLab(aiResponse.relevantLab!)}
                  className="text-amber-400 hover:text-amber-300 font-semibold underline text-xs"
                >
                  Open Related Interactive Simulation &rarr;
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {aiResponse.guidance}
            </p>
          </div>
        )}
      </div>

      {/* Search Filter for Curated FAQs */}
      <div className="relative">
        <input
          type="text"
          placeholder="Filter common board questions & traps..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />
      </div>

      {/* Accordion / List of Doubts */}
      <div className="space-y-4">
        {filteredDoubts.map((doubt) => {
          const isExpanded = expandedId === doubt.id;
          return (
            <div
              key={doubt.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all shadow-md"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : doubt.id)}
                className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-slate-800/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
                    <span className="uppercase text-sky-400 font-semibold">{doubt.subject}</span>
                    <span>·</span>
                    <span>Common Exam Question</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white font-heading">
                    {doubt.question}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {doubt.shortAnswer}
                  </p>
                </div>

                <span className="w-7 h-7 rounded-full bg-slate-950 flex items-center justify-center text-slate-400 font-mono text-xs shrink-0 border border-slate-800">
                  {isExpanded ? '−' : '+'}
                </span>
              </button>

              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-800/80 bg-slate-950/60 space-y-3 text-xs sm:text-sm animate-fade-in">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                      In-Depth Scientific Breakdown
                    </span>
                    <p className="text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                      {doubt.deepExplanation}
                    </p>
                  </div>

                  <div className="p-3 bg-rose-950/30 border border-rose-900/40 rounded-lg flex items-start gap-2.5 text-xs text-rose-200">
                    <span className="font-bold text-rose-400">Pitfall to Avoid:</span>
                    <span>{doubt.commonMistake}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredDoubts.length === 0 && (
          <div className="text-center p-8 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-xs">
            No doubts match the selected criteria.
          </div>
        )}
      </div>
    </div>
  );
};
