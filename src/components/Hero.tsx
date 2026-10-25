import React from 'react';
import { GradeLevel } from '../types/index.ts';
import { AdvaitLogo } from './AdvaitLogo.tsx';

interface HeroProps {
  currentGrade: GradeLevel;
  setGrade: (grade: GradeLevel) => void;
  onExploreLabs: () => void;
  onStartQuiz: () => void;
  onOpenAIGuru: () => void;
  onWatchVideos?: () => void;
  onOpenBattleGround?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentGrade,
  setGrade,
  onExploreLabs,
  onStartQuiz,
  onOpenAIGuru,
  onWatchVideos,
  onOpenBattleGround,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-column split with items-stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Mission, Grade Switcher, & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Unboxed Metadata Header */}
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-3">
                <span className="text-amber-400 font-semibold">NCERT &amp; CBSE Aligned</span>
                <span aria-hidden="true">·</span>
                <span>Class 9 &amp; Class 10 Academic Suite</span>
                <span aria-hidden="true">·</span>
                <span className="text-sky-400 font-mono">2026 Edition</span>
              </div>

              {/* Title with Balanced Wrap */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-[1.15] text-balance">
                Master Class 9 &amp; 10 Concepts with Deep Intuition.
              </h1>

              <p className="mt-4 text-base text-slate-300 leading-relaxed max-w-2xl">
                Advait Insights delivers rigorous conceptual clarity for Class 9 &amp; 10 Mathematics. Explore interactive parabola &amp; coordinate graphing benches, master NCERT chapter formulas, practice competency-based board questions, and solve math doubts instantly.
              </p>
            </div>

            {/* Interactive Grade Selector Segmented Control */}
            <div className="bg-slate-950 border border-slate-800 p-2 rounded-xl">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block px-2 mb-2">
                Select Your Academic Grade
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setGrade('class10')}
                  className={`py-3 px-4 rounded-lg text-left transition-all ${
                    currentGrade === 'class10'
                      ? 'bg-sky-500/15 border border-sky-400/60 text-white shadow-sm'
                      : 'bg-slate-900/60 border border-slate-800/70 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-base text-white">Class 10</span>
                    {currentGrade === 'class10' && (
                      <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider">Active</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">Board Exam Preparation &amp; High-Yield Trends</span>
                </button>

                <button
                  onClick={() => setGrade('class9')}
                  className={`py-3 px-4 rounded-lg text-left transition-all ${
                    currentGrade === 'class9'
                      ? 'bg-amber-500/15 border border-amber-400/60 text-white shadow-sm'
                      : 'bg-slate-900/60 border border-slate-800/70 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-base text-white">Class 9</span>
                    {currentGrade === 'class9' && (
                      <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Active</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">Foundation Mastery &amp; Analytical Rigor</span>
                </button>
              </div>
            </div>

            {/* ⚔️ FLAGSHIP CENTERPIECE: CBSE MATH BATTLE GROUND SPOTLIGHT */}
            <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-orange-950/50 border-2 border-amber-500/70 shadow-xl shadow-amber-950/30 group">
              <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-bl-xl shadow-md flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                <span>⭐ PURI WEBSITE KA MAIN ARENA</span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚔️</span>
                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                      <span>CBSE Math Battle Ground</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        10 Players Live
                      </span>
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sir asks CBSE math questions live! Students answer in the live answer box with a 1-minute timer.
                    <span className="text-amber-300 font-bold"> +10 Points </span> &amp; Winner gets <span className="text-amber-400 font-extrabold">5 Advait Coins (🪙🪙🪙🪙🪙)</span>. Live submission tracker shows kitne students ne answer de diya!
                  </p>
                </div>

                <button
                  onClick={onOpenBattleGround}
                  className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.03] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>⚔️ Enter Battle Ground</span>
                  <span className="text-xs font-mono font-bold bg-slate-950 text-amber-300 px-2 py-0.5 rounded-md">LIVE</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onOpenBattleGround}
                className="px-5 py-2.5 text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 rounded-lg transition-all whitespace-nowrap shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>⚔️</span>
                <span>Battle Ground (10 Players)</span>
              </button>

              <button
                onClick={onOpenAIGuru}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shadow-md flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>Talk to AI Guru</span>
              </button>

              <button
                onClick={onExploreLabs}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors whitespace-nowrap shadow-md flex items-center gap-2"
              >
                <span>Interactive Labs</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <button
                onClick={onStartQuiz}
                className="px-4 py-2.5 text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
              >
                Practice Quiz
              </button>

              <a
                href="https://www.youtube.com/channel/UCaEO5yq1mT50Tv76XAAhUcg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
              >
                <svg className="w-4 h-4 fill-red-500" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502-5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual Card with Brand Emblem & Students */}
          <div className="lg:col-span-5 relative flex flex-col justify-end rounded-2xl overflow-hidden border border-slate-800 shadow-2xl min-h-[360px] lg:h-full">
            <img
              src="/images/hero_advait_learning_1792302950582.jpg"
              alt="Students collaborating at Advait Insights educational library"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80';
              }}
            />
            {/* Measured Scrim for WCAG AA compliance */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            {/* Emblem Overlay at Top Right */}
            <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md p-2 rounded-full border border-slate-700/60 shadow-lg">
              <AdvaitLogo size={48} />
            </div>

            {/* Bottom Card Content */}
            <div className="relative p-6 text-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Featured Channel: @AdvaitInsights_AI</span>
              </div>
              <h2 className="text-lg font-bold font-heading text-white">
                Concept Visualizations &amp; One-Shot Revision
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Watch comprehensive breakdowns of Physics numericals, chemical equations, and geometrical proofs on our official video series.
              </p>
            </div>
          </div>
        </div>

        {/* 4-column KPI strip below hero split */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block">Curriculum Alignment</span>
            <span className="font-heading font-bold text-xl text-white mt-1 block">100% NCERT</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">CBSE &amp; State Boards</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block">Interactive Simulations</span>
            <span className="font-heading font-bold text-xl text-sky-400 mt-1 block tabular-nums">4 Active Labs</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Optics, pH, Parabola, Circuits</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block">High-Yield Questions</span>
            <span className="font-heading font-bold text-xl text-amber-400 mt-1 block tabular-nums">500+ PYQs</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">1M, 2M, 3M &amp; 5M breakdowns</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block">Target Audience</span>
            <span className="font-heading font-bold text-xl text-emerald-400 mt-1 block">Class 9 &amp; 10</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Board Exam &amp; Foundation</span>
          </div>
        </div>
      </div>
    </section>
  );
};
