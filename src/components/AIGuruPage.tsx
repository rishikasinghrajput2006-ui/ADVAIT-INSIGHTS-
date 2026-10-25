import React, { useState, useEffect, useRef } from 'react';
import { GradeLevel } from '../types/index.ts';
import { AdvaitLogo } from './AdvaitLogo.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface AIGuruPageProps {
  grade: GradeLevel;
  initialTopic?: string;
  onBackToHome?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  gmailComposeUrl?: string;
  mailtoUrl?: string;
}

const QUICK_MATH_PROMPTS: Record<GradeLevel, { label: string; text: string }[]> = {
  class10: [
    { label: '√3 Irrational Proof', text: 'CBSE Board exam style me prove karke dikhao ki √3 ek irrational number hai, taki 3/3 marks mile.' },
    { label: 'Quadratic Discriminant Nature', text: 'Equation 2x² - 6x + 3 = 0 ke roots ka nature nikalo discriminant formula use karke.' },
    { label: 'Trigonometry Table Trick', text: 'Trigonometry standard angles (0°, 30°, 45°, 60°, 90°) ko yaad rakhne ki square root trick samjhao.' },
    { label: 'BPT (Thales Theorem)', text: 'State and prove Basic Proportionality Theorem (Thales Theorem) with complete board exam diagram steps.' },
    { label: 'AP nth term formula', text: 'Arithmetic progression me nth term a_n = a + (n-1)d aur Sum S_n = n/2[2a + (n-1)d] formula kaise derive hota hai?' },
  ],
  class9: [
    { label: 'Number Systems Conversion', text: '0.333... ya 0.23535... ko p/q form me convert karne ka step-by-step NCERT method samjhao.' },
    { label: 'Lines & Angles Proof', text: 'Prove that the sum of the angles of a triangle is 180° with neat figure and construction steps.' },
    { label: 'Heron\'s Formula Steps', text: 'Triangle ki sides 13 cm, 14 cm, 15 cm hain. Heron\'s formula se area find karke dikhao.' },
    { label: 'Coordinate Geometry Signs', text: 'Cartesian plane me charo quadrants (I, II, III, IV) ke x aur y signs yaad rakhne ka easy trick.' },
    { label: 'Algebraic Identities', text: '(a + b + c)² aur (a³ + b³ + c³ - 3abc) identity ka factorization proof bataiye.' },
  ],
};

export const AIGuruPage: React.FC<AIGuruPageProps> = ({ grade, initialTopic, onBackToHome }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [studentLanguage, setStudentLanguage] = useState<'hinglish' | 'hindi' | 'english'>('hinglish');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    const welcome: ChatMessage = {
      id: 'msg-welcome',
      role: 'assistant',
      text: `Namaste ${user?.name || 'Advaitian'}! 🙏 Main hoon aapka AI Guru Math Tutor.

Aap Class ${grade === 'class10' ? '10' : '9'} Mathematics ka koi bhi question, NCERT theorem, formula derivation ya board exam doubt Hinglish, Hindi ya English me pooch sakte hain.

Aapke sabhi questions Harsh Sir (**Advaitinsights1927@gmail.com**) ko bhi sync hote hain taaki aapko verified mentor support mile. Chaliye, apna pehla sawal poochiye!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([welcome]);

    if (initialTopic) {
      handleSendMessage(`Sir, please explain the core concept and board exam derivations of chapter: ${initialTopic}`);
    }
  }, [grade, initialTopic]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);
    setEmailStatus(null);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          grade,
          subject: 'Mathematics',
          language: studentLanguage,
          chatHistory: historyPayload,
          studentName: user?.name || 'Advait Student',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer from AI Guru');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        gmailComposeUrl: data.gmailComposeUrl,
        mailtoUrl: data.mailtoUrl,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: `Error connecting to AI Guru: ${err.message}. You can also email Harsh Sir directly at Advaitinsights1927@gmail.com!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text.slice(0, 400));
        utter.rate = 1.0;
        utter.onend = () => setIsSpeaking(false);
        utter.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utter);
        setIsSpeaking(true);
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Banner Navigation */}
      <div className="bg-slate-900 border-b border-slate-800 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400 flex items-center justify-center shrink-0">
            <AdvaitLogo size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                Advait AI Guru
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono border border-slate-700">
                {grade === 'class10' ? 'Class 10 CBSE Maths' : 'Class 9 Foundation Maths'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold font-heading text-white">
              Instant Mathematics Doubt Solver &amp; Concept Explainer
            </h2>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setStudentLanguage('hinglish')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                studentLanguage === 'hinglish' ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hinglish
            </button>
            <button
              onClick={() => setStudentLanguage('hindi')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                studentLanguage === 'hindi' ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setStudentLanguage('english')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                studentLanguage === 'english' ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
          </div>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=Advaitinsights1927@gmail.com&su=Advait%20Insights%20Math%20Doubt"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            title="Email directly to Harsh Sir"
          >
            <span>✉️</span>
            <span>Advaitinsights1927@gmail.com</span>
          </a>

          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            >
              &larr; Back
            </button>
          )}
        </div>
      </div>

      {/* Quick Problem Starters Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2.5 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-mono text-slate-400 shrink-0 font-bold">⚡ Quick Doubts:</span>
        {QUICK_MATH_PROMPTS[grade].map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.text)}
            className="px-3 py-1 bg-slate-800/90 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 border border-slate-700/70 hover:border-sky-500/50 rounded-full whitespace-nowrap transition-all text-xs"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[58vh]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400 flex items-center justify-center shrink-0 text-sm">
                🤖
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 shadow-md text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-slate-800/60 text-[11px] font-mono">
                <span className={m.role === 'user' ? 'text-sky-200' : 'text-sky-400 font-bold'}>
                  {m.role === 'user' ? 'You (Student)' : 'AI Guru Math Mentor'}
                </span>
                <span className={m.role === 'user' ? 'text-sky-200/70' : 'text-slate-400'}>
                  {m.timestamp}
                </span>
              </div>

              {/* Message Body */}
              <div className="whitespace-pre-line text-xs sm:text-sm font-sans">{m.text}</div>

              {/* Assistant Message Actions (Speech, Copy & Direct Email to Harsh Sir) */}
              {m.role === 'assistant' && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => speakText(m.text)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors text-[11px] cursor-pointer"
                    >
                      <span>{isSpeaking ? '⏹️ Stop Audio' : '🔊 Listen Solution'}</span>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(m.text);
                        setEmailStatus('Copied solution to clipboard! ✓');
                        setTimeout(() => setEmailStatus(null), 3000);
                      }}
                      className="text-slate-400 hover:text-sky-300 flex items-center gap-1 transition-colors text-[11px] cursor-pointer"
                    >
                      <span>📋 Copy Steps</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {m.gmailComposeUrl && (
                      <a
                        href={m.gmailComposeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                        title="Forward this question and solution to Harsh Sir"
                      >
                        <span>✉️ Send to Harsh Sir (Advaitinsights1927@gmail.com)</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-sm">
                🎓
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400 flex items-center justify-center shrink-0">
              🤖
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-sky-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span>AI Guru is computing step-by-step mathematical derivation...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="bg-slate-900 border-t border-slate-800 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your Math doubt here... (e.g. 'Prove √5 is irrational' or 'Solve 2x² - 5x + 3 = 0')"
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-sm"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Ask Guru</span>
            <span>&rarr;</span>
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
          <span>All doubts are recorded and sent to <strong>Advaitinsights1927@gmail.com</strong></span>
          <span className="hidden sm:inline font-mono">Bilingual NCERT Math Solver</span>
        </div>
      </div>
    </div>
  );
};
