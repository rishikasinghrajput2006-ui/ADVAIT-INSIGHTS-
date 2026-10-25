import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { GradeLevel } from '../../types/index.ts';
import { AchievementSystem } from './AchievementSystem.tsx';
import { StudentWeeklyReportModal, StudentProgressData } from './StudentWeeklyReportModal.tsx';
import { FileText, Printer, Award, TrendingUp, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface StudentDashboardProps {
  grade: GradeLevel;
  onNavigateTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ grade, onNavigateTab }) => {
  const { user, advaitCoins } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'report' | 'achievements'>('overview');
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Revise Real Numbers Fundamental Theorem of Arithmetic', done: true },
    { id: 2, text: 'Practice 5 Quadratic Equation discriminant problems', done: false },
    { id: 3, text: 'Draw Circle Tangent proof on Math Canvas', done: false },
    { id: 4, text: 'Attempt Weekly 5-Mark HOTS Challenge', done: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const completedCount = tasks.filter((t) => t.done).length;

  // Student's personalized academic data
  const currentStudentData: StudentProgressData = {
    id: user?.id || 'std-current',
    name: user?.name || 'Aditya Kumar',
    email: user?.emailOrPhone || 'aditya.student@advait.edu',
    batch: 'CBSE 2026 Mathematics Target 100/100',
    rollNumber: user?.rollNumberOrSection || 'Roll 14 · Section A',
    grade,
    isOnline: true,
    currentActivity: 'Active on Student Academic Headquarters',
    lastActive: 'Active Now (Live 🟢)',
    questionsPracticedThisWeek: 85,
    mcqsSolved: 42,
    pyqsSolved: 28,
    hotsSolved: 15,
    accuracyRate: 92,
    studyHoursThisWeek: 16.5,
    attendanceStreakDays: 7,
    conditionAndVibe: 'शानदार गति! बीजगणित और सांख्यिकी में बहुत मजबूत पकड़। सर्कल और त्रिभुज के प्रमेयों का अभ्यास जारी रखें।',
    badges: ['Top Ranker 🏆', 'Geometry Pro 📐', 'Josh Warrior 🔥', 'Board Ready 💯', 'Speed Solver ⚡'],
    chapterBreakdown: [
      { chapter: 'Real Numbers', questionsSolved: 16, accuracy: 96, status: 'Mastered' },
      { chapter: 'Polynomials', questionsSolved: 14, accuracy: 94, status: 'Mastered' },
      { chapter: 'Quadratic Equations', questionsSolved: 15, accuracy: 95, status: 'Mastered' },
      { chapter: 'Triangles', questionsSolved: 18, accuracy: 82, status: 'Needs Practice' },
      { chapter: 'Introduction to Trigonometry', questionsSolved: 12, accuracy: 91, status: 'On Track' },
      { chapter: 'Statistics', questionsSolved: 10, accuracy: 98, status: 'Mastered' },
    ],
    teacherRemarks: 'Aditya is consistently performing at the top of the batch. Excellent discipline in submitting doubts. Keep this streak active till board exams!',
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      {/* Student Web Report Modal */}
      {showReportModal && (
        <StudentWeeklyReportModal
          student={currentStudentData}
          onClose={() => setShowReportModal(false)}
          isTeacherMode={false}
        />
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-950/60 via-slate-900 to-slate-900 border border-sky-800/40 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400 flex items-center justify-center text-3xl shrink-0">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-sky-400 font-bold">
                Student Academic Headquarters
              </span>
              <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded-full font-mono">
                {user?.rollNumberOrSection || 'Section A · Roll 14'}
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/50 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Protected Account</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-1">
              Welcome back, {user?.name || 'Advait Student'}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Tracking your {grade === 'class10' ? 'Class 10 CBSE Board' : 'Class 9 Foundation'} Mathematics mastery and board preparation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* Quick Launch Weekly Web Report Modal Button */}
          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            title="Open Full Screen CBSE Weekly Academic Web Report Card"
          >
            <FileText className="w-4 h-4 text-slate-950" />
            <span>📊 Open Full Web Report Card</span>
          </button>

          <button
            onClick={() => onNavigateTab('ai-guru')}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <span>🤖 Ask AI Guru Doubt</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>

      {/* Prominent Golden Banner: Weekly Academic Web Report Card Showcase */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-sky-950/40 border-2 border-amber-500/40 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center text-2xl font-black shadow-md shrink-0">
            📑
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                Official CBSE Web Report Card Available
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.2 rounded-full font-mono">
                Predicted: 94/100 (A1)
              </span>
            </div>
            <h3 className="text-base font-black text-white font-heading mt-0.5">
              साप्ताहिक शैक्षणिक वेब रिपोर्ट कार्ड (Weekly Academic Progress Report)
            </h3>
            <p className="text-xs text-slate-300">
              85 questions solved this week • 92% overall accuracy • Verified by Harsh Tiwary Sir
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>View &amp; Print Report Card</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>

      {/* Subtab Toggle */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs font-bold w-fit flex-wrap">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'overview'
              ? 'bg-sky-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>🎯 Daily Quests &amp; Study Tasks</span>
        </button>

        <button
          onClick={() => setActiveSubTab('report')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'report'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'text-amber-400 hover:text-amber-300'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>📊 Weekly Performance Web Report</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>

        <button
          onClick={() => setActiveSubTab('achievements')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'achievements'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-md'
              : 'text-amber-400 hover:text-amber-300'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>🏆 Achievements &amp; Badges</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] font-mono text-slate-400 block uppercase">Daily Quest Progress</span>
          <p className="text-2xl font-bold font-heading text-white mt-1">
            {completedCount} / {tasks.length} <span className="text-xs font-normal text-slate-400">Completed</span>
          </p>
          <div className="w-full bg-slate-950 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-sky-400 h-full rounded-full transition-all"
              style={{ width: `${(completedCount / tasks.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] font-mono text-slate-400 block uppercase">Current Streak</span>
          <p className="text-2xl font-bold font-heading text-amber-400 mt-1">
            7 Days 🔥
          </p>
          <span className="text-[11px] text-slate-400">Consistent Math Practice</span>
        </div>

        <div
          onClick={() => setShowReportModal(true)}
          className="bg-slate-900 border border-amber-500/30 hover:border-amber-400 p-4 rounded-xl cursor-pointer transition-all group"
        >
          <span className="text-[11px] font-mono text-amber-400 block uppercase font-bold flex items-center justify-between">
            <span>Predicted Score</span>
            <span className="text-slate-500 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </span>
          <p className="text-2xl font-black font-heading text-white mt-1 flex items-center gap-1.5">
            <span>94 / 100</span>
            <span className="text-xs font-normal text-amber-300">Grade A1</span>
          </p>
          <span className="text-[11px] text-emerald-400 font-bold block mt-0.5">Top 3% (#2 Rank in Batch)</span>
        </div>

        <div
          onClick={() => onNavigateTab('battle')}
          className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-orange-950/30 border border-amber-500/40 hover:border-amber-400 p-4 rounded-xl cursor-pointer transition-all group"
        >
          <span className="text-[11px] font-mono text-amber-400 block uppercase font-bold flex items-center justify-between">
            <span>Advait Coins</span>
            <span className="text-amber-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </span>
          <p className="text-2xl font-black font-heading text-amber-300 mt-1 flex items-center gap-2">
            <span>🪙 {advaitCoins} Coins</span>
          </p>
          <span className="text-[11px] text-amber-400/90 font-bold block mt-0.5">Win +5 Coins in Battle Ground!</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] font-mono text-slate-400 block uppercase">Faculty In-Charge</span>
          <p className="text-sm font-bold font-mono text-white mt-1 truncate">
            Harsh Sir (Advait Faculty)
          </p>
          <span className="text-[10px] text-slate-400 block truncate">Advaitinsights1927@gmail.com</span>
        </div>
      </div>

      {/* Main Content Area based on subtab */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Daily Tasks */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-heading text-white">
                  Daily Mathematics Study Goals
                </h3>
                <span className="text-xs text-sky-400 font-mono font-bold">
                  {completedCount === tasks.length ? 'All Completed! 🌟' : `${tasks.length - completedCount} Remaining`}
                </span>
              </div>

              <div className="space-y-2.5">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      task.done
                        ? 'bg-slate-950/80 border-slate-800 text-slate-400 line-through'
                        : 'bg-slate-950 border-slate-800 hover:border-sky-500/50 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          task.done ? 'bg-sky-500 border-sky-400 text-white' : 'border-slate-700 bg-slate-900'
                        }`}
                      >
                        {task.done && <span className="text-xs font-bold">✓</span>}
                      </div>
                      <span className="text-xs font-medium">{task.text}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Board Target</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Launchpad */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold font-heading text-white">
                Quick Study Tools
              </h3>

              <div className="grid grid-cols-1 gap-2.5">
                <button
                  onClick={() => setShowReportModal(true)}
                  className="p-3 bg-amber-950/20 hover:bg-amber-950/30 border border-amber-500/40 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-bold text-amber-300 block group-hover:text-amber-200 transition-colors">
                      📑 Official Weekly Web Report Card
                    </span>
                    <span className="text-[11px] text-slate-400">View diagnostic insights, competency matrix &amp; print PDF</span>
                  </div>
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
                </button>

                <button
                  onClick={() => onNavigateTab('canvas')}
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-sky-400 transition-colors">
                      🎨 Live Math Canvas &amp; Geometry Board
                    </span>
                    <span className="text-[11px] text-slate-400">Select, move, rotate drawings &amp; upload photos</span>
                  </div>
                  <span className="text-slate-500 group-hover:translate-x-1 transition-transform">&rarr;</span>
                </button>

                <button
                  onClick={() => onNavigateTab('solvers')}
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-amber-400 transition-colors">
                      ⚡ Interactive Step-by-Step Solvers
                    </span>
                    <span className="text-[11px] text-slate-400">Quadratic roots, Euclid HCF &amp; AP progression</span>
                  </div>
                  <span className="text-slate-500 group-hover:translate-x-1 transition-transform">&rarr;</span>
                </button>

                <button
                  onClick={() => onNavigateTab('practice')}
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-emerald-400 transition-colors">
                      📝 1000+ Sample Papers, MCQs &amp; PYQs
                    </span>
                    <span className="text-[11px] text-slate-400">Chapter-wise board questions &amp; marking schemes</span>
                  </div>
                  <span className="text-slate-500 group-hover:translate-x-1 transition-transform">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Weekly Web Report Card View */}
      {activeSubTab === 'report' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
                Official CBSE Web Report Card
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5">
                साप्ताहिक शैक्षणिक प्रगति रिपोर्ट (Weekly Academic Progress)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Generated for {currentStudentData.name} ({currentStudentData.rollNumber}) • CBSE 2026 Mathematics Target 100/100
              </p>
            </div>

            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Full Screen &amp; Print PDF</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Predicted Score</span>
              <p className="text-2xl font-black text-amber-400 font-heading mt-1">94 / 100</p>
              <span className="text-[10px] text-emerald-400 font-bold">Grade A1 (Outstanding)</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Questions Solved</span>
              <p className="text-2xl font-black text-sky-400 font-heading mt-1">85 problems</p>
              <span className="text-[10px] text-slate-400">42 MCQ • 28 PYQ • 15 HOTS</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Accuracy Rate</span>
              <p className="text-2xl font-black text-emerald-400 font-heading mt-1">92%</p>
              <span className="text-[10px] text-emerald-400 font-bold">High Precision</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Study Hours</span>
              <p className="text-2xl font-black text-purple-400 font-heading mt-1">16.5 hrs</p>
              <span className="text-[10px] text-amber-400 font-bold">7-Day Streak 🔥</span>
            </div>
          </div>

          {/* Chapter Mastery Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-300">
              अध्याय-वार दक्षता तालिका (Chapter Mastery Breakdown)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentStudentData.chapterBreakdown.map((ch) => (
                <div key={ch.chapter} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{ch.chapter}</span>
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
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        ch.accuracy >= 90 ? 'bg-emerald-400' : ch.accuracy >= 80 ? 'bg-sky-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${ch.accuracy}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{ch.questionsSolved} questions solved</span>
                    <span>Accuracy: {ch.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeSubTab === 'achievements' && (
        <AchievementSystem grade={grade} onNavigateTab={onNavigateTab} />
      )}
    </div>
  );
};
