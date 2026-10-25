import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { GradeLevel } from '../types/index.ts';
import { AdvaitLogo } from './AdvaitLogo.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'student' | 'teacher';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultRole = 'student' }) => {
  const { login, loginWithGoogle } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<'student' | 'teacher'>(defaultRole);

  // Form Fields
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState<GradeLevel>('class10');
  const [rollNumberOrSection, setRollNumberOrSection] = useState('');
  const [secretCode, setSecretCode] = useState('');

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const userProfile = await loginWithGoogle();
      setSuccessMsg(`Welcome, ${userProfile.name}! Firebase Google Sign-In successful. (+25 Advait Coins)`);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Google Sign-In was cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload: any = {
        emailOrPhone,
        password,
        role,
      };

      if (isRegister) {
        payload.name = name;
        payload.grade = grade;
        payload.rollNumberOrSection = rollNumberOrSection;
        if (role === 'teacher') {
          payload.secretCode = secretCode;
          payload.subjectSpecialty = 'Mathematics (Class 9 & 10)';
        }
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setSuccessMsg(data.message || 'Success!');
      login(data.user, data.token);
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
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
    setSuccessMsg('Welcome, Guest Advaitian! Full access granted.');
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="flex justify-center mb-2">
            <AdvaitLogo size={48} />
          </div>
          <h3 className="text-xl font-bold font-heading text-white">
            Advait Insights Portal
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Choose how you want to enter the Mathematics Classroom
          </p>
        </div>

        {/* 3 Explicit Entry Options: Student, Teacher, Guest */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-2xl mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setRole('student');
              setError(null);
            }}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
              role === 'student'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-sm">🎓</span>
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('teacher');
              setError(null);
            }}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
              role === 'teacher'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-sm">👑</span>
            <span>Teacher</span>
          </button>

          <button
            type="button"
            onClick={handleContinueAsGuest}
            className="py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 text-emerald-400 hover:bg-emerald-950/40 border border-emerald-900/40"
          >
            <span className="text-sm">⚡</span>
            <span>As Guest</span>
          </button>
        </div>

        {/* 1-Click Firebase Google Sign-In */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-extrabold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2.5 border border-slate-200 cursor-pointer active:scale-98 disabled:opacity-50 text-xs"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google (Firebase Auth)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">+25 🪙</span>
          </button>

          <div className="flex items-center gap-2 my-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Or With Password</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>
        </div>

        {/* Register vs Login Switcher */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800 text-xs">
          <span className="text-slate-300 font-semibold">
            {role === 'teacher' ? '👑 Faculty Access' : '🎓 Student Access'}:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError(null);
              }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                !isRegister ? 'bg-slate-800 text-white font-bold border border-slate-700' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError(null);
              }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                isRegister ? 'bg-slate-800 text-white font-bold border border-slate-700' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-200">
            <p className="font-semibold">⚠️ {error}</p>
            {role === 'teacher' && isRegister && (
              <p className="text-[11px] text-red-300 mt-1">
                🔒 Teacher access is restricted. Official verification code is required from school administrator.
              </p>
            )}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-200 font-medium">
            ✓ {successMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {isRegister && (
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'teacher' ? 'e.g. Harsh Tiwary Sir' : 'e.g. Aditya Kumar'}
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 mb-1 font-medium">
              Email or Phone Number
            </label>
            <input
              type="text"
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="e.g. Advaitinsights1927@gmail.com"
              className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {isRegister && role === 'student' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Academic Grade</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as GradeLevel)}
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="class10">Class 10</option>
                  <option value="class9">Class 9</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Roll No / Section</label>
                <input
                  type="text"
                  value={rollNumberOrSection}
                  onChange={(e) => setRollNumberOrSection(e.target.value)}
                  placeholder="Roll 14 (Sec A)"
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}

          {/* Teacher Mandatory Secret Code Field */}
          {role === 'teacher' && (
            <div className="bg-amber-950/30 border border-amber-900/60 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-amber-300">
                  🔑 Secret Teacher Code (Mandatory)
                </label>
                <span className="text-[10px] text-amber-400 font-mono">Faculty Access</span>
              </div>
              <input
                type="password"
                required={isRegister}
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                placeholder="Enter secret code (TEACH_ADVAIT_2026)"
                className="w-full px-3 py-2 bg-slate-950 border border-amber-800/80 rounded-lg text-amber-100 placeholder-amber-800/80 focus:outline-none focus:border-amber-400 font-mono"
              />
              <p className="text-[10px] text-amber-300/80">
                Teacher Verification Key: <span className="font-mono font-bold text-amber-300">TEACH_ADVAIT_2026</span>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
              role === 'teacher'
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-sky-500 hover:bg-sky-400 text-white'
            }`}
          >
            {loading ? (
              <span>Verifying...</span>
            ) : isRegister ? (
              <span>Create {role === 'teacher' ? 'Faculty' : 'Student'} Account</span>
            ) : (
              <span>Sign In as {role === 'teacher' ? 'Teacher' : 'Student'}</span>
            )}
          </button>
        </form>

        {/* Continue as Guest Button at bottom */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={handleContinueAsGuest}
            className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span>⚡ Skip password &amp; Continue as Guest</span>
          </button>
        </div>
      </div>
    </div>
  );
};
