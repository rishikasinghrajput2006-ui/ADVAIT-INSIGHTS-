/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GradeLevel } from './types/index.ts';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { CurriculumView } from './components/CurriculumView.tsx';
import { LiveTimetableBanner } from './components/LiveTimetableBanner.tsx';
import { TrueWordsSection } from './components/TrueWordsSection.tsx';
import { AIGuruPage } from './components/AIGuruPage.tsx';
import { SamplePaperQuestionVault } from './components/Practice/SamplePaperQuestionVault.tsx';
import { HardestQuestionVault } from './components/Practice/HardestQuestionVault.tsx';
import { MathCanvasBoard } from './components/MathCanvas/MathCanvasBoard.tsx';
import { VisualMathSolvers } from './components/Solvers/VisualMathSolvers.tsx';
import { StudentDashboard } from './components/Dashboards/StudentDashboard.tsx';
import { TeacherDashboard } from './components/Dashboards/TeacherDashboard.tsx';
import { SimulationsHub } from './components/Simulations/SimulationsHub.tsx';
import { FormulaVault } from './components/FormulaVault.tsx';
import { ClassroomCommunityChat } from './components/Community/ClassroomCommunityChat.tsx';
import { LiveClassRoom } from './components/LiveClass/LiveClassRoom.tsx';
import { BattleArenaRoom } from './components/BattleGround/BattleArenaRoom.tsx';
import { AdvaitinIntroModal } from './components/AdvaitinIntroModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { HowToUseVideoSection } from './components/HowToUseVideoSection.tsx';
import { Footer } from './components/Footer.tsx';

