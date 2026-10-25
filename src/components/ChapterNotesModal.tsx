import React, { useState } from 'react';
import { Chapter } from '../types/index.ts';

interface ChapterNotesModalProps {
  chapter: Chapter | null;
  onClose: () => void;
  onStartQuiz: () => void;
  onWatchVideo?: (chapterId: string) => void;
}

export const ChapterNotesModal: React.FC<ChapterNotesModalProps> = ({
  chapter,
  onClose,
  onStartQuiz,
  onWatchVideo,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!chapter) return null;

  const handleCopyNotes = () => {
    const text = `ADVAIT INSIGHTS - ${chapter.grade.toUpperCase()}
Chapter ${chapter.number}: ${chapter.title}
Weightage: ${chapter.examWeightage}

[SYNOPSIS]
${chapter.summary}

[KEY CONCEPTS]
${chapter.keyConcepts.map((c, i) => `${i + 1}. ${c}`).join('\n')}

[CORE FORMULA / IDENTITY]
${chapter.formulaHighlight || 'N/A'}

[EXAMINER INSIGHTS]
${chapter.tips.map((t) => `- ${t}`).join('\n')}

[SOLVED PYQ]
Q: ${chapter.pyqSample.question}
Answer: ${chapter.pyqSample.answer}
(${chapter.pyqSample.year}, ${chapter.pyqSample.marks} Marks)
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100">
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-sky-400 font-bold uppercase">{chapter.grade.toUpperCase()}</span>
              <span>·</span>
              <span>Chapter {chapter.number}</span>
              <span>·</span>
              <span className="text-amber-400 font-semibold">{chapter.examWeightage}</span>
            </div>
            <h2 className="text-xl font-bold font-heading text-white mt-0.5">{chapter.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            {onWatchVideo && (
              <button
                onClick={() => {
                  onClose();
                  onWatchVideo(chapter.id);
                }}
                className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                title="Watch animated video lecture for this chapter"
              >
                <span>Watch Video</span>
                <span>🎬</span>
              </button>
            )}
            <button
              onClick={handleCopyNotes}
              className="px-2.5 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5"
              title="Copy formatted chapter revision notes"
            >
              <span>{copied ? 'Copied!' : 'Copy Notes'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close notes modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Executive Concept Summary */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-sky-400 mb-2">Chapter Synopsis</h3>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              {chapter.summary}
            </p>
          </div>

          {/* Formula / Identity Highlight */}
          {chapter.formulaHighlight && (
            <div className="bg-amber-950/30 border border-amber-800/60 p-4 rounded-xl">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 block mb-1">
                Must-Memorize Core Identity / Formula
              </span>
              <div className="font-mono text-sm font-bold text-amber-200">
                {chapter.formulaHighlight}
              </div>
            </div>
          )}

          {/* Key NCERT Concept Breakdowns */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">Key NCERT Pillars</h3>
            <div className="space-y-2.5">
              {chapter.keyConcepts.map((concept, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-xs font-mono font-bold text-sky-400 mt-0.5">0{idx + 1}.</span>
                  <span className="text-xs sm:text-sm text-slate-200 leading-relaxed">{concept}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Board Examiner Tips & Common Pitfalls */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-rose-400 mb-3">Board Examiner Insights</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {chapter.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-rose-950/20 border border-rose-900/40 p-3 rounded-lg">
                  <span className="text-rose-400 font-bold shrink-0">!</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sample Solved PYQ */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-emerald-400">Solved Exemplar / PYQ</h3>
              <span className="text-xs font-mono text-slate-400">{chapter.pyqSample.year} ({chapter.pyqSample.marks} Marks)</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <p className="text-xs sm:text-sm font-semibold text-white">Q: {chapter.pyqSample.question}</p>
              <div className="text-xs sm:text-sm text-slate-300 pt-2 border-t border-slate-800/80 leading-relaxed">
                <span className="text-emerald-400 font-semibold block mb-1">Model Board Answer:</span>
                {chapter.pyqSample.answer}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <a
            href="https://www.youtube.com/channel/UCaEO5yq1mT50Tv76XAAhUcg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Watch lectures on @AdvaitInsights_AI</span>
            <svg className="w-3.5 h-3.5 fill-red-500" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onStartQuiz();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm"
            >
              Test Knowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
