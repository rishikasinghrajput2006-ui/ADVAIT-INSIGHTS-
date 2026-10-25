import React, { useState } from 'react';
import { Chapter, GradeLevel, SubjectId } from '../types/index.ts';
import { CHAPTERS_DATA, SUBJECTS } from '../data/curriculumData.ts';
import { ChapterNotesModal } from './ChapterNotesModal.tsx';

interface CurriculumViewProps {
  grade: GradeLevel;
  onLaunchSimulation: (simId: string) => void;
  onStartQuiz: () => void;
  onWatchVideo?: (chapterId: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  grade,
  onLaunchSimulation,
  onStartQuiz,
  onWatchVideo,
}) => {
  const [activeSubject, setActiveSubject] = useState<SubjectId>('science');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const subjects = SUBJECTS[grade];
  const currentSubjectObj = subjects.find((s) => s.id === activeSubject) || subjects[0];

  // Filter chapters by current grade and subject, plus optional search
  const chapters = CHAPTERS_DATA.filter((c) => {
    const gradeMatch = c.grade === grade && c.subjectId === activeSubject;
    const searchMatch =
      searchQuery.trim() === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtopics.some((st) => st.toLowerCase().includes(searchQuery.toLowerCase()));
    return gradeMatch && searchMatch;
  });

  // Subject Visual Asset Map
  const subjectVisuals: Record<SubjectId, string> = {
    science: '/images/diagram_chemical_reactions_1792302951299.jpg',
    math: '/images/math_geometry_visual_1792302951901.jpg',
    social: '/images/hero_advait_learning_1792302950582.jpg',
    english: '/images/hero_advait_learning_1792302950582.jpg',
  };

  return (
    <div className="space-y-8">
      {/* Subject Segmented Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            {grade === 'class10' ? 'Class 10 Board Curriculum' : 'Class 9 Foundation Curriculum'}
          </span>
          <h2 className="text-2xl font-bold font-heading text-white mt-0.5">Subject Syllabus &amp; Key Units</h2>
        </div>

        {/* Segmented Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveSubject(sub.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeSubject === sub.id
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Subject Overview Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl min-h-[220px] flex items-center">
        <img
          src={subjectVisuals[activeSubject]}
          alt={currentSubjectObj.name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

        <div className="relative p-6 sm:p-8 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <span>{currentSubjectObj.tagline}</span>
            <span>·</span>
            <span>{currentSubjectObj.chaptersCount} Chapters</span>
          </div>
          <h3 className="text-2xl font-bold font-heading text-white">
            {currentSubjectObj.name} Mastery Modules
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {currentSubjectObj.overview}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onLaunchSimulation('parabola')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Launch Quadratic Parabola Lab</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
            <a
              href="https://www.youtube.com/channel/UCaEO5yq1mT50Tv76XAAhUcg"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 border border-slate-700/80 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Watch Video Lessons</span>
              <svg className="w-3.5 h-3.5 fill-red-500" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Chapter Cards Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              {grade === 'class10' ? 'Class 10' : 'Class 9'} Detailed Chapters ({currentSubjectObj.name})
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              {chapters.length} Full NCERT Chapters Available with Notes &amp; Solved PYQs
            </span>
          </div>

          {/* Quick Chapter Search Bar */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder={`Search in ${currentSubjectObj.name}...`}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
            >
              <div>
                {/* Unboxed Metadata Header (No pills rule) */}
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-mono">
                  <span>Unit {chapter.number}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-400 font-semibold">{chapter.examWeightage}</span>
                  <span aria-hidden="true">·</span>
                  <span>NCERT Exemplar</span>
                </div>

                <h3 className="text-lg font-bold font-heading text-white group-hover:text-sky-400 transition-colors">
                  {chapter.title}
                </h3>

                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {chapter.summary}
                </p>

                {/* Subtopic Checklist */}
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1.5">
                    Core Subtopics
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {chapter.subtopics.map((st, i) => (
                      <span key={i} className="text-xs text-slate-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-xs">
                <button
                  onClick={() => setSelectedChapter(chapter)}
                  className="font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
                >
                  <span>Study Notes &amp; PYQs</span>
                  <span aria-hidden="true">&rarr;</span>
                </button>

                <div className="flex items-center gap-2">


                  <button
                    onClick={onStartQuiz}
                    className="text-slate-400 hover:text-white px-2.5 py-1 bg-slate-950 rounded border border-slate-800 transition-colors"
                  >
                    Quiz Drill
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Fallback Empty card state if other subjects don't have extensive chapters listed yet */}
          {chapters.length === 0 && (
            <div className="col-span-2 bg-slate-900 border border-slate-800/60 rounded-xl p-8 text-center space-y-3">
              <span className="text-xs text-slate-400 font-mono">Curriculum Module Sync</span>
              <h4 className="text-base font-semibold text-white">Full NCERT Syllabus Ready</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Comprehensive notes and formula flashcards for {currentSubjectObj.name} are available. Visit our YouTube channel for complete video walkthroughs!
              </p>
              <a
                href="https://www.youtube.com/channel/UCaEO5yq1mT50Tv76XAAhUcg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
              >
                <span>Watch {currentSubjectObj.name} Playlist on @AdvaitInsights_AI</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Chapter Notes Modal */}
      <ChapterNotesModal
        chapter={selectedChapter}
        onClose={() => setSelectedChapter(null)}
        onStartQuiz={onStartQuiz}
        onWatchVideo={onWatchVideo}
      />
    </div>
  );
};
