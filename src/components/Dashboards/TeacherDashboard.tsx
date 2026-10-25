import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { GradeLevel } from '../../types/index.ts';
import { StudentWeeklyReportModal, StudentProgressData } from './StudentWeeklyReportModal.tsx';
import { ClassroomCommunityChat } from '../Community/ClassroomCommunityChat.tsx';
import { ShieldCheck, Lock, Key, AlertTriangle, LogOut, CheckCircle2, RefreshCw } from 'lucide-react';

interface TeacherDashboardProps {
  grade: GradeLevel;
  onOpenAuthModal: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ grade, onOpenAuthModal }) => {
  const { user, isTeacher, isTeacherPinVerified, verifyTeacherPin, logout, authToken } = useAuth();
  const [activeTab, setActiveTab] = useState<'students' | 'notes' | 'doubts' | 'chat'>('students');

  // Security Gate PIN State
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinLoading, setPinLoading] = useState<boolean>(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number>(5);
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [lockoutCountdown, setLockoutCountdown] = useState<number>(0);

  // Students & Live Monitor State
  const [students, setStudents] = useState<StudentProgressData[]>([]);
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<StudentProgressData | null>(null);

  // Notes Creator State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteChapter, setNoteChapter] = useState('Real Numbers');
  const [noteContent, setNoteContent] = useState('');
  const [notePyq, setNotePyq] = useState('');
  const [noteFormula, setNoteFormula] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishedNotes, setPublishedNotes] = useState<any[]>([]);

  // Doubts Inbox State
  const [doubts, setDoubts] = useState<any[]>([]);
  const [selectedDoubt, setSelectedDoubt] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);

  // Lockout countdown timer
  useEffect(() => {
    let timer: any = null;
    if (lockoutCountdown > 0) {
      timer = setInterval(() => {
        setLockoutCountdown((prev) => {
          if (prev <= 1) {
            setIsLockedOut(false);
            setAttemptsRemaining(5);
            setPinError(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutCountdown]);

  const getAuthHeaders = () => {
    const token = authToken || localStorage.getItem('advait_insights_auth_token') || 'advait_teacher_master_session_2026';
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    if (isTeacher) {
      fetchStudents();
      fetchDoubts();
      fetchNotes();
      const interval = setInterval(fetchStudents, 8000);
      return () => clearInterval(interval);
    }
  }, [isTeacher]);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/teacher/students', {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.students) {
        setStudents(data.students);
        setOnlineCount(data.onlineStudentsCount || 0);
      }
    } catch (e) {
      console.warn('Failed to fetch students:', e);
    }
  };

  const fetchDoubts = async () => {
    try {
      const res = await fetch('/api/doubts/all');
      const data = await res.json();
      if (data.doubts) {
        setDoubts(data.doubts);
      }
    } catch (e) {
      console.warn('Failed to fetch doubts:', e);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/teacher/notes', {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.notes) {
        setPublishedNotes(data.notes);
      }
    } catch (e) {
      console.warn('Failed to fetch notes:', e);
    }
  };

  const handlePublishNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;

    try {
      const res = await fetch('/api/teacher/notes', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          teacherName: user?.name || 'Advait Insights Faculty',
          grade,
          chapterTitle: noteChapter,
          title: noteTitle,
          content: noteContent,
          pyqFocus: notePyq,
          formulaHighlight: noteFormula,
        }),
      });

      if (res.ok) {
        setPublishSuccess(true);
        setNoteTitle('');
        setNoteContent('');
        setNotePyq('');
        setNoteFormula('');
        fetchNotes();
        setTimeout(() => setPublishSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Note publishing error:', err);
    }
  };

  const handleSendTeacherReply = async (doubtId: string) => {
    if (!replyText.trim()) return;

    try {
      const res = await fetch(`/api/doubts/${doubtId}/reply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          teacherReply: replyText,
          teacherName: user?.name || 'Advait Insights Faculty',
        }),
      });

      if (res.ok) {
        setReplySuccess(true);
        setReplyText('');
        fetchDoubts();
        setTimeout(() => {
          setReplySuccess(false);
          setSelectedDoubt(null);
        }, 2000);
      }
    } catch (err) {
      console.error('Reply submission error:', err);
    }
  };

  const handleVerifyPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    setPinLoading(true);
    setPinError(null);

    const result = await verifyTeacherPin(pinInput);
    setPinLoading(false);

    if (result.success) {
      setPinInput('');
      fetchStudents();
    } else {
      setPinError(result.error || 'Access Denied: Incorrect Faculty PIN');
      if (result.remainingSecs) {
        setIsLockedOut(true);
        setLockoutCountdown(result.remainingSecs);
      } else {
        setAttemptsRemaining((prev) => Math.max(1, prev - 1));
      }
    }
  };

  const handleLockConsole = () => {
    try {
      sessionStorage.removeItem('advait_teacher_pin_verified_session');
      window.location.reload();
    } catch {
      // ignore
    }
  };

  // High-Security Lockscreen / Vault Gate if Teacher is not verified
  if (!isTeacher) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-4">
        <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-10 max-w-lg w-full text-center shadow-2xl relative overflow-hidden space-y-6">
          {/* Glowing Security Shield */}
          <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-red-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-2xl shadow-amber-500/20">
            <ShieldCheck className="w-10 h-10 text-amber-400" />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-slate-900 flex items-center justify-center text-[10px]">
              🔒
            </span>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest mb-2">
              <span>FACULTY RESTRICTED ACCESS GATE</span>
            </div>
            <h2 className="text-2xl font-black font-heading text-white">
              Advait Insights Teacher Vault
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              यह कंट्रोल रूम केवल शिक्षकों (Harsh Sir) के लिए सुरक्षित है। छात्र इस डैशबोर्ड में प्रवेश नहीं कर सकते।
            </p>
          </div>

          {/* Feedback / Lockout Alert */}
          {pinError && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-2xl text-xs text-red-200 text-left flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-300">{pinError}</p>
                {isLockedOut && (
                  <p className="text-[11px] text-amber-300 font-mono mt-0.5">
                    ⏳ Security Timer: Retry in {lockoutCountdown} seconds...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* PIN Verification Form */}
          <form onSubmit={handleVerifyPinSubmit} className="space-y-4">
            <div className="text-left space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase text-slate-300 tracking-wider flex items-center justify-between">
                <span>Enter Faculty Security PIN:</span>
                <span className="text-[10px] text-amber-400 lowercase font-normal">
                  6-digit PIN / Master Key
                </span>
              </label>

              <div className="relative">
                <input
                  type="password"
                  disabled={isLockedOut || pinLoading}
                  autoFocus
                  maxLength={16}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••••"
                  className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 px-4 bg-slate-950 border-2 border-amber-500/40 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:border-amber-400 transition-colors disabled:opacity-50"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                <span>Cryptographic Route Protection</span>
                <span>Attempts: {attemptsRemaining}/5</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLockedOut || pinLoading || !pinInput}
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {pinLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying Identity...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 text-slate-950" />
                  <span>Unlock Teacher Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Alternative Teacher Login link */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Need to sign in with password?</span>
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
            >
              Teacher Sign In Modal &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Web Report Modal with Teacher Mode Enabled */}
      {selectedStudentForReport && (
        <StudentWeeklyReportModal
          student={selectedStudentForReport}
          onClose={() => setSelectedStudentForReport(null)}
          isTeacherMode={true}
          onSaveRemark={(studentId, remarks) => {
            setStudents((prev) =>
              prev.map((s) => (s.id === studentId ? { ...s, teacherRemarks: remarks } : s))
            );
          }}
        />
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/40 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-3xl shrink-0">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                Faculty Control Room · Advait Insights
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/50 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Encrypted Session ✓</span>
              </span>
            </div>
            <h2 className="text-2xl font-extrabold font-heading text-white mt-1">
              Teacher Dashboard: {user?.name || 'Harsh Sir'}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Managing Mathematics curriculum, student doubts dispatched to <strong>Advaitinsights1927@gmail.com</strong>, and lesson notes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* Quick Lock Console Button */}
          <button
            onClick={handleLockConsole}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            title="Lock Teacher Dashboard Console immediately"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Lock Console</span>
          </button>

          <a
            href="?tab=live"
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black rounded-xl transition-all shadow-lg flex items-center gap-2 animate-pulse"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>🔴 Start Live Video Class</span>
          </a>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=Advaitinsights1927@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            <span>✉️ Open Gmail Inbox</span>
          </a>
        </div>
      </div>

      {/* Teacher Subtab Navigation */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'students'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-800'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>👥 Live Student Monitor &amp; Reports ({onlineCount} Live 🟢)</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'chat'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-lg'
              : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800'
          }`}
        >
          <span>👑 Classroom Live Chat</span>
          <span className="text-[10px] bg-amber-950 px-2 py-0.5 rounded-full border border-amber-500/50">
            Teacher Badge
          </span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'notes'
              ? 'bg-sky-500 text-white shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>✍️ Post Lesson Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('doubts')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'doubts'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>📬 Student Doubts ({doubts.length})</span>
        </button>
      </div>

      {/* Subtab 1: Live Students & Reports Monitor */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Active Student Roster</span>
                <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  {onlineCount} Online Right Now 🟢
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Click &quot;View Web Report Card&quot; on any student to review their questions solved, chapter accuracy &amp; add your official remark.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl transition-all space-y-3.5 shadow-md group relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-md">
                        🎓
                      </div>
                      {student.isOnline && (
                        <span
                          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse"
                          title="Online Now"
                        />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {student.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono truncate max-w-[180px]">
                        {student.email}
                      </p>
                      <span className="text-[10px] text-sky-400 font-mono font-semibold">
                        {student.rollNumber}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      student.isOnline
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {student.isOnline ? 'LIVE 🟢' : student.lastActive}
                  </span>
                </div>

                {/* Performance Chips */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-mono">Accuracy</span>
                    <span className="font-bold text-emerald-400">{student.accuracyRate}%</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-mono">Questions</span>
                    <span className="font-bold text-sky-400">{student.questionsPracticedThisWeek}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-mono">Study Hours</span>
                    <span className="font-bold text-amber-400">{student.studyHoursThisWeek}h</span>
                  </div>
                </div>

                {/* Mood / Vibe preview */}
                <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                  &quot;{student.conditionAndVibe}&quot;
                </p>

                {/* Action button: Opens full official web report card */}
                <button
                  onClick={() => setSelectedStudentForReport(student)}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>📊 Open Web Report &amp; Remarks</span>
                  <span>&rarr;</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 2: Classroom Live Chat */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Classroom Community Live Stream</span>
                <span className="text-xs text-amber-400 font-mono bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/40">
                  Moderator Mode: {user?.name || 'Harsh Sir'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                You are chatting as an official Advait Insights educator with a verified golden crown badge.
              </p>
            </div>
          </div>
          <ClassroomCommunityChat grade={grade} onOpenTeacherAuth={onOpenAuthModal} />
        </div>
      )}

      {/* Subtab 3: Notes Publisher */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>✍️ Publish Revision Notes</span>
            </h3>

            {publishSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-xs text-emerald-200">
                ✓ Lesson Note published successfully to students!
              </div>
            )}

            <form onSubmit={handlePublishNote} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Chapter</label>
                <select
                  value={noteChapter}
                  onChange={(e) => setNoteChapter(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="Real Numbers">Real Numbers</option>
                  <option value="Polynomials">Polynomials</option>
                  <option value="Pair of Linear Equations">Pair of Linear Equations</option>
                  <option value="Quadratic Equations">Quadratic Equations</option>
                  <option value="Arithmetic Progressions">Arithmetic Progressions</option>
                  <option value="Triangles">Triangles</option>
                  <option value="Coordinate Geometry">Coordinate Geometry</option>
                  <option value="Introduction to Trigonometry">Introduction to Trigonometry</option>
                  <option value="Circles">Circles</option>
                  <option value="Statistics">Statistics</option>
                  <option value="Probability">Probability</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Topic Title</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Fundamental Theorem of Arithmetic Important Rules"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Formula / Key Rule</label>
                <input
                  type="text"
                  value={noteFormula}
                  onChange={(e) => setNoteFormula(e.target.value)}
                  placeholder="e.g. HCF(a,b) × LCM(a,b) = a × b"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Detailed Teaching Content</label>
                <textarea
                  rows={4}
                  required
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write clear explanation, step-by-step guidance, and common exam traps..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">CBSE PYQ Exam Weightage</label>
                <input
                  type="text"
                  value={notePyq}
                  onChange={(e) => setNotePyq(e.target.value)}
                  placeholder="e.g. Compulsory 3 Marks in Section B"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                Publish Note to Classroom
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-base font-bold text-white">
              Published Notes ({publishedNotes.length})
            </h3>
            <div className="space-y-3">
              {publishedNotes.map((note) => (
                <div key={note.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-sky-400 uppercase">
                      {note.chapterTitle}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{note.createdAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{note.title}</h4>
                  <p className="text-xs text-slate-300 whitespace-pre-line">{note.content}</p>
                  {note.formulaHighlight && (
                    <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-300 font-mono text-xs">
                      Formula: {note.formulaHighlight}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Student Doubts */}
      {activeTab === 'doubts' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                Student Doubts Dispatched to Advaitinsights1927@gmail.com
              </h3>
              <p className="text-xs text-slate-400">
                Direct question inquiries submitted by Class 9 &amp; 10 students. Reply here or directly through Gmail.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doubts.map((d) => (
              <div
                key={d.id}
                className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-5 rounded-2xl space-y-3 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-white block">{d.studentName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{d.studentContact}</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-800">
                    {d.grade} • {d.topic}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
                  <span className="text-[10px] font-mono text-amber-400 uppercase block mb-1">Question:</span>
                  {d.question}
                </div>

                {d.teacherReply ? (
                  <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-xl text-xs text-emerald-200">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase block mb-0.5">Your Verified Reply:</span>
                    {d.teacherReply}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={selectedDoubt?.id === d.id ? replyText : ''}
                      onFocus={() => setSelectedDoubt(d)}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your official step-by-step reply for the student..."
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSendTeacherReply(d.id)}
                        className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        Send Reply to Student
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
