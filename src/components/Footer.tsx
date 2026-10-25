import React from 'react';
import { AdvaitLogo } from './AdvaitLogo.tsx';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <AdvaitLogo size={40} />
              <div>
                <span className="font-heading font-extrabold text-base tracking-wider text-white block">
                  ADVAIT INSIGHTS
                </span>
                <span className="text-[11px] text-sky-400 font-medium">Class 9 &amp; 10 Education</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Empowering students with visual conceptual intuition, rigorous NCERT problem solving, and comprehensive board preparation.
            </p>
          </div>

          {/* Quick Curriculum Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase tracking-wider text-slate-200 font-semibold">Academic Modules</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onNavigate('live')} className="hover:text-white transition-colors text-red-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                  <span>🔴 Direct Live Video Class</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('canvas')} className="hover:text-white transition-colors text-sky-400 font-bold flex items-center gap-1.5">
                  <span>🎨 World-Class Smart Whiteboard</span>
                  <span className="text-[10px] px-1 bg-amber-400 text-slate-950 rounded font-black">Photo</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('doubts')} className="hover:text-white transition-colors text-amber-400 font-semibold">
                  Ask a Doubt Portal ❓
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('chat')} className="hover:text-white transition-colors text-amber-400 font-semibold flex items-center gap-1">
                  <span>Live Community Chat 💬</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-guru')} className="hover:text-white transition-colors text-sky-400 font-semibold">
                  AI Guru (All Languages 🎙️)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('curriculum')} className="hover:text-white transition-colors">
                  Class 10 &amp; 9 Curriculum
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('formulas')} className="hover:text-white transition-colors">
                  Formula &amp; Law Vault
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tests')} className="hover:text-white transition-colors">
                  Competency Practice Tests
                </button>
              </li>
            </ul>
          </div>

          {/* Interactive Simulation Labs */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase tracking-wider text-slate-200 font-semibold">Simulation Labs</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onNavigate('simulations')} className="hover:text-white transition-colors">
                  Ray Optics &amp; Lens Bench
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('simulations')} className="hover:text-white transition-colors">
                  Acid-Base Titration &amp; pH
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('simulations')} className="hover:text-white transition-colors">
                  Quadratic Parabola Visualizer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('simulations')} className="hover:text-white transition-colors">
                  Ohm’s Law Circuit Workbench
                </button>
              </li>
            </ul>
          </div>

          {/* Official YouTube Channel */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-slate-200 font-semibold">Official Channel</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe to Advait Insights on YouTube for video explanations, animated concept shorts, and live revisions.
            </p>
            <a
              href="https://www.youtube.com/channel/UCaEO5yq1mT50Tv76XAAhUcg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>Subscribe @AdvaitInsights_AI</span>
            </a>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Advait Insights. Dedicated to Class 9 &amp; Class 10 academic excellence.</p>
          <div className="flex items-center gap-4">
            <span>NCERT Aligned</span>
            <span>·</span>
            <span>CBSE / ICSE Standard</span>
            <span>·</span>
            <a
              href="https://www.youtube.com/channel/UCaEO5yq1mT50Tv76XAAhUcg"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              youtube.com/@AdvaitInsights_AI
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
