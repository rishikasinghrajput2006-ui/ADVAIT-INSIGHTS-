import React, { useState, useEffect } from 'react';
import { AdvaitLogo } from './AdvaitLogo.tsx';

interface AdvaitinIntroModalProps {
  onComplete: () => void;
}

export const AdvaitinIntroModal: React.FC<AdvaitinIntroModalProps> = ({ onComplete }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(10);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const triggerClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Animated Gradient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-xl w-full text-center space-y-6 p-8 bg-slate-900/90 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden">
        {/* Glow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600/30 via-sky-500/30 to-amber-500/30 border border-sky-400/50 shadow-lg animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-sm sm:text-base font-extrabold font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-sky-400">
            #ADVAITIN
          </span>
        </div>

        {/* Animated Brand Emblem */}
        <div className="flex justify-center relative">
          <div className="relative p-3 rounded-2xl bg-slate-950/80 border border-slate-700 shadow-2xl">
            <AdvaitLogo size={80} />
          </div>
        </div>

        {/* Welcome Headline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-amber-300 to-red-400">#ADVAITIN</span>!
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed">
            Welcome to <strong>Advait Insights</strong> by <strong>Harsh Tiwary Sir</strong>. India&apos;s premier interactive concept mastery platform for <strong>Class 9 &amp; 10 Mathematics</strong>.
          </p>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 text-xs font-mono">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-sky-400 font-bold block text-sm">25 Chapters</span>
            <span className="text-slate-400 text-[10px]">NCERT Math 9 &amp; 10</span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-amber-400 font-bold block text-sm">1000+ PYQs</span>
            <span className="text-slate-400 text-[10px]">CBSE Sample Papers</span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold block text-sm">AI Guru Tutor</span>
            <span className="text-slate-400 text-[10px]">Instant Doubt Solver</span>
          </div>
        </div>

        {/* Countdown & Action Bar */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sky-400">
              {secondsRemaining}
            </div>
            <span>Entering classroom in {secondsRemaining}s...</span>
          </div>

          <button
            onClick={triggerClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Enter #ADVAITIN Classroom</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
