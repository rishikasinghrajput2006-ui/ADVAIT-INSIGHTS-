import React, { useState, useEffect } from 'react';
import { GradeLevel } from '../../types/index.ts';

export interface Badge {
  id: string;
  title: string;
  category: 'quiz' | 'math' | 'canvas' | 'ai' | 'streak' | 'legendary';
  icon: string;
  tagline: string;
  description: string;
  xpReward: number;
  currentProgress: number;
  targetProgress: number;
  unit: string;
  unlocked: boolean;
  unlockedDate?: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

const DEFAULT_BADGES: Badge[] = [
  {
    id: 'math-wizard',
    title: 'Math Wizard',
    category: 'math',
    icon: '🧙‍♂️',
    tagline: 'Master of Theorems & Formulas',
    description: 'Solve 5 step-by-step equations and master key NCERT formulas.',
    xpReward: 350,
    currentProgress: 5,
    targetProgress: 5,
    unit: 'problems',
    unlocked: true,
    unlockedDate: 'Oct 17, 2026',
    rarity: 'Legendary',
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    category: 'quiz',
    icon: '🎯',
    tagline: 'Flawless Accuracy in Tests',
    description: 'Score 100% on a Chapter Practice Quiz Drill without hints.',
    xpReward: 250,
    currentProgress: 3,
    targetProgress: 3,
    unit: 'quizzes',
    unlocked: true,
    unlockedDate: 'Oct 18, 2026',
    rarity: 'Epic',
  },
  {
    id: 'geometry-architect',
    title: 'Geometry Architect',
    category: 'canvas',
    icon: '📐',
    tagline: 'Euclidean Precision on Canvas',
    description: 'Draw 3 NCERT theorem constructions on the Digital Math Board.',
    xpReward: 200,
    currentProgress: 2,
    targetProgress: 3,
    unit: 'proofs',
    unlocked: false,
    rarity: 'Rare',
  },
  {
    id: 'ai-prodigy',
    title: 'AI Prodigy',
    category: 'ai',
    icon: '🤖',
    tagline: 'Inquisitive Scholar',
    description: 'Clarify 5 complex doubts using AI Guru Doubt Solver.',
    xpReward: 180,
    currentProgress: 4,
    targetProgress: 5,
    unit: 'doubts',
    unlocked: false,
    rarity: 'Rare',
  },
  {
    id: 'josh-warrior',
    title: 'Josh Warrior',
    category: 'streak',
    icon: '🔥',
    tagline: '7-Day Unstoppable Habit',
    description: 'Take the True Words daily oath and maintain a 7-day study streak.',
    xpReward: 300,
    currentProgress: 7,
    targetProgress: 7,
    unit: 'days',
    unlocked: true,
    unlockedDate: 'Oct 19, 2026',
    rarity: 'Epic',
  },
  {
    id: 'pyq-conqueror',
    title: 'PYQ Conqueror',
    category: 'quiz',
    icon: '📜',
    tagline: 'Board Paper Specialist',
    description: 'Solve 20 CBSE 10-year previous questions and sample papers.',
    xpReward: 250,
    currentProgress: 14,
    targetProgress: 20,
    unit: 'questions',
    unlocked: false,
    rarity: 'Rare',
  },
  {
    id: 'hots-titan',
    title: 'HOTS Titan',
    category: 'legendary',
    icon: '👑',
    tagline: 'High Order Thinking Champion',
    description: 'Crack a 5-mark weekly hardest mathematics question challenge.',
    xpReward: 500,
    currentProgress: 1,
    targetProgress: 1,
    unit: 'challenge',
    unlocked: true,
    unlockedDate: 'Oct 15, 2026',
    rarity: 'Legendary',
  },
  {
    id: 'speed-solver',
    title: 'Speed Solver',
    category: 'math',
    icon: '⚡',
    tagline: 'Rapid Step-by-Step Solver',
    description: 'Solve quadratic roots and Euclid HCF in under 60 seconds.',
    xpReward: 150,
    currentProgress: 2,
    targetProgress: 2,
    unit: 'solves',
    unlocked: true,
    unlockedDate: 'Oct 16, 2026',
    rarity: 'Common',
  },
  {
    id: 'century-club',
    title: 'CBSE Century Club',
    category: 'legendary',
    icon: '🏆',
    tagline: 'Perfect 100/100 Target Mindset',
    description: 'Complete all daily quests and score 90%+ in 3 practice mock papers.',
    xpReward: 600,
    currentProgress: 2,
    targetProgress: 3,
    unit: 'papers',
    unlocked: false,
    rarity: 'Legendary',
  },
];

interface AchievementSystemProps {
  grade: GradeLevel;
  onNavigateTab?: (tab: string) => void;
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({ grade, onNavigateTab }) => {
  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const stored = localStorage.getItem('advait_student_badges_v1');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return DEFAULT_BADGES;
  });

  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked' | 'legendary'>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<Badge | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('advait_student_badges_v1', JSON.stringify(badges));
    } catch {
      // ignore
    }
  }, [badges]);

  // Derived statistics
  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalXP = badges
    .filter((b) => b.unlocked)
    .reduce((sum, b) => sum + b.xpReward, 0);

  // Compute Rank Level based on XP
  const computeLevel = (xp: number) => {
    if (xp >= 1500) return { level: 5, title: 'Grandmaster Mathematician', nextXp: 2000 };
    if (xp >= 1000) return { level: 4, title: 'Senior Board Scholar', nextXp: 1500 };
    if (xp >= 600) return { level: 3, title: 'Math Alchemist', nextXp: 1000 };
    if (xp >= 300) return { level: 2, title: 'Apprentice Solver', nextXp: 600 };
    return { level: 1, title: 'Novice Advaitian', nextXp: 300 };
  };

  const rankInfo = computeLevel(totalXP);
  const xpProgressPercent = Math.min(
    100,
    Math.round((totalXP / rankInfo.nextXp) * 100)
  );

  // Milestone Progress Trigger (simulate unlocking an achievement)
  const handleSimulateProgress = (badgeId: string) => {
    setBadges((prev) =>
      prev.map((b) => {
        if (b.id === badgeId) {
          const nextProg = Math.min(b.targetProgress, b.currentProgress + 1);
          const nowUnlocked = nextProg >= b.targetProgress;
          if (nowUnlocked && !b.unlocked) {
            setNewlyUnlockedBadge({ ...b, unlocked: true, currentProgress: nextProg });
          }
          return {
            ...b,
            currentProgress: nextProg,
            unlocked: nowUnlocked,
            unlockedDate: nowUnlocked ? 'Just now' : b.unlockedDate,
          };
        }
        return b;
      })
    );
  };

  const filteredBadges = badges.filter((b) => {
    if (filter === 'unlocked') return b.unlocked;
    if (filter === 'locked') return !b.unlocked;
    if (filter === 'legendary') return b.rarity === 'Legendary';
    return true;
  });

  const getRarityBadgeStyle = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'Legendary':
        return 'text-amber-400 bg-amber-950/80 border-amber-500/50';
      case 'Epic':
        return 'text-purple-400 bg-purple-950/80 border-purple-500/50';
      case 'Rare':
        return 'text-sky-400 bg-sky-950/80 border-sky-500/50';
      default:
        return 'text-slate-300 bg-slate-900 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Celebration Modal when new badge unlocked */}
      {newlyUnlockedBadge && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-b from-[#101b38] to-[#080d1a] border-2 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center relative shadow-2xl space-y-4">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-5xl shadow-xl shadow-amber-500/30 animate-bounce">
              {newlyUnlockedBadge.icon}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-black uppercase text-amber-400 tracking-widest block">
                ✨ MILESTONE UNLOCKED ✨
              </span>
              <h3 className="text-2xl font-black text-white font-heading">
                {newlyUnlockedBadge.title}
              </h3>
              <p className="text-xs text-slate-300">
                "{newlyUnlockedBadge.tagline}"
              </p>
            </div>

            <p className="text-xs text-slate-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              {newlyUnlockedBadge.description}
            </p>

            <div className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-400 font-mono">
              <span>+{newlyUnlockedBadge.xpReward} Academic XP</span>
              <span>•</span>
              <span className="text-amber-400">{newlyUnlockedBadge.rarity} Badge</span>
            </div>

            <button
              onClick={() => setNewlyUnlockedBadge(null)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg cursor-pointer"
            >
              Claim Badge &amp; Continue 🚀
            </button>
          </div>
        </div>
      )}

      {/* Detail Dialog for Selected Badge */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full space-y-4 relative shadow-2xl">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-mono"
            >
              ✕ Close
            </button>

            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border ${
                  selectedBadge.unlocked
                    ? 'bg-amber-500/20 border-amber-400 shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}
              >
                {selectedBadge.icon}
              </div>
              <div>
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${getRarityBadgeStyle(
                    selectedBadge.rarity
                  )}`}
                >
                  {selectedBadge.rarity}
                </span>
                <h4 className="text-lg font-bold text-white mt-1">
                  {selectedBadge.title}
                </h4>
                <span className="text-xs text-sky-400 font-medium">
                  {selectedBadge.tagline}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedBadge.description}
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Milestone Progress:</span>
                <span className="text-white font-bold">
                  {selectedBadge.currentProgress} / {selectedBadge.targetProgress} {selectedBadge.unit}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    selectedBadge.unlocked ? 'bg-amber-400' : 'bg-sky-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (selectedBadge.currentProgress / selectedBadge.targetProgress) * 100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-slate-400 pt-1">
                <span>Reward:</span>
                <span className="text-emerald-400 font-bold">+{selectedBadge.xpReward} XP</span>
              </div>
              {selectedBadge.unlockedDate && (
                <div className="flex justify-between text-slate-400">
                  <span>Earned on:</span>
                  <span className="text-slate-300">{selectedBadge.unlockedDate}</span>
                </div>
              )}
            </div>

            {!selectedBadge.unlocked && (
              <button
                onClick={() => {
                  handleSimulateProgress(selectedBadge.id);
                  setSelectedBadge((prev) =>
                    prev
                      ? {
                          ...prev,
                          currentProgress: Math.min(
                            prev.targetProgress,
                            prev.currentProgress + 1
                          ),
                          unlocked: prev.currentProgress + 1 >= prev.targetProgress,
                        }
                      : null
                  );
                }}
                className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Simulate Completing 1 {selectedBadge.unit.slice(0, -1) || 'step'} ⚡
              </button>
            )}
          </div>
        </div>
      )}

      {/* Header Level & XP Progress Card */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0d162d] to-slate-900 border border-amber-500/30 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-3xl shadow-lg shadow-amber-950/60 font-black">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">
                  Academic Achievement Headquarters
                </span>
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                  LEVEL {rankInfo.level}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5">
                {rankInfo.title}
              </h3>
              <p className="text-xs text-slate-300">
                Earn badges by solving PYQs, quizzes, and constructing geometry proofs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:border-l sm:border-slate-800 sm:pl-6 shrink-0">
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase block">Total XP</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {totalXP} <span className="text-xs text-slate-500 font-normal">XP</span>
              </span>
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase block">Badges</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                {unlockedCount} / {badges.length}
              </span>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Next Rank: Level {rankInfo.level + 1}</span>
            <span className="text-amber-400 font-bold">
              {totalXP} / {rankInfo.nextXp} XP ({xpProgressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${xpProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Quick Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {[
            { id: 'all', label: `All (${badges.length})` },
            { id: 'unlocked', label: `Unlocked (${unlockedCount})` },
            { id: 'locked', label: `In Progress (${badges.length - unlockedCount})` },
            { id: 'legendary', label: '👑 Legendary' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {onNavigateTab && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('practice')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Take Quiz to Earn Badges 🎯
            </button>
          </div>
        )}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const isComplete = badge.unlocked;
          const progressPercent = Math.min(
            100,
            Math.round((badge.currentProgress / badge.targetProgress) * 100)
          );

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between group overflow-hidden ${
                isComplete
                  ? 'bg-gradient-to-b from-slate-900 to-[#0e1628] border-amber-500/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-950/30'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Top Accent Ribbon */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border transition-transform group-hover:scale-110 ${
                      isComplete
                        ? 'bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 border-amber-400/80 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-500 grayscale'
                    }`}
                  >
                    {badge.icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white font-heading">
                      {badge.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 block truncate max-w-[150px]">
                      {badge.tagline}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${getRarityBadgeStyle(
                    badge.rarity
                  )}`}
                >
                  {badge.rarity}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 mb-4 line-clamp-2">
                {badge.description}
              </p>

              {/* Progress & Milestone */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">
                    {isComplete ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span>✓ Unlocked</span>
                        {badge.unlockedDate && <span>({badge.unlockedDate})</span>}
                      </span>
                    ) : (
                      <span>
                        {badge.currentProgress}/{badge.targetProgress} {badge.unit}
                      </span>
                    )}
                  </span>
                  <span className="text-amber-400 font-bold text-[11px]">
                    +{badge.xpReward} XP
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isComplete
                        ? 'bg-amber-400'
                        : 'bg-sky-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
