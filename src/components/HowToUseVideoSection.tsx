import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, ExternalLink, CheckCircle2, Clock, Sparkles, MessageSquare, Compass, ShieldCheck } from 'lucide-react';
import { GradeLevel } from '../types/index.ts';

interface HowToUseVideoSectionProps {
  grade: GradeLevel;
  onNavigateTab: (tab: string) => void;
  onOpenAIGuru: () => void;
}

interface VideoChapter {
  id: string;
  time: string;
  seconds: number;
  title: string;
  description: string;
  tag: string;
  screenBadge: string;
  tabKey?: string;
  highlights: string[];
}

const VIDEO_CHAPTERS: VideoChapter[] = [
  {
    id: 'intro',
    time: '00:00',
    seconds: 0,
    title: 'Platform Overview & Grade Selection',
    description: 'How to switch between Class 9 Foundation and Class 10 CBSE, access NCERT chapters, and view formulas.',
    tag: 'Getting Started',
    screenBadge: '🎓 NCERT Curriculum',
    tabKey: 'curriculum',
    highlights: ['Class 9 vs Class 10 syllabus toggle', 'Chapter concept notes with NCERT weightage', 'Formulas & law vault'],
  },
  {
    id: 'ai-guru',
    time: '01:15',
    seconds: 75,
    title: 'Asking Doubts with AI Guru (Hinglish/Hindi)',
    description: 'Type or speak any math question. AI Guru explains step-by-step NCERT reasoning, board exam tips, and formulas.',
    tag: 'AI Tutor',
    screenBadge: '🤖 AI Guru Doubt Solver',
    tabKey: 'ai-guru',
    highlights: ['Multi-language support (Hinglish/Hindi/English)', 'Voice playback of solutions', 'Direct email sync to Harsh Sir (Advaitinsights1927@gmail.com)'],
  },
  {
    id: 'timetable',
    time: '02:30',
    seconds: 150,
    title: 'Weekly Live Timetable & YouTube Classes',
    description: 'Check scheduled live sessions on YouTube (@AdvaitInsights_AI) for Class 9 and Class 10 with live doubt resolution.',
    tag: 'Live Schedule',
    screenBadge: '📅 Live Timetable',
    tabKey: 'timetable',
    highlights: ['Class 10 Live Doubts: Tue & Thu 7:00 PM', 'Class 9 Live Doubts: Mon & Wed 6:00 PM', 'One-shot revision sessions and YouTube link'],
  },
  {
    id: 'community-chat',
    time: '03:45',
    seconds: 225,
    title: 'Classroom Live Community Chat',
    description: 'Chat in real-time with classmates and Harsh Sir (👑). Use the math symbol inserter and ask AI Guru directly in chat.',
    tag: 'Community',
    screenBadge: '💬 Live Classroom Chat',
    tabKey: 'chat',
    highlights: ['Dedicated channels: #doubts, #teacher-bulletin, #pyq', '1-click Math symbol keyboard (√, ², π, θ, etc.)', 'Instant AI Guru answer in chat thread'],
  },
  {
    id: 'math-canvas',
    time: '05:00',
    seconds: 300,
    title: 'Interactive Math Canvas & Simulation Labs',
    description: 'Draw geometric figures, triangles, tangents, and interact with the Parabola visualizer and Ray Optics lab.',
    tag: 'Visual Labs',
    screenBadge: '📐 Math Canvas & Labs',
    tabKey: 'canvas',
    highlights: ['Draw proofs and submit directly to AI Guru', 'Interactive Quadratic Parabola simulator', 'Ray Optics and Physics circuit bench'],
  },
  {
    id: 'practice-pyqs',
    time: '06:15',
    seconds: 375,
    title: 'Solving 1000+ PYQs & HOTS Challenge',
    description: 'Practice real CBSE board previous year questions with marks breakdown and attempt the Weekly Hardest Math Question.',
    tag: 'Practice',
    screenBadge: '🏆 1000+ PYQ Vault',
    tabKey: 'practice',
    highlights: ['CBSE 2019-2025 Board question bank', 'Section-wise marks (1M, 2M, 3M, 5M)', 'Weekly HOTS challenge with model solutions'],
  },
  {
    id: 'dashboard',
    time: '07:30',
    seconds: 450,
    title: 'Student Dashboard & Progress Tracking',
    description: 'Track your daily questions solved, accuracy rate, chapter mastery, and earn Josh Warrior and Math Wizard badges.',
    tag: 'Progress',
    screenBadge: '📊 Performance Tracking',
    tabKey: 'dashboard',
    highlights: ['Weekly study streak and time spent', 'Chapter-wise accuracy analytics', 'Teacher remarks and achievement badges'],
  },
];

