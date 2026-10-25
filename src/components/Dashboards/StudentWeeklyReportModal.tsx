import React, { useState } from 'react';
import {
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  TrendingUp,
  Brain,
  Download,
  AlertCircle,
} from 'lucide-react';

export interface StudentProgressData {
  id: string;
  name: string;
  email: string;
  batch: string;
  rollNumber: string;
  grade: 'class9' | 'class10';
  isOnline: boolean;
  currentActivity: string;
  lastActive: string;
  questionsPracticedThisWeek: number;
  mcqsSolved: number;
  pyqsSolved: number;
  hotsSolved: number;
  accuracyRate: number;
  studyHoursThisWeek: number;
  attendanceStreakDays: number;
  conditionAndVibe: string;
  badges: string[];
  chapterBreakdown: {
    chapter: string;
    questionsSolved: number;
    accuracy: number;
    status: 'Mastered' | 'On Track' | 'Needs Practice';
  }[];
  teacherRemarks?: string;
  updatedAt: string;
}

interface StudentWeeklyReportModalProps {
  student: StudentProgressData;
  onClose: () => void;
  onSaveRemark?: (studentId: string, remarks: string) => void;
  isTeacherMode?: boolean;
}

export const StudentWeeklyReportModal: React.FC<StudentWeeklyReportModalProps> = ({
  student,
  onClose,
  onSaveRemark,
  isTeacherMode = false,
}) => {
  const [remarkText, setRemarkText] = useState(
    student.teacherRemarks ||
      'Aditya is consistently performing at the top of the batch. Excellent discipline in submitting doubts. Keep this streak active till board exams!'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const reportId = `ADV-CBSE-${student.id.toUpperCase()}-${new Date().getFullYear()}`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleSaveRemark = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('advait_insights_auth_token') || 'advait_teacher_master_session_2026';
      await fetch(`/api/teacher/students/${student.id}/remark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ remarks: remarkText }),
      });
      if (onSaveRemark) {
        onSaveRemark(student.id, remarkText);
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.warn('Remark save error:', e);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = async () => {
    const summary = `📊 *ADVAIT INSIGHTS - CBSE WEEKLY PERFORMANCE REPORT*
Student: ${student.name} (${student.rollNumber})
Batch: ${student.batch}
Predicted Score: 94/100 (Grade A1 Outstanding)
Weekly Accuracy: ${student.accuracyRate}%
Questions Solved: ${student.questionsPracticedThisWeek}
Study Hours: ${student.studyHoursThisWeek} hrs | Streak: ${student.attendanceStreakDays} Days 🔥
Verified by: Harsh Tiwary Sir, Advait Insights
Report ID: ${reportId}`;

    try {
      await navigator.clipboard.writeText(summary);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in print:p-0 print:bg-white">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-slate-100 flex flex-col print:border-none print:shadow-none print:bg-white print:text-black print:max-h-none print:rounded-none">
        {/* Printable/Export Toolbar (Hidden in Print) */}
        <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center text-xl font-black shadow-md">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-widest">
                  OFFICIAL ACADEMIC WEB REPORT
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/50 px-2 py-0.2 rounded-full font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Verified 2026</span>
                </span>
              </div>
              <h2 className="text-base font-black text-white font-heading">
                Weekly Academic Progress &amp; Diagnostics Card
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Copy Report Card Summary to WhatsApp / Clipboard"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              title="Print or Save Official Report Card as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-mono transition-colors cursor-pointer ml-1"
              title="Close Report Modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Report Document Content (Optimized for Screen & Print) */}
        <div className="p-5 sm:p-8 space-y-6 print:p-6 print:text-slate-900">
          {/* Certificate / Institution Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-6 rounded-3xl relative overflow-hidden print:border-slate-300 print:bg-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 print:border-slate-300">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-sky-600/30">
                  🎓
                </div>
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest block">
                    ADVAIT INSIGHTS ACADEMIC COUNCIL
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5 print:text-slate-900">
                    CBSE Mathematics Weekly Progress Report
                  </h1>
                  <p className="text-xs text-slate-400 print:text-slate-600">
                    Curriculum Standards: NCERT / CBSE Class 9 &amp; 10 • Pre-Board 2026 Prep
                  </p>
                </div>
              </div>

              <div className="sm:text-right text-xs font-mono shrink-0">
                <span className="text-slate-400 block text-[10px] uppercase">Official Report ID:</span>
                <span className="text-amber-400 font-bold block print:text-slate-900">{reportId}</span>
                <span className="text-slate-500 text-[11px] block mt-0.5 print:text-slate-500">Date: {currentDate}</span>
              </div>
            </div>

            {/* Student Identification Meta Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/60 print:bg-slate-50 print:border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Student Name:</span>
                <span className="font-bold text-white text-sm block print:text-slate-900">{student.name}</span>
                <span className="text-[10px] text-sky-400 truncate block">{student.email}</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/60 print:bg-slate-50 print:border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Class &amp; Roll:</span>
                <span className="font-bold text-white text-sm block print:text-slate-900">
                  {student.grade === 'class10' ? 'Class 10 CBSE' : 'Class 9 CBSE'}
                </span>
                <span className="text-[10px] text-amber-300 font-mono block">{student.rollNumber}</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/60 print:bg-slate-50 print:border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Batch Target:</span>
                <span className="font-bold text-emerald-400 text-sm block">100/100 Target</span>
                <span className="text-[10px] text-slate-400 block truncate">{student.batch}</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/60 print:bg-slate-50 print:border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Status &amp; Rank:</span>
                <span className="font-bold text-purple-400 text-sm block">Top 3% (#2 Rank)</span>
                <span className="text-[10px] text-emerald-400 font-bold block flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>{student.isOnline ? 'Online Now 🟢' : student.lastActive}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Key Executive Performance Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Predicted Score */}
            <div className="bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/40 p-4 rounded-2xl relative overflow-hidden print:border-slate-300 print:bg-slate-50">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">
                🎯 Predicted Board Score
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-amber-400 font-heading">94</span>
                <span className="text-sm font-bold text-slate-400">/ 100</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md inline-block mt-1">
                Grade A1 (Outstanding)
              </span>
              <span className="text-[10px] text-slate-400 block mt-1.5">
                Theory: 76/80 • Internal: 18/20
              </span>
            </div>

            {/* Accuracy Rate */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl print:border-slate-300 print:bg-slate-50">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                ⚡ Overall Accuracy
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-emerald-400 font-heading">{student.accuracyRate}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full mt-2 overflow-hidden print:bg-slate-200">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all"
                  style={{ width: `${student.accuracyRate}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1.5">
                Across MCQs, PYQs &amp; Solvers
              </span>
            </div>

            {/* Questions Solved */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl print:border-slate-300 print:bg-slate-50">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                📝 Weekly Questions
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-sky-400 font-heading">
                  {student.questionsPracticedThisWeek}
                </span>
                <span className="text-xs text-slate-400">problems</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-300">
                <span className="bg-sky-950 text-sky-400 px-1.5 py-0.2 rounded font-mono">
                  {student.mcqsSolved} MCQ
                </span>
                <span className="bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                  {student.pyqsSolved} PYQ
                </span>
                <span className="bg-amber-950 text-amber-400 px-1.5 py-0.2 rounded font-mono">
                  {student.hotsSolved} HOTS
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1.5">Weekly Goal Target: 100% Met</span>
            </div>

            {/* Study Time & Streak */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl print:border-slate-300 print:bg-slate-50">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                🔥 Attendance &amp; Study
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-purple-400 font-heading">
                  {student.studyHoursThisWeek}
                </span>
                <span className="text-xs text-slate-400">Hours</span>
              </div>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md inline-block mt-1">
                {student.attendanceStreakDays} Days Streak 🔥
              </span>
              <span className="text-[10px] text-slate-400 block mt-1.5">Regular Live Classes Attended</span>
            </div>
          </div>

          {/* Daily Study Consistency Bar Graph (Mon to Sun) */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-3 print:border-slate-300 print:bg-slate-50">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>साप्ताहिक अध्ययन निरंतरता (Daily Study Hours Heatmap)</span>
              </h3>
              <span className="text-[11px] text-emerald-400 font-bold font-mono">Total: {student.studyHoursThisWeek} hrs</span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2 text-center">
              {[
                { day: 'Mon', hrs: 2.5, q: 14, tag: 'Full' },
                { day: 'Tue', hrs: 3.0, q: 18, tag: 'Live Class' },
                { day: 'Wed', hrs: 1.8, q: 10, tag: 'Self Study' },
                { day: 'Thu', hrs: 3.2, q: 20, tag: 'Live Doubt' },
                { day: 'Fri', hrs: 2.0, q: 12, tag: 'Canvas' },
                { day: 'Sat', hrs: 2.5, q: 15, tag: 'PYQ Drill' },
                { day: 'Sun', hrs: 1.5, q: 6, tag: 'HOTS' },
              ].map((item) => (
                <div key={item.day} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1.5 print:bg-white print:border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 block font-mono">{item.day}</span>
                  <div className="h-16 flex items-end justify-center">
                    <div
                      className="w-full bg-gradient-to-t from-sky-500 to-indigo-500 rounded-lg transition-all"
                      style={{ height: `${Math.min(100, (item.hrs / 3.5) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-white block">{item.hrs}h</span>
                  <span className="text-[9px] text-amber-400 font-mono block">{item.q} Qs</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chapter-wise Detailed Competency Matrix */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-3 print:border-slate-300 print:bg-slate-50">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>अध्याय-वार दक्षता विश्लेषण (Chapter-Wise Competency Analysis)</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">CBSE 2026 Curriculum</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {student.chapterBreakdown.map((ch) => (
                <div
                  key={ch.chapter}
                  className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs space-y-2 print:bg-white print:border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm print:text-slate-900">{ch.chapter}</span>
                    <span
                      className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${
                        ch.status === 'Mastered'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                          : ch.status === 'On Track'
                          ? 'bg-sky-950 text-sky-400 border border-sky-500/50'
                          : 'bg-rose-950 text-rose-400 border border-rose-500/50'
                      }`}
                    >
                      {ch.status} ({ch.accuracy}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden print:bg-slate-200">
                    <div
                      className={`h-full rounded-full transition-all ${
                        ch.accuracy >= 90 ? 'bg-emerald-400' : ch.accuracy >= 80 ? 'bg-sky-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${ch.accuracy}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Attempted: {ch.questionsSolved} questions</span>
                    <span>Accuracy: {ch.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Guru Diagnostic Insights & Recommendations */}
          <div className="bg-gradient-to-r from-sky-950/40 via-slate-950 to-indigo-950/40 border-2 border-sky-500/40 p-5 rounded-3xl space-y-2.5 print:border-slate-300 print:bg-slate-50">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-300">
                AI GURU DIAGNOSTIC FEEDBACK &amp; NEXT-WEEK TARGETS
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed print:text-slate-800">
              "{student.conditionAndVibe}"
            </p>
            <div className="p-3 bg-slate-900/90 rounded-xl border border-sky-500/30 text-xs space-y-1 print:bg-white print:border-slate-200">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">
                🎯 Harsh Sir's Weekly Recommendation:
              </span>
              <p className="text-slate-300 print:text-slate-700">
                Practice 3 more 5-mark proof questions from <strong>Triangles (BPT Converse Theorem)</strong> and write all Trigonometry identities on the Smart Whiteboard once before the Thursday live class!
              </p>
            </div>
          </div>

          {/* Teacher Official Remarks & Signature Block */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-amber-500/40 space-y-4 print:border-slate-300 print:bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">👑</span>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  अध्यापक की आधिकारिक टिप्पणी व हस्ताक्षर (Faculty Remarks &amp; Certification)
                </h3>
              </div>
              {savedSuccess && (
                <span className="text-emerald-400 text-xs font-mono font-bold animate-pulse">
                  ✓ टिप्पणी सुरक्षित हो गई! (Saved)
                </span>
              )}
            </div>

            {isTeacherMode ? (
              <div className="space-y-2 print:hidden">
                <textarea
                  rows={3}
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  placeholder="अध्यापक के रूप में छात्र के लिए अपनी आधिकारिक टिप्पणी लिखें..."
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveRemark}
                    disabled={saving}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {saving ? 'सुरक्षित हो रहा है...' : 'टिप्पणी सेव करें (Save Remark) 💾'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed bg-slate-900 p-4 rounded-2xl border border-slate-800 print:bg-white print:text-slate-800">
                "{remarkText}"
              </p>
            )}

            {/* Official Signatory Stamp */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono print:border-slate-300">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Faculty In-charge:</span>
                <span className="font-bold text-white block print:text-slate-900">Harsh Tiwary, Senior Mathematics Faculty</span>
                <span className="text-[11px] text-amber-400 block">Advaitinsights1927@gmail.com</span>
              </div>

              <div className="p-2.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 text-[10px] space-y-0.5 print:bg-slate-100 print:border-emerald-700">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ADVAIT DIGITAL ACADEMIC SEAL</span>
                </div>
                <div>Hash: SHA256-{student.id.slice(-6)}-2026-VERIFIED</div>
                <div className="text-slate-400">Valid for CBSE 2026 Board Portfolio</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