function MainApp() {
  const { user, isTeacher, login } = useAuth();
  const [grade, setGrade] = useState<GradeLevel>('class10');
  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) return tabParam;
    } catch {
      // ignore
    }
    return 'curriculum';
  });
  const [activeLabId, setActiveLabId] = useState<string>('parabola');

  // Intro & Auth Modals
  const [showIntroModal, setShowIntroModal] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('advaitin_intro_viewed');
    } catch {
      return true;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<'student' | 'teacher'>('student');
  const [aiGuruPreloadQuestion, setAiGuruPreloadQuestion] = useState<string | undefined>(undefined);

  const handleLaunchSimulation = (simId: string) => {
    setActiveLabId(simId);
    setActiveTab('simulations');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleStartQuiz = () => {
    setActiveTab('practice');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleWatchVideo = () => {
    setActiveTab('timetable');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStudentAuth = () => {
    setAuthModalRole('student');
    setAuthModalOpen(true);
  };

  const handleOpenTeacherAuth = () => {
    setAuthModalRole('teacher');
    setAuthModalOpen(true);
  };

  const handleContinueAsGuest = () => {
    login({
      id: `guest-${Date.now()}`,
      name: 'Guest Advaitian',
      emailOrPhone: 'guest@advait.edu',
      role: 'student',
      grade: 'class10',
      rollNumberOrSection: 'Guest Student',
    });
  };

  const handleAskAIGuruWithQuestion = (questionText: string) => {
    setAiGuruPreloadQuestion(questionText);
    setActiveTab('ai-guru');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleDismissIntro = () => {
    try {
      sessionStorage.setItem('advaitin_intro_viewed', 'true');
    } catch {
      // ignore
    }
    setShowIntroModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* 10-Second #ADVAITIN Welcome Splash */}
      {showIntroModal && <AdvaitinIntroModal onComplete={handleDismissIntro} />}

      {/* Auth Modal with Student, Teacher & Guest buttons */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole={authModalRole}
      />

      {/* Top Banner: Weekly Live Sessions Timetable (ASIIMITTS Class 9 & 10 CBSE) */}
      <LiveTimetableBanner
        onOpenAIGuru={() => {
          setActiveTab('ai-guru');
          window.scrollTo({ top: 100, behavior: 'smooth' });
        }}
        onOpenLiveClass={() => {
          setActiveTab('live');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuthModal={handleOpenStudentAuth}
      />

      {/* Hero Banner (Only shown on curriculum / home overview) */}
      {activeTab === 'curriculum' && (
        <div className="space-y-4">
          <Hero
            currentGrade={grade}
            setGrade={setGrade}
            onExploreLabs={() => handleLaunchSimulation('parabola')}
            onStartQuiz={handleStartQuiz}
            onOpenAIGuru={() => {
              setActiveTab('ai-guru');
              window.scrollTo({ top: 100, behavior: 'smooth' });
            }}
            onOpenBattleGround={() => {
              setActiveTab('battle');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Quick 4 Access Buttons: Students, Teachers, Guest & Live Video Class */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3 text-xs">
                <span className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400 flex items-center justify-center font-bold text-sky-400">
                  #
                </span>
                <div>
                  <span className="font-bold text-white block">#ADVAITIN Classroom Access</span>
                  <span className="text-slate-400 text-[11px]">Select your role or enter directly into the Live Video Class</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => {
                    setActiveTab('battle');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>⚔️</span>
                  <span>Battle Ground (Win 5 Coins)</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('live');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer animate-pulse"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>🔴 Direct Live Video Class</span>
                </button>

                <button
                  onClick={handleOpenStudentAuth}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🎓 Student Sign Up / Login</span>
                </button>

                <button
                  onClick={handleOpenTeacherAuth}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>👑 Teacher Sign Up / Login</span>
                </button>

                <button
                  onClick={handleContinueAsGuest}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 hover:border-emerald-500/50 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>⚡ Continue as Guest</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Dynamic Tab Views */}
        {activeTab === 'curriculum' && (
          <div className="space-y-8">
            {/* Daily TRUE Words (Josh aur Sankalp) Banner */}
            <TrueWordsSection
              onStartPractice={() => {
                setActiveTab('practice');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAIGuru={() => {
                setActiveTab('ai-guru');
                window.scrollTo({ top: 100, behavior: 'smooth' });
              }}
            />

            <CurriculumView
              grade={grade}
              onLaunchSimulation={handleLaunchSimulation}
              onStartQuiz={handleStartQuiz}
              onWatchVideo={handleWatchVideo}
            />

            {/* How to Use Platform Video Walkthrough Guide */}
            <HowToUseVideoSection
              grade={grade}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              onOpenAIGuru={() => {
                setActiveTab('ai-guru');
                window.scrollTo({ top: 100, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {activeTab === 'truewords' && (
          <div className="space-y-6">
            <TrueWordsSection
              onStartPractice={() => {
                setActiveTab('practice');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAIGuru={() => {
                setActiveTab('ai-guru');
                window.scrollTo({ top: 100, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {activeTab === 'timetable' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest">
                      Live Schedule • Class 9 &amp; 10 CBSE
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    ASIIMITTS: Weekly Live Sessions Timetable
                  </h2>
                  <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                    Attend scheduled live doubt sessions, one-shot chapter revisions, and interactive games with Advait Insights faculty. All sessions broadcast live on YouTube.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href="https://www.youtube.com/channel/UCaEO5yq1mT50Tv76XAAhUcg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502-5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span>Open @AdvaitInsights_AI</span>
                  </a>
                  <button
                    onClick={() => {
                      setActiveTab('ai-guru');
                      window.scrollTo({ top: 100, behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>🤖 Ask AI Guru</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai-guru' && (
          <AIGuruPage
            grade={grade}
            initialTopic={aiGuruPreloadQuestion}
            onBackToHome={() => setActiveTab('curriculum')}
          />
        )}

        {activeTab === 'practice' && (
          <SamplePaperQuestionVault
            grade={grade}
            onAskAIGuruWithQuestion={handleAskAIGuruWithQuestion}
          />
        )}

        {(activeTab === 'canvas' || activeTab === 'whiteboard') && (
          <MathCanvasBoard
            grade={grade}
            onAskAIGuruWithDrawing={(question) => handleAskAIGuruWithQuestion(question)}
          />
        )}

        {activeTab === 'solvers' && (
          <VisualMathSolvers grade={grade} />
        )}

        {(activeTab === 'battle' || activeTab === 'battleground' || activeTab === 'arena') && (
          <BattleArenaRoom
            grade={grade}
            onOpenAuthModal={handleOpenStudentAuth}
            onOpenAIGuru={() => {
              setActiveTab('ai-guru');
              window.scrollTo({ top: 100, behavior: 'smooth' });
            }}
          />
        )}

        {(activeTab === 'live' || activeTab === 'live-stream' || activeTab === 'live-class') && (
          <LiveClassRoom
            grade={grade}
            onOpenTeacherAuth={handleOpenTeacherAuth}
            onOpenAIGuru={() => {
              setActiveTab('ai-guru');
              window.scrollTo({ top: 100, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'chat' && (
          <ClassroomCommunityChat
            grade={grade}
            onOpenAIGuru={() => {
              setActiveTab('ai-guru');
              window.scrollTo({ top: 100, behavior: 'smooth' });
            }}
            onCloseFullPage={() => {
              setActiveTab('curriculum');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenTeacherAuth={handleOpenTeacherAuth}
          />
        )}

        {activeTab === 'dashboard' && (
          isTeacher ? (
            <TeacherDashboard grade={grade} onOpenAuthModal={handleOpenTeacherAuth} />
          ) : (
            <StudentDashboard grade={grade} onNavigateTab={setActiveTab} />
          )
        )}

        {activeTab === 'hots' && (
          <HardestQuestionVault
            grade={grade}
            onAskAIGuruWithQuestion={handleAskAIGuruWithQuestion}
          />
        )}

        {activeTab === 'simulations' && (
          <SimulationsHub initialLabId={activeLabId} />
        )}

        {activeTab === 'formulas' && (
          <FormulaVault grade={grade} />
        )}

        {/* Global Fast Access Strip to #ADVAITIN YouTube */}
        <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-900/40 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-600/20 border border-red-500/40 rounded-xl flex items-center justify-center text-red-500 text-xl font-bold shrink-0">
              ▶
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-red-400 font-bold block">
                Official YouTube Channel · @AdvaitInsights_AI
              </span>
              <h4 className="text-base font-bold text-white">
                Live Chapters, One-Shot Revisions &amp; Weekly Doubts
              </h4>
              <p className="text-xs text-slate-400">
                Class 10 Live Doubts (Tue &amp; Thu 7 PM) · Class 9 Live Doubts (Mon &amp; Wed 6 PM)
              </p>
            </div>
          </div>

          <a
            href="https://www.youtube.com/channel/UCaEO5yq1mT50Tv76XAAhUcg"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-colors shadow-lg whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span>Subscribe @AdvaitInsights_AI</span>
            <span>&rarr;</span>
          </a>
        </div>
      </main>

      {/* Floating Ask AI Guru Trigger Pill */}
      {activeTab !== 'ai-guru' && (
        <button
          onClick={() => {
            setActiveTab('ai-guru');
            window.scrollTo({ top: 100, behavior: 'smooth' });
          }}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl border border-sky-400/40 flex items-center gap-3 hover:scale-105 transition-all group cursor-pointer"
          title="Ask AI Guru Math Doubt"
        >
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="font-bold text-xs sm:text-sm">🤖 Ask AI Guru Doubt</span>
        </button>
      )}



      {/* Global Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