const TOTAL_DURATION_SECONDS = 525; // 8 mins 45 secs

export const HowToUseVideoSection: React.FC<HowToUseVideoSectionProps> = ({
  grade,
  onNavigateTab,
  onOpenAIGuru,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [activeTourRole, setActiveTourRole] = useState<'student' | 'teacher'>('student');
  const timerRef = useRef<any>(null);

  // Playback timer simulation
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentSeconds((prev) => {
          if (prev >= TOTAL_DURATION_SECONDS) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Update active chapter based on currentSeconds
  useEffect(() => {
    let matched = 0;
    for (let i = VIDEO_CHAPTERS.length - 1; i >= 0; i--) {
      if (currentSeconds >= VIDEO_CHAPTERS[i].seconds) {
        matched = i;
        break;
      }
    }
    setActiveChapterIndex(matched);
  }, [currentSeconds]);

  const activeChapter = VIDEO_CHAPTERS[activeChapterIndex] || VIDEO_CHAPTERS[0];

  const handleSeekChapter = (chapter: VideoChapter, index: number) => {
    setCurrentSeconds(chapter.seconds);
    setActiveChapterIndex(index);
    setIsPlaying(true);
  };

  const handleSeekSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCurrentSeconds(val);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, (currentSeconds / TOTAL_DURATION_SECONDS) * 100);

  return (
    <section id="how-to-use-guide" className="space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 text-red-400 border border-red-500/40 text-xs font-mono font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>OFFICIAL VIDEO WALKTHROUGH</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800 text-xs font-mono">
              Class 9 &amp; 10 CBSE Guide
            </span>
            <span className="text-xs text-amber-400 font-mono flex items-center gap-1">
              <span>👑 Advait Insights</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
            How to Use Advait Insights: Complete Platform Tour
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mt-1">
            Watch the comprehensive guide to mastering Class 9 &amp; 10 Mathematics. Learn how to solve NCERT doubts with AI Guru, attend YouTube live doubt classes, engage in classroom chat, and ace CBSE board exams.
          </p>
        </div>

        {/* Role Tour Switcher & YouTube Deep Link */}
        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0 flex-wrap">
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTourRole('student')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTourRole === 'student'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎓 Student Tour
            </button>
            <button
              onClick={() => setActiveTourRole('teacher')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTourRole === 'teacher'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              👑 Faculty Tour
            </button>
          </div>

          <a
            href="https://www.youtube.com/channel/UCaEO5yq1mT50Tv76XAAhUcg"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <ExternalLink size={14} />
            <span>Watch on YouTube</span>
          </a>
        </div>
      </div>

      {/* Main Video Walkthrough Stage */}
      <div
        className={`bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all ${
          isTheaterMode ? 'fixed inset-4 z-50 overflow-y-auto bg-slate-950/98 backdrop-blur-xl border-sky-500/50' : ''
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left/Main: Interactive Video Screen */}
          <div className="lg:col-span-8 flex flex-col bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800">
            {/* Virtual Screen Display */}
            <div className="relative aspect-video w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden group select-none">
              {/* Background Ambient Glow & Grid Graphic */}
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-950/40 via-slate-950 to-indigo-950/50" />
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Animated Screen Content Simulator */}
              <div className="relative z-10 w-full h-full p-4 sm:p-6 flex flex-col justify-between">
                {/* Top Overlay Badge in Video */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-white font-mono text-[11px] font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span>{activeChapter.screenBadge}</span>
                    </span>
                    <span className="text-[11px] font-mono text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded-lg border border-sky-800 backdrop-blur-sm hidden sm:inline">
                      Chapter {activeChapterIndex + 1}/{VIDEO_CHAPTERS.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800 backdrop-blur-sm">
                      {activeTourRole === 'teacher' ? '👑 Teacher Portal View' : '🎓 Student Walkthrough'}
                    </span>
                  </div>
                </div>

                {/* Central Visual Screen Simulation for the active chapter */}
                <div className="flex flex-col items-center justify-center text-center px-4 py-6 max-w-xl mx-auto space-y-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-amber-500 flex items-center justify-center text-3xl sm:text-4xl shadow-2xl ring-4 ring-sky-400/20 animate-pulse">
                    {activeChapter.id === 'intro' && '🎓'}
                    {activeChapter.id === 'ai-guru' && '🤖'}
                    {activeChapter.id === 'timetable' && '📅'}
                    {activeChapter.id === 'community-chat' && '💬'}
                    {activeChapter.id === 'math-canvas' && '📐'}
                    {activeChapter.id === 'practice-pyqs' && '🏆'}
                    {activeChapter.id === 'dashboard' && '📊'}
                  </div>

                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-sky-400 font-bold block">
                      {activeChapter.tag}
                    </span>
                    <h3 className="text-lg sm:text-2xl font-black text-white font-heading mt-1">
                      {activeChapter.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto line-clamp-2">
                      {activeChapter.description}
                    </p>
                  </div>

                  {/* Feature Highlights Pills inside Video */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                    {activeChapter.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[10px] sm:text-[11px] bg-slate-900/90 text-slate-200 border border-slate-700/80 px-2.5 py-0.5 rounded-full font-medium"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>

                  {/* Direct Launch Button inside Video */}
                  {activeChapter.tabKey && (
                    <button
                      onClick={() => onNavigateTab(activeChapter.tabKey!)}
                      className="mt-2 px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Jump to This Feature in App</span>
                      <span>&rarr;</span>
                    </button>
                  )}
                </div>

                {/* Bottom Overlay Status */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="hidden sm:inline">Advait Insights Visual Engine</span>
                    <span>• {formatTime(currentSeconds)} / {formatTime(TOTAL_DURATION_SECONDS)}</span>
                  </div>
                  <span className="text-amber-400">@AdvaitInsights_AI Official Tour</span>
                </div>
              </div>

              {/* Click to Toggle Play overlay button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors z-20 cursor-pointer group-hover:opacity-100 opacity-90"
                aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-sky-500/90 hover:bg-sky-400 text-white flex items-center justify-center shadow-2xl transition-transform transform group-hover:scale-110 ring-4 ring-white/30 backdrop-blur-sm">
                  {isPlaying ? (
                    <Pause size={28} className="fill-current" />
                  ) : (
                    <Play size={28} className="fill-current ml-1" />
                  )}
                </div>
              </button>
            </div>

            {/* Video Controls Bar */}
            <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 space-y-2">
              {/* Progress Slider */}
              <div className="relative flex items-center">
                <input
                  type="range"
                  min={0}
                  max={TOTAL_DURATION_SECONDS}
                  value={currentSeconds}
                  onChange={handleSeekSlider}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500 focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #0ea5e9 ${progressPercent}%, #1e293b ${progressPercent}%)`,
                  }}
                />
              </div>

              {/* Player Button Controls */}
              <div className="flex items-center justify-between gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>

                  <span className="font-mono text-xs text-slate-400">
                    <span className="text-white font-bold">{formatTime(currentSeconds)}</span> / {formatTime(TOTAL_DURATION_SECONDS)}
                  </span>
                </div>

                {/* Right controls: Theater mode toggle & YouTube link */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsTheaterMode(!isTheaterMode)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 text-xs"
                    title={isTheaterMode ? 'Exit Theater' : 'Expand Theater Mode'}
                  >
                    <Maximize2 size={14} />
                    <span>{isTheaterMode ? 'Exit Full' : 'Theater'}</span>
                  </button>

                  <a
                    href="https://www.youtube.com/channel/UCaEO5yq1mT50Tv76XAAhUcg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <span>▶ Subscribe Channel</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Chapter Timestamps & Step Index */}
          <div className="lg:col-span-4 flex flex-col bg-slate-900 p-4 sm:p-5 overflow-y-auto max-h-[500px] lg:max-h-none space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock size={14} className="text-sky-400" />
                <span>Tour Chapters ({VIDEO_CHAPTERS.length})</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">Click any step to jump</span>
            </div>

            {/* Chapters List */}
            <div className="space-y-2 flex-1">
              {VIDEO_CHAPTERS.map((ch, idx) => {
                const isSelected = idx === activeChapterIndex;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSeekChapter(ch, idx)}
                    className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer border flex items-start gap-3 ${
                      isSelected
                        ? 'bg-sky-950/70 border-sky-500 text-white shadow-md ring-1 ring-sky-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span
                      className={`px-2 py-1 rounded-lg font-mono text-[11px] font-bold shrink-0 ${
                        isSelected
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {ch.time}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-xs font-bold truncate ${
                            isSelected ? 'text-sky-300' : 'text-slate-200'
                          }`}
                        >
                          {ch.title}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {ch.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Teacher Direct Support Badge in Sidebar */}
            <div className="p-3 bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/40 rounded-xl space-y-1.5 text-xs">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <span>👑 Need 1-on-1 Guidance?</span>
              </span>
              <p className="text-[11px] text-slate-300">
                Email Harsh Sir directly at <strong>Advaitinsights1927@gmail.com</strong> or join the weekly live doubt streams on YouTube.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Simple Action Steps Below Video */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div className="p-5 bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-2xl space-y-2.5 transition-all shadow-md group">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center font-bold text-sky-400 font-mono text-base group-hover:scale-105 transition-transform">
            1
          </div>
          <h4 className="text-sm font-bold text-white font-heading">
            Select Grade &amp; NCERT Chapters
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Switch seamlessly between Class 10 CBSE and Class 9 Foundation. View core theorems, formula sheets, and chapter blueprints.
          </p>
          <button
            onClick={() => onNavigateTab('curriculum')}
            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 pt-1 cursor-pointer"
          >
            <span>Explore Chapters</span>
            <span>&rarr;</span>
          </button>
        </div>

        {/* Step 2 */}
        <div className="p-5 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl space-y-2.5 transition-all shadow-md group">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center font-bold text-emerald-400 font-mono text-base group-hover:scale-105 transition-transform">
            2
          </div>
          <h4 className="text-sm font-bold text-white font-heading">
            Ask AI Guru &amp; Submit Doubts
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Get instant proofs, theorem derivations, and exam trap alerts in Hinglish or Hindi. Voice playback supported.
          </p>
          <button
            onClick={onOpenAIGuru}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 pt-1 cursor-pointer"
          >
            <span>Ask AI Guru Now</span>
            <span>&rarr;</span>
          </button>
        </div>

        {/* Step 3 */}
        <div className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl space-y-2.5 transition-all shadow-md group">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-bold text-amber-400 font-mono text-base group-hover:scale-105 transition-transform">
            3
          </div>
          <h4 className="text-sm font-bold text-white font-heading">
            Live Chat &amp; 1000+ PYQ Vault
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Connect in real-time in the classroom community chat with peers, solve verified board questions, and test your speed.
          </p>
          <button
            onClick={() => onNavigateTab('chat')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1 cursor-pointer"
          >
            <span>Join Live Chat</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
};
