import React, { useState, useEffect } from 'react';
import { GradeLevel } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';

interface HardestQuestionVaultProps {
  grade: GradeLevel;
  onAskAIGuruWithQuestion?: (questionText: string) => void;
}

export const HardestQuestionVault: React.FC<HardestQuestionVaultProps> = ({
  grade,
  onAskAIGuruWithQuestion,
}) => {
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [answerInput, setAnswerInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // 15-Minute Exam Timer
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    fetchChallenge();
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsLeft]);

  const fetchChallenge = async () => {
    try {
      const res = await fetch('/api/challenges/hardest-question');
      const data = await res.json();
      if (data.challenge) {
        setChallenge(data.challenge);
      }
    } catch (e) {
      console.warn('Failed to fetch challenge:', e);
    }
  };

  const handleSubmitAttempt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/challenges/submit-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: user?.name || 'Advait Student',
          studentContact: user?.emailOrPhone || 'Web Portal',
          answerText: answerInput,
          grade,
        }),
      });

      const data = await res.json();
      setSubmitSuccess(data.message || 'Solution submitted to Harsh Sir!');
      setShowSolution(true);
    } catch (err: any) {
      setSubmitSuccess('Submitted to Harsh Sir at Advaitinsights1927@gmail.com!');
      setShowSolution(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  if (!challenge) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
        Loading Weekly Hardest Question Challenge...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-900/40 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-3xl shrink-0">
            🔥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-red-400 font-bold">
                The Hardest Question Vault · HOTS Challenge
              </span>
              <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded-full font-mono">
                {challenge.marks} Marks Board Level
              </span>
            </div>
            <h2 className="text-2xl font-extrabold font-heading text-white mt-1">
              Weekly Board Exam Master Challenge
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Test your deep mathematical thinking against the week&apos;s toughest NCERT Exemplar &amp; CBSE board problem. Solutions are reviewed by Harsh Sir.
            </p>
          </div>
        </div>

        {/* Timer Box */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center gap-4 shrink-0 shadow-inner">
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Exam Clock</span>
            <span className={`text-2xl font-bold font-mono ${secondsLeft < 180 ? 'text-red-400 animate-pulse' : 'text-sky-400'}`}>
              {formatTime(secondsLeft)}
            </span>
          </div>
          <button
            onClick={() => setTimerRunning(!timerRunning)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              timerRunning ? 'bg-amber-500 text-slate-950' : 'bg-sky-500 text-white'
            }`}
          >
            {timerRunning ? 'Pause ⏸' : 'Start Timer ▶'}
          </button>
        </div>
      </div>

      {/* Main Challenge Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-3">
          <span className="text-sky-400 font-bold">{challenge.chapter}</span>
          <span className="text-slate-400">{challenge.submittedAttempts} Advaitians Attempted</span>
        </div>

        {/* Question Text */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-base font-semibold text-white leading-relaxed">
          {challenge.question}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg transition-colors font-semibold"
            >
              {showHint ? 'Hide Hint ▲' : '💡 Need a Hint? ▼'}
            </button>

            {onAskAIGuruWithQuestion && (
              <button
                onClick={() => onAskAIGuruWithQuestion(challenge.question)}
                className="px-3.5 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 rounded-lg transition-colors font-semibold"
              >
                🤖 Ask AI Guru
              </button>
            )}
          </div>

          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=Advaitinsights1927@gmail.com&su=HOTS%20Challenge%20Solution&body=${encodeURIComponent(`Hello Harsh Sir,\n\nHere is my solution for the Weekly HOTS Challenge:\n\n`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg transition-colors font-semibold"
          >
            ✉️ Email Harsh Sir Directly
          </a>
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="p-4 bg-amber-950/30 border border-amber-800/50 rounded-xl text-xs text-amber-200 leading-relaxed animate-fade-in">
            <strong className="block text-amber-300 mb-1">Teacher&apos;s Hint from Harsh Sir:</strong>
            {challenge.hint}
          </div>
        )}

        {/* Submit Solution Form */}
        <form onSubmit={handleSubmitAttempt} className="space-y-3 pt-4 border-t border-slate-800">
          <label className="block text-xs font-bold text-slate-300">
            Write or Outline Your Mathematical Proof / Solution:
          </label>
          <textarea
            required
            rows={4}
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            placeholder="Type your derivation steps here (e.g., Step 1: Let P be aeroplane height h km... In right triangle PQA...)"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-xs font-mono leading-relaxed"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Submitting to Harsh Sir...</span>
            ) : (
              <span>Submit Solution to Harsh Sir (Advaitinsights1927@gmail.com) &amp; Unlock Model Answer</span>
            )}
          </button>
        </form>

        {/* Success Alert & Model Solution */}
        {submitSuccess && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-200 font-medium">
            ✓ {submitSuccess}
          </div>
        )}

        {showSolution && (
          <div className="p-5 bg-slate-950 border border-emerald-500/50 rounded-xl space-y-3 text-xs leading-relaxed animate-fade-in">
            <div className="flex items-center justify-between text-emerald-400 font-bold font-mono">
              <span>CBSE 5-Mark Official Model Proof</span>
              <span>Full Score Criteria</span>
            </div>
            <p className="whitespace-pre-line text-slate-200 font-mono text-[11px]">
              {challenge.modelSolution}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
