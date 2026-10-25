import React from 'react';
import { AdvaitLogo } from './AdvaitLogo.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenAuthModal }) => {
  const { user, isAuthenticated, isTeacher, advaitCoins, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => setActiveTab('curriculum')}
          className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
        >
          <AdvaitLogo size={34} />
          <div>
            <span className="font-heading font-extrabold text-base sm:text-lg tracking-wider text-white whitespace-nowrap block leading-tight group-hover:text-sky-400 transition-colors">
              ADVAIT INSIGHTS
            </span>
            <span className="text-[10px] font-mono text-sky-400 block leading-none">
              Maths Class 9 &amp; 10
            </span>
          </div>
        </button>

        {/* Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold text-slate-300">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeTab === 'curriculum' ? 'text-sky-400 font-bold' : 'text-slate-300'
            }`}
          >
            NCERT Chapters
          </button>

          {/* ⚔️ BATTLE GROUND TAB */}
          <button
            onClick={() => setActiveTab('battle')}
            className={`whitespace-nowrap transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold cursor-pointer ${
              activeTab === 'battle'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-amber-950/40 text-amber-300 border border-amber-500/40 hover:bg-amber-900/40 hover:text-white'
            }`}
          >
            <span className="text-sm">⚔️</span>
            <span>Battle Ground</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full font-black animate-pulse">
              10 Players
            </span>
          </button>

          <button
            onClick={() => setActiveTab('timetable')}
            className={`whitespace-nowrap transition-colors hover:text-white flex items-center gap-1.5 ${
              activeTab === 'timetable' ? 'text-amber-400 font-bold' : 'text-slate-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>📅 Timetable</span>
          </button>

          <button
            onClick={() => setActiveTab('truewords')}
            className={`whitespace-nowrap transition-colors hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
              activeTab === 'truewords' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 font-bold' : 'text-orange-400 hover:text-orange-300'
            }`}
          >
            <span className="text-sm">🔥</span>
            <span>True Words</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-guru')}
            className={`whitespace-nowrap transition-colors hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
              activeTab === 'ai-guru' ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 font-bold' : 'text-sky-400 hover:text-sky-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>AI Guru</span>
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className={`whitespace-nowrap transition-colors hover:text-white flex items-center gap-1 ${
              activeTab === 'practice' ? 'text-emerald-400 font-bold' : 'text-slate-300'
            }`}
          >
            <span>PYQs</span>
          </button>

          <button
            onClick={() => setActiveTab('canvas')}
            className={`whitespace-nowrap transition-all flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
              activeTab === 'canvas'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50 font-bold shadow-sm'
                : 'text-sky-400 hover:text-sky-300 hover:bg-slate-800/60'
            }`}
          >
            <span>🎨 Whiteboard</span>
          </button>

          <button
            onClick={() => setActiveTab('solvers')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeTab === 'solvers' ? 'text-amber-400 font-bold' : 'text-slate-300'
            }`}
          >
            Solvers
          </button>

          <div className="flex items-center">
            <button
              onClick={() => setActiveTab('chat')}
              className={`whitespace-nowrap transition-colors hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-l-lg ${
                activeTab === 'chat' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <span>💬 Chat</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </button>
            <a
              href="?tab=chat&fullpage=true"
              target="_blank"
              rel="noopener noreferrer"
              className="px-1.5 py-1 text-slate-400 hover:text-amber-300 bg-slate-900 border border-l-0 border-slate-800 rounded-r-lg text-[10px] font-mono transition-colors"
              title="Open Chat in New Window / Tab"
            >
              ↗
            </a>
          </div>

          <button
            onClick={() => setActiveTab('live')}
            className={`whitespace-nowrap transition-all flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
              activeTab === 'live'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/40'
                : 'bg-red-950/60 text-red-300 border border-red-500/40 hover:bg-red-900/60 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span>🔴 Live Class</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap transition-colors hover:text-white flex items-center gap-1 ${
              activeTab === 'dashboard' ? 'text-purple-400 font-bold' : 'text-slate-300'
            }`}
          >
            <span>{isTeacher ? '👑 Teacher' : '📊 Dashboard'}</span>
          </button>
        </nav>

        {/* Right Section: Auth & Advait Coins & YouTube */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Advait Coins Golden Pill */}
          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('battle')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/15 border border-amber-500/40 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition-all shadow-sm cursor-pointer"
              title="Your Advait Coins Balance (Win 5 Coins in Battle Ground!)"
            >
              <span>🪙</span>
              <span className="font-mono font-black text-amber-400">{advaitCoins}</span>
              <span className="text-[10px] text-amber-300/80">Coins</span>
            </button>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 py-1 px-2.5 rounded-xl text-xs">
              <span className="font-mono text-white text-[11px] truncate max-w-[90px] sm:max-w-[130px]">
                {isTeacher ? '👑 ' : '🎓 '}{user?.name}
              </span>
              <button
                onClick={logout}
                className="text-[10px] text-slate-400 hover:text-rose-400 font-mono underline"
                title="Sign Out"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>🔑</span>
              <span className="hidden sm:inline">Sign In / Register</span>
              <span className="sm:hidden">Login</span>
            </button>
          )}

          <a
            href="https://www.youtube.com/channel/UCaEO5yq1mT50Tv76XAAhUcg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502-5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span className="hidden sm:inline">@AdvaitInsights_AI</span>
          </a>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center gap-2.5 px-3 py-2 bg-slate-900 border-t border-slate-800/80 overflow-x-auto text-xs font-medium text-slate-300">
        <button
          onClick={() => setActiveTab('battle')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-lg flex items-center gap-1 font-black ${
            activeTab === 'battle'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
          }`}
        >
          <span>⚔️</span>
          <span>Battle</span>
        </button>
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'curriculum' ? 'bg-sky-500 text-white font-bold' : ''}`}
        >
          Chapters
        </button>
        <button
          onClick={() => setActiveTab('timetable')}
          className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'timetable' ? 'bg-amber-500 text-slate-950 font-bold' : ''}`}
        >
          📅 Live Timetable
        </button>
        <button
          onClick={() => setActiveTab('truewords')}
          className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'truewords' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black' : 'text-orange-400'}`}
        >
          🔥 True Words
        </button>
        <button
          onClick={() => setActiveTab('ai-guru')}
          className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'ai-guru' ? 'bg-sky-500 text-white font-bold' : 'text-sky-400'}`}
        >
          🤖 AI Guru
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'practice' ? 'bg-emerald-600 text-white font-bold' : ''}`}
        >
          1000+ PYQs
        </button>
        <button
          onClick={() => setActiveTab('canvas')}
          className={`whitespace-nowrap px-2 py-1 rounded flex items-center gap-1 ${
            activeTab === 'canvas' ? 'bg-sky-500 text-white font-bold' : 'text-sky-400'
          }`}
        >
          <span>🎨 Whiteboard</span>
        </button>
        <button
          onClick={() => setActiveTab('solvers')}
          className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'solvers' ? 'bg-amber-500 text-slate-950 font-bold' : ''}`}
        >
          Solvers
        </button>
        <div className="flex items-center shrink-0">
          <button
            onClick={() => setActiveTab('chat')}
            className={`whitespace-nowrap px-2 py-1 rounded-l ${activeTab === 'chat' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black' : 'text-amber-400'}`}
          >
            💬 Chat
          </button>
          <a
            href="?tab=chat&fullpage=true"
            target="_blank"
            rel="noopener noreferrer"
            className="px-1.5 py-1 text-slate-400 hover:text-amber-300 bg-slate-950 border-l border-slate-800 rounded-r text-[10px]"
            title="Open Chat in New Page"
          >
            ↗
          </a>
        </div>
        <button
          onClick={() => setActiveTab('live')}
          className={`whitespace-nowrap px-2.5 py-1 rounded flex items-center gap-1 ${
            activeTab === 'live'
              ? 'bg-red-600 text-white font-black shadow-md'
              : 'bg-red-950/80 text-red-300 border border-red-500/50'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
          <span>🔴 Live Class</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'dashboard' ? 'bg-purple-600 text-white font-bold' : ''}`}
        >
          {isTeacher ? 'Teacher' : 'Dashboard'}
        </button>
      </div>
    </header>
  );
};
