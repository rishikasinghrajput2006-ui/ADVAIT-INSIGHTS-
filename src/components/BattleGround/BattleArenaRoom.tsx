import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext.tsx';
import { GradeLevel, BattleState, BattlePlayer } from '../../types/index.ts';
import { battleSounds } from '../../utils/battleSounds.ts';

interface BattleArenaRoomProps {
  grade: GradeLevel;
  onOpenAuthModal: () => void;
  onOpenAIGuru?: () => void;
}

// Preset High-Yield CBSE Math Questions for Sir (KBC Hotseat Editions)
const PRESET_BATTLE_QUESTIONS = [
  {
    type: 'poll' as const,
    stage: 1,
    stageCoins: 1,
    title: 'पड़ाव 1: Trigonometry Identity (1 Mark MCQ)',
    questionText: 'CBSE 2026 Hotseat Challenge: If tan θ + cot θ = 2, then what is the value of tan²⁰²⁶ θ + cot²⁰²⁶ θ?',
    options: ['1', '2', '2026', '0'],
    correctOptionIndex: 1, // '2'
    correctAnswerText: '2',
    points: 10,
    expertHint: '💡 हर्ष सर की सलाह: cot θ को 1/tan θ लिखें। इससे (tan θ - 1)² = 0 बनता है, यानी tan θ = 1। 1 की कोई भी घात 1 ही होती है, इसलिए 1 + 1 = 2!',
  },
  {
    type: 'poll' as const,
    stage: 2,
    stageCoins: 2,
    title: 'पड़ाव 2: Polynomials Zeroes (Reciprocal Trick)',
    questionText: 'If one zero of the quadratic polynomial 2x² - 3x + k is the reciprocal of the other, what is the value of k?',
    options: ['k = 2', 'k = -2', 'k = 3/2', 'k = 1/2'],
    correctOptionIndex: 0, // 'k = 2'
    correctAnswerText: 'k = 2',
    points: 10,
    expertHint: '💡 हर्ष सर की सलाह: जब शून्यक व्युत्क्रम (reciprocal) हों (α और 1/α), तो शून्यकों का गुणनफल = 1 होता है। ax² + bx + c में Product = c/a, इसलिए k/2 = 1 => k = 2!',
  },
  {
    type: 'poll' as const,
    stage: 3,
    stageCoins: 3,
    title: 'पड़ाव 3 (पहला सुरक्षित पड़ाव): Real Numbers HCF-LCM Rule',
    questionText: 'If HCF(306, 657) = 9, what is the value of LCM(306, 657) using Fundamental Theorem of Arithmetic?',
    options: ['22338', '21338', '24560', '19872'],
    correctOptionIndex: 0,
    correctAnswerText: '22338',
    points: 10,
    expertHint: '💡 हर्ष सर की सलाह: HCF(a, b) × LCM(a, b) = a × b का उपयोग करें। LCM = (306 × 657) / 9 = 34 × 657 = 22338!',
  },
  {
    type: 'poll' as const,
    stage: 4,
    stageCoins: 4,
    title: 'पड़ाव 4: Circles & Tangents Pythagoras Challenge',
    questionText: 'From an external point P, tangent PT is drawn to a circle with centre O and radius 7 cm. If OP = 25 cm, what is the length of tangent PT?',
    options: ['24 cm', '20 cm', '18 cm', '26 cm'],
    correctOptionIndex: 0,
    correctAnswerText: '24 cm',
    points: 10,
    expertHint: '💡 हर्ष सर की सलाह: स्पर्श रेखा त्रिज्या पर लंबवत होती है (∠OTP = 90°)। पाइथागोरस प्रमेय: PT² = OP² - OT² = 25² - 7² = 625 - 49 = 576, अतः PT = 24 cm!',
  },
  {
    type: 'poll' as const,
    stage: 5,
    stageCoins: 5,
    title: 'महा-मुकाबला 5 (5 Advait Coins Jackpot): Quadratic Equal Roots',
    questionText: 'Find the values of k for which the quadratic equation 2x² - kx + k = 0 has two equal real roots (D = 0):',
    options: ['k = 0 or k = 8', 'k = 8 only', 'k = 0 only', 'k = 4'],
    correctOptionIndex: 0, // 'k = 0 or k = 8'
    correctAnswerText: 'k = 0 or k = 8',
    points: 10,
    expertHint: '💡 हर्ष सर की सलाह: समान मूलों के लिए विविक्तकर (Discriminant) D = b² - 4ac = 0। (-k)² - 4(2)(k) = k² - 8k = 0 => k(k - 8) = 0 => k = 0 या k = 8!',
  },
];

export const BattleArenaRoom: React.FC<BattleArenaRoomProps> = ({
  grade,
  onOpenAuthModal,
  onOpenAIGuru,
}) => {
  const { user, isAuthenticated, isTeacher, advaitCoins, addAdvaitCoins } = useAuth();

  // Battle State
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [studentAnswerInput, setStudentAnswerInput] = useState<string>('');
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string>('');
  const [zoomPhoto, setZoomPhoto] = useState<boolean>(false);

  // Sir (Teacher) Question Creator State
  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);
  const [newQuestionType, setNewQuestionType] = useState<'text' | 'poll' | 'photo'>('poll');
  const [newQuestionText, setNewQuestionText] = useState<string>('');
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const [newOptions, setNewOptions] = useState<string[]>(['', '', '', '']);
  const [newCorrectOptionIndex, setNewCorrectOptionIndex] = useState<number>(0);
  const [newCorrectAnswerText, setNewCorrectAnswerText] = useState<string>('');

  // Audio / Sound toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Winner celebration modal
  const [winnerCelebrated, setWinnerCelebrated] = useState<boolean>(false);

  // KBC Hotseat Lifelines & Locking State
  const [lifelines, setLifelines] = useState<{
    fiftyFifty: boolean;
    audiencePoll: boolean;
    expertAdvice: boolean;
    flipQuestion: boolean;
  }>({
    fiftyFifty: true,
    audiencePoll: true,
    expertAdvice: true,
    flipQuestion: true,
  });

  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [showAudiencePollModal, setShowAudiencePollModal] = useState<boolean>(false);
  const [showExpertAdviceModal, setShowExpertAdviceModal] = useState<boolean>(false);
  const [isLocking, setIsLocking] = useState<boolean>(false);
  const [lockingOptionIndex, setLockingOptionIndex] = useState<number | null>(null);
  const prevQuestionIdRef = useRef<string | null>(null);

  // Floating Real-Time Reaction Bubbles
  const [floatingReactions, setFloatingReactions] = useState<{ id: string; emoji: string; playerName: string; x: number }[]>([]);

  // References
  const wsRef = useRef<WebSocket | null>(null);
  const prevTimerSecsRef = useRef<number>(60);
  const prevWinnerRef = useRef<string | null>(null);

  const handleSendReaction = async (emoji: string) => {
    try {
      await fetch('/api/battle/reaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji, playerName: user?.name || 'Contestant' }),
      });
    } catch {
      // ignore
    }
  };

  // Is user a guest or unauthenticated?
  const isGuest = !isAuthenticated || (user?.id && user.id.startsWith('guest-')) || user?.emailOrPhone === 'guest@advait.edu';
  const isJoinedContestant = Boolean(
    user && battleState?.players.some((p) => p.id === user.id || p.email.toLowerCase() === user.emailOrPhone.toLowerCase())
  );
  const currentPlayer = user ? battleState?.players.find((p) => p.id === user.id || p.email.toLowerCase() === user.emailOrPhone.toLowerCase()) : null;

  // Fetch initial state via REST
  const fetchState = async () => {
    try {
      const res = await fetch('/api/battle/state');
      if (res.ok) {
        const data = await res.json();
        if (data.state) {
          setBattleState(data.state);
        }
      }
    } catch (err) {
      console.warn('Battle state fetch error:', err);
    }
  };

  // Setup WebSocket connection
  useEffect(() => {
    fetchState();

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    let socket: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWs = () => {
      try {
        socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          setIsConnected(true);
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'BATTLE_STATE_UPDATE' && data.state) {
              setBattleState(data.state);
            } else if (data.type === 'BATTLE_REACTION' && data.emoji) {
              const id = `react-${Date.now()}-${Math.random()}`;
              const x = Math.floor(Math.random() * 70) + 15;
              setFloatingReactions((prev) => [...prev.slice(-6), { id, emoji: data.emoji, playerName: data.playerName || '', x }]);
              setTimeout(() => {
                setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
              }, 3200);
            }
          } catch {
            // ignore
          }
        };

        socket.onclose = () => {
          setIsConnected(false);
          reconnectTimeout = setTimeout(connectWs, 3000);
        };

        socket.onerror = () => {
          setIsConnected(false);
        };
      } catch {
        setIsConnected(false);
      }
    };

    connectWs();

    // Fallback polling every 3 seconds to keep perfectly synced
    const pollInterval = setInterval(fetchState, 3000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Timer Tick Sound and Visual Alerts
  useEffect(() => {
    if (!battleState) return;

    const currentSecs = battleState.timerSecondsLeft;
    if (battleState.timerRunning && currentSecs !== prevTimerSecsRef.current) {
      if (soundEnabled && currentSecs <= 10 && currentSecs > 0) {
        battleSounds.playTick();
      } else if (soundEnabled && currentSecs === 0) {
        battleSounds.playTimeUp();
      }
    }
    prevTimerSecsRef.current = currentSecs;

    // Check winner celebration
    if (battleState.winner && battleState.winner.id !== prevWinnerRef.current) {
      prevWinnerRef.current = battleState.winner.id;
      setWinnerCelebrated(true);
      if (soundEnabled) {
        battleSounds.playVictory();
      }
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#38bdf8', '#ec4899', '#ffffff'],
        });
      } catch {
        // ignore
      }

      // If current student is the winner, add 5 Advait Coins in client context!
      if (user && battleState.winner.id === user.id) {
        addAdvaitCoins(5, 'CBSE Battle Ground Champion Winner');
      }
    }
  }, [battleState, soundEnabled, user, addAdvaitCoins]);

  // Reset KBC Lifelines & Eliminated Options on new question
  useEffect(() => {
    if (battleState?.currentQuestion?.id && battleState.currentQuestion.id !== prevQuestionIdRef.current) {
      prevQuestionIdRef.current = battleState.currentQuestion.id;
      setEliminatedOptions([]);
      setIsLocking(false);
      setLockingOptionIndex(null);
      setSelectedPollOption(null);
      setStudentAnswerInput('');
    }
  }, [battleState?.currentQuestion?.id]);

  // Join Battle Ground
  const handleJoinBattle = async () => {
    if (!user || isGuest) {
      onOpenAuthModal();
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/battle/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: user.name,
          email: user.emailOrPhone,
          role: user.role,
          grade: user.grade || grade,
          advaitCoins,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionMessage(`❌ ${data.error || 'Failed to join arena'}`);
      } else {
        setActionMessage(`✅ You entered the Battle Ground Arena!`);
        if (data.state) setBattleState(data.state);
      }
    } catch {
      setActionMessage('❌ Network error joining arena');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setActionMessage(''), 4000);
    }
  };

  // Leave Battle Ground
  const handleLeaveBattle = async () => {
    if (!user) return;
    try {
      await fetch('/api/battle/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: user.id }),
      });
      fetchState();
    } catch {
      // ignore
    }
  };

  // Student Submits Answer
  const handleSubmitAnswer = async (optionIdx?: number) => {
    if (!user || !currentPlayer || !battleState?.currentQuestion) return;

    const answerToSubmit = optionIdx !== undefined ? undefined : studentAnswerInput.trim();
    if (battleState.currentQuestion.type !== 'poll' && !answerToSubmit) {
      setActionMessage('⚠️ Please type your answer before submitting!');
      setTimeout(() => setActionMessage(''), 3000);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/battle/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: user.id,
          answerText: answerToSubmit,
          selectedOptionIndex: optionIdx !== undefined ? optionIdx : selectedPollOption,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionMessage(`❌ ${data.error || 'Submission failed'}`);
      } else {
        if (battleState.currentQuestion.type === 'poll') {
          const isCorrect = optionIdx === battleState.currentQuestion.correctOptionIndex;
          if (isCorrect) {
            setActionMessage('🎉 अद्भुत! बिल्कुल सही जवाब! +10 Points Prapt hue!');
            if (soundEnabled) battleSounds.playCorrect();
          } else {
            setActionMessage('❌ अफ़सोस! यह गलत विकल्प है! Next question me try karo.');
            if (soundEnabled) battleSounds.playIncorrect();
          }
        } else {
          setActionMessage('✅ Answer Box me answer jama ho gaya! Sir check kar rahe hain.');
          if (soundEnabled) battleSounds.playCorrect();
        }
        if (data.state) setBattleState(data.state);
        setStudentAnswerInput('');
      }
    } catch {
      setActionMessage('❌ Error submitting answer');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setActionMessage(''), 4500);
    }
  };

  // KBC "Computer Ji, Lock Kiya Jaye!" Action
  const handleLockAndSubmit = (idx: number) => {
    if (
      isGuest ||
      !isJoinedContestant ||
      currentPlayer?.selectedOptionIndex !== undefined ||
      timerSecs <= 0 ||
      isLocking ||
      eliminatedOptions.includes(idx)
    ) {
      return;
    }

    setLockingOptionIndex(idx);
    setIsLocking(true);
    setSelectedPollOption(idx);
    if (soundEnabled) {
      battleSounds.playLock();
    }
    const optionLetter = ['A', 'B', 'C', 'D'][idx];
    setActionMessage(`🔒 कंप्यूटर जी, विकल्प ${optionLetter} पर ताला लगाया जाए!`);

    setTimeout(() => {
      setIsLocking(false);
      handleSubmitAnswer(idx);
    }, 850);
  };

  // KBC 50:50 Lifeline
  const handleUseFiftyFifty = () => {
    if (!lifelines.fiftyFifty) return;
    if (!currentQ || currentQ.type !== 'poll' || currentQ.correctOptionIndex === undefined) return;

    const correctIdx = currentQ.correctOptionIndex;
    const incorrectIndices = [0, 1, 2, 3].filter(
      (i) => i !== correctIdx && i < (currentQ.options?.length || 4)
    );

    const shuffled = [...incorrectIndices].sort(() => 0.5 - Math.random());
    const toEliminate = shuffled.slice(0, 2);

    setEliminatedOptions(toEliminate);
    setLifelines((prev) => ({ ...prev, fiftyFifty: false }));
    if (soundEnabled) battleSounds.playLifeline();
    setActionMessage('✨ 50:50 Lifeline प्रयुक्त! कंप्यूटर जी ने 2 गलत विकल्प हटा दिए हैं!');
    setTimeout(() => setActionMessage(''), 4000);
  };

  // KBC Audience Poll Lifeline
  const handleUseAudiencePoll = () => {
    if (!lifelines.audiencePoll) return;
    setLifelines((prev) => ({ ...prev, audiencePoll: false }));
    if (soundEnabled) battleSounds.playLifeline();
    setShowAudiencePollModal(true);
  };

  // KBC Expert Advice Lifeline
  const handleUseExpertAdvice = () => {
    if (!lifelines.expertAdvice) return;
    setLifelines((prev) => ({ ...prev, expertAdvice: false }));
    if (soundEnabled) battleSounds.playLifeline();
    setShowExpertAdviceModal(true);
  };

  // KBC Flip Question Lifeline
  const handleUseFlipQuestion = async () => {
    if (!lifelines.flipQuestion) return;
    setLifelines((prev) => ({ ...prev, flipQuestion: false }));
    if (soundEnabled) battleSounds.playLifeline();
    const altPreset =
      PRESET_BATTLE_QUESTIONS.find((p) => p.questionText !== currentQ?.questionText) ||
      PRESET_BATTLE_QUESTIONS[0];
    handleLoadPreset(altPreset);
    try {
      await fetch('/api/battle/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: altPreset.type,
          questionText: altPreset.questionText,
          options: altPreset.options,
          correctOptionIndex: altPreset.correctOptionIndex,
          correctAnswerText: altPreset.correctAnswerText,
          points: 10,
          isTeacher: true,
        }),
      });
      fetchState();
      setActionMessage('🔄 प्रश्न बदल दिया गया है (Question Flipped)! नया महा-प्रश्न स्क्रीन पर है!');
      setTimeout(() => setActionMessage(''), 4500);
    } catch {
      // ignore
    }
  };

  // Sir (Teacher) Controls: 1-Min Timer
  const handleTimerControl = async (action: 'start' | 'pause' | 'reset') => {
    try {
      const res = await fetch('/api/battle/timer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, isTeacher: true }),
      });
      const data = await res.json();
      if (data.state) setBattleState(data.state);
    } catch {
      // ignore
    }
  };

  // Sir Publishes Question
  const handlePublishQuestion = async () => {
    if (!newQuestionText.trim() && !newPhotoUrl.trim()) {
      alert('Question text ya photo URL daalna zaroori hai!');
      return;
    }

    try {
      const res = await fetch('/api/battle/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newQuestionType,
          questionText: newQuestionText.trim(),
          photoUrl: newPhotoUrl.trim() || undefined,
          options: newQuestionType === 'poll' ? newOptions.filter((o) => o.trim()) : undefined,
          correctOptionIndex: newQuestionType === 'poll' ? newCorrectOptionIndex : undefined,
          correctAnswerText: newCorrectAnswerText.trim() || undefined,
          points: 10,
          isTeacher: true,
        }),
      });

      const data = await res.json();
      if (data.state) setBattleState(data.state);
      setShowQuestionModal(false);
      setNewQuestionText('');
      setNewPhotoUrl('');
      setNewOptions(['', '', '', '']);
      setNewCorrectAnswerText('');
    } catch {
      alert('Failed to publish question');
    }
  };

  // Sir Loads Preset Question
  const handleLoadPreset = (preset: typeof PRESET_BATTLE_QUESTIONS[0]) => {
    setNewQuestionType(preset.type);
    setNewQuestionText(preset.questionText);
    setNewPhotoUrl(('photoUrl' in preset && (preset as any).photoUrl) || '');
    if (preset.options) {
      setNewOptions([...preset.options]);
      setNewCorrectOptionIndex(preset.correctOptionIndex ?? 0);
    }
    setNewCorrectAnswerText(preset.correctAnswerText || '');
  };

  // Sir Evaluates Subjective Answer
  const handleEvaluateAnswer = async (playerId: string, isCorrect: boolean) => {
    try {
      const res = await fetch('/api/battle/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, isCorrect, isTeacher: true }),
      });
      const data = await res.json();
      if (data.state) setBattleState(data.state);
    } catch {
      // ignore
    }
  };

  // Sir Kicks Student ("sir cha he toh kisi bhi student ko hata paye")
  const handleKickStudent = async (playerId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to remove ${studentName} from this battle round?`)) return;
    try {
      const res = await fetch('/api/battle/kick-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, isTeacher: true }),
      });
      const data = await res.json();
      if (data.state) setBattleState(data.state);
    } catch {
      // ignore
    }
  };

  // Sir Declares Winner & Awards 5 Advait Coins!
  const handleDeclareWinner = async () => {
    if (!confirm('Declare current #1 ranked student as Winner and award 5 Advait Coins?')) return;
    try {
      const res = await fetch('/api/battle/declare-winner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTeacher: true }),
      });
      const data = await res.json();
      if (data.state) setBattleState(data.state);
    } catch {
      // ignore
    }
  };

  // Sir Resets Match
  const handleResetMatch = async () => {
    if (!confirm('Reset match points and start a fresh battle?')) return;
    try {
      const res = await fetch('/api/battle/reset-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTeacher: true }),
      });
      const data = await res.json();
      if (data.state) setBattleState(data.state);
      setWinnerCelebrated(false);
    } catch {
      // ignore
    }
  };

  const currentQ = battleState?.currentQuestion;
  const timerSecs = battleState?.timerSecondsLeft ?? 60;
  const isTimerRunning = battleState?.timerRunning ?? false;
  const sortedPlayers = [...(battleState?.players || [])].sort((a, b) => b.points - a.points);

  // Live Answer Submission Metrics ("Kitne logo ne answer de diya")
  const totalPlayers = battleState?.players || [];
  const totalPlayerCount = totalPlayers.length;
  
  // A student has answered if answeredAt is set, or option selected, or currentAnswer is submitted
  const answeredPlayers = totalPlayers.filter(
    (p) => p.answeredAt !== undefined || p.selectedOptionIndex !== undefined || (p.currentAnswer && p.currentAnswer.trim() !== '')
  );
  const answeredCount = answeredPlayers.length;
  const answeredPercent = totalPlayerCount > 0 ? Math.round((answeredCount / totalPlayerCount) * 100) : 0;
  const pendingPlayers = totalPlayers.filter(
    (p) => p.answeredAt === undefined && p.selectedOptionIndex === undefined && (!p.currentAnswer || p.currentAnswer.trim() === '')
  );
  const pendingCount = pendingPlayers.length;

  // Fastest finger first (earliest answer time in current question)
  const answeredWithTime = [...answeredPlayers]
    .filter((p) => p.answeredAt && battleState?.currentQuestion?.createdAt)
    .sort((a, b) => (a.answeredAt || 0) - (b.answeredAt || 0));
  
  const fastestFinger = answeredWithTime.length > 0 ? answeredWithTime[0] : null;
  const fastestTimeSeconds = fastestFinger && battleState?.currentQuestion?.createdAt
    ? Math.max(1, Math.round(((fastestFinger.answeredAt || 0) - battleState.currentQuestion.createdAt) / 100) / 10)
    : null;

  // Poll votes count per option (index 0, 1, 2, 3)
  const pollVoteCounts = [0, 0, 0, 0];
  if (battleState?.currentQuestion?.type === 'poll') {
    totalPlayers.forEach((p) => {
      if (p.selectedOptionIndex !== undefined && p.selectedOptionIndex >= 0 && p.selectedOptionIndex < 4) {
        pollVoteCounts[p.selectedOptionIndex] += 1;
      }
    });
  }

  return (
    <div className="space-y-6 relative">
      {/* Real-Time Floating Reactions Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingReactions.map((r) => (
          <div
            key={r.id}
            style={{ left: `${r.x}%` }}
            className="absolute bottom-20 transform -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/95 border-2 border-amber-400/80 rounded-full shadow-2xl shadow-amber-500/20 animate-bounce transition-all"
          >
            <span className="text-2xl">{r.emoji}</span>
            {r.playerName && (
              <span className="text-[10px] font-bold text-amber-300 font-mono">
                {r.playerName}
              </span>
            )}
          </div>
        ))}
      </div>
      {/* ARENA HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950/80 to-slate-950 border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl shadow-amber-950/20">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 flex items-center gap-1.5 shadow-md uppercase tracking-wider">
                <span>⚔️</span> LIVE ARENA
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                <span>{isConnected ? 'Real-Time Connected' : 'Syncing Live'}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-950/80 border border-indigo-700/60 text-indigo-300">
                👥 Capacity: {battleState?.players.length || 0} / 10 Students Max
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>CBSE Math Battle Ground</span>
              <span className="text-amber-400 text-xl sm:text-2xl">🔥</span>
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Sir conducts live CBSE Math rounds! Students answer in the live answer box. 
              <strong className="text-amber-300 font-bold"> +10 Points </strong> for every correct answer, and the winner claims 
              <strong className="text-amber-400 font-bold"> 5 Advait Coins (🪙🪙🪙🪙🪙)</strong>!
            </p>
          </div>

          {/* User Advait Coins Pill & Sound Toggle */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shrink-0 shadow-lg">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-xl">
              <span className="text-xl">🪙</span>
              <div>
                <span className="text-[10px] text-amber-300 uppercase tracking-wider font-bold block leading-none">Advait Coins</span>
                <span className="text-base font-black text-amber-400">{advaitCoins} Coins</span>
              </div>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl text-sm border transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
              title={soundEnabled ? 'Sound Effects Enabled' : 'Sound Muted'}
            >
              {soundEnabled ? '🔊 Sound ON' : '🔇 Muted'}
            </button>
          </div>
        </div>

        {/* Action Flash Message */}
        {actionMessage && (
          <div className="mt-4 p-3 bg-slate-900/95 border border-amber-400/50 rounded-xl text-xs sm:text-sm font-bold text-amber-300 animate-bounce flex items-center gap-2">
            <span>📢</span>
            <span>{actionMessage}</span>
          </div>
        )}
      </div>

      {/* SECURITY GATE: BLOCK GUESTS & REQUIRE SIGNED-UP STUDENT */}
      {isGuest && (
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/40 border-2 border-rose-500/50 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 text-2xl shrink-0">
              🔒
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <span>Student Sign Up Anivarya Hai! (Registration Required)</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-mono">BINA SIGN UP MANA HAI</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Battle Ground me answer dene, 10 points paane, aur 5 Advait Coins jeetne ke liye verified student account anivarya hai. Guest accounts se compete nahi kiya ja sakta.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={onOpenAuthModal}
              className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🔑 Student Sign Up / Login Karein</span>
            </button>
          </div>
        </div>
      )}

      {/* STUDENT JOIN / LEAVE ARENA BAR (When registered) */}
      {!isGuest && !isTeacher && (
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 text-xl font-bold shrink-0">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{user?.name}</span>
                <span className="text-[11px] px-2 py-0.5 bg-sky-950 text-sky-300 border border-sky-800/80 rounded-full font-mono">
                  {user?.grade === 'class9' ? 'Class 9' : 'Class 10 CBSE'}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {isJoinedContestant
                  ? `Active Contestant #${currentPlayer ? sortedPlayers.findIndex((p) => p.id === currentPlayer.id) + 1 : 1} · Score: ${currentPlayer?.points || 0} Pts`
                  : 'Aap abhi Arena me join nahi hain. Join karein aur compete karein!'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {!isJoinedContestant ? (
              <button
                onClick={handleJoinBattle}
                disabled={isSubmitting || (battleState?.players.length || 0) >= 10}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>⚔️</span>
                <span>{(battleState?.players.length || 0) >= 10 ? 'Arena Full (10/10 Players)' : 'Enter Battle Arena Now'}</span>
              </button>
            ) : (
              <button
                onClick={handleLeaveBattle}
                className="px-4 py-2 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>🚪</span>
                <span>Leave Arena</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* TEACHER (SIR) HOST CONTROL PANEL */}
      {isTeacher && (
        <div className="p-5 bg-gradient-to-r from-amber-950/50 via-slate-900 to-amber-950/30 border-2 border-amber-500/60 rounded-2xl shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 text-lg font-bold">
                👑
              </span>
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>Harsh Sir (Faculty Host Console)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono">BATTLE MASTER</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Question dein (Likh kar, Poll se, ya Photo ke roop me), 1-Min timer on karein, aur winner declare karein.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowQuestionModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>➕</span>
                <span>Naya Question Dein (Text / Poll / Photo)</span>
              </button>

              <button
                onClick={() => {
                  setActionMessage('🎙️ हर्ष सर: "कंप्यूटर जी, क्या यह सही जवाब है? ताला लगाया जाए!"');
                  if (soundEnabled) battleSounds.playLock();
                  setTimeout(() => setActionMessage(''), 4500);
                }}
                className="px-3.5 py-2 bg-indigo-950/90 hover:bg-indigo-900 border border-indigo-600/80 text-indigo-200 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                title="Sir announces KBC Lock in Arena"
              >
                <span>🔒</span>
                <span>ताला लगाया जाए!</span>
              </button>

              <button
                onClick={handleDeclareWinner}
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>🏆</span>
                <span>Winner Ghoshit Karein (Award 5 Coins)</span>
              </button>

              <button
                onClick={handleResetMatch}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                title="Reset Match Scoreboard"
              >
                🔄 Reset Match
              </button>
            </div>
          </div>

          {/* 1-Minute Timer Master Controls (Dedicated 1-minute timer requested by user) */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-xl">⏱️</span>
              <div>
                <span className="text-xs font-bold text-white block">1-Minute Timer Control:</span>
                <span className="text-[11px] text-slate-400">
                  Sir timer ON karenge tabhi 60 second ka countdown shuru hoga.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isTimerRunning ? (
                <button
                  onClick={() => handleTimerControl('start')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
                >
                  <span>▶</span>
                  <span>Start 1-Min Timer</span>
                </button>
              ) : (
                <button
                  onClick={() => handleTimerControl('pause')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>⏸</span>
                  <span>Pause Timer</span>
                </button>
              )}

              <button
                onClick={() => handleTimerControl('reset')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                <span>🔄 60s Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN BATTLE GRID: CENTRAL ARENA STAGE (LEFT) + LIVE 10-PLAYER LEADERBOARD (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ACTIVE QUESTION & ANSWER SUBMISSION BOX (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 🌟 KBC 4 LIFELINES HUD (कौन बनेगा करोड़पति लाइफलाइन्स) */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-indigo-950/70 to-slate-950 border-2 border-amber-500/50 rounded-3xl shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-indigo-900/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/60 flex items-center justify-center text-sm">
                  ⚡
                </span>
                <div>
                  <span className="text-xs font-black tracking-wider text-amber-300 uppercase font-mono block">
                    KBC 4 LIFELINES (लाइफलाइन्स)
                  </span>
                  <span className="text-[10px] text-slate-400">CBSE Math Hotseat Tools</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-amber-300 bg-amber-950/90 px-2.5 py-0.5 rounded-full border border-amber-500/40 font-bold">
                  HOTSEAT ROUND
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* 50:50 */}
              <button
                onClick={handleUseFiftyFifty}
                disabled={!lifelines.fiftyFifty || isGuest || !isJoinedContestant || currentQ?.type !== 'poll'}
                className={`p-2.5 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                  lifelines.fiftyFifty
                    ? 'bg-slate-900/90 hover:bg-amber-950/60 border-amber-500/50 text-amber-200 hover:border-amber-400 shadow-lg active:scale-95'
                    : 'bg-slate-950/80 border-slate-800 text-slate-600 cursor-not-allowed opacity-35 line-through'
                }`}
                title="50:50 Lifeline: Eliminates 2 incorrect options"
              >
                <span className="text-lg">🌓</span>
                <div className="text-left leading-tight">
                  <span className="block font-black text-xs">50 : 50</span>
                  <span className="text-[9px] text-amber-400/80 font-normal">२ विकल्प हटाएं</span>
                </div>
              </button>

              {/* Audience Poll */}
              <button
                onClick={handleUseAudiencePoll}
                disabled={!lifelines.audiencePoll || isGuest || !isJoinedContestant}
                className={`p-2.5 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                  lifelines.audiencePoll
                    ? 'bg-slate-900/90 hover:bg-sky-950/60 border-sky-500/50 text-sky-200 hover:border-sky-400 shadow-lg active:scale-95'
                    : 'bg-slate-950/80 border-slate-800 text-slate-600 cursor-not-allowed opacity-35 line-through'
                }`}
                title="Audience Poll: View crowd distribution percentages"
              >
                <span className="text-lg">📊</span>
                <div className="text-left leading-tight">
                  <span className="block font-black text-xs">Audience Poll</span>
                  <span className="text-[9px] text-sky-400/80 font-normal">जनता की राय</span>
                </div>
              </button>

              {/* Ask Harsh Sir (Expert Advice) */}
              <button
                onClick={handleUseExpertAdvice}
                disabled={!lifelines.expertAdvice || isGuest || !isJoinedContestant}
                className={`p-2.5 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                  lifelines.expertAdvice
                    ? 'bg-slate-900/90 hover:bg-emerald-950/60 border-emerald-500/50 text-emerald-200 hover:border-emerald-400 shadow-lg active:scale-95'
                    : 'bg-slate-950/80 border-slate-800 text-slate-600 cursor-not-allowed opacity-35 line-through'
                }`}
                title="Ask Harsh Sir: Get conceptual formula hint"
              >
                <span className="text-lg">👑</span>
                <div className="text-left leading-tight">
                  <span className="block font-black text-xs">Ask Harsh Sir</span>
                  <span className="text-[9px] text-emerald-400/80 font-normal">सर की सलाह</span>
                </div>
              </button>

              {/* Flip The Question */}
              <button
                onClick={handleUseFlipQuestion}
                disabled={!lifelines.flipQuestion || isGuest || !isJoinedContestant}
                className={`p-2.5 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                  lifelines.flipQuestion
                    ? 'bg-slate-900/90 hover:bg-purple-950/60 border-purple-500/50 text-purple-200 hover:border-purple-400 shadow-lg active:scale-95'
                    : 'bg-slate-950/80 border-slate-800 text-slate-600 cursor-not-allowed opacity-35 line-through'
                }`}
                title="Flip Question: Switch to another CBSE question"
              >
                <span className="text-lg">🔄</span>
                <div className="text-left leading-tight">
                  <span className="block font-black text-xs">Flip Question</span>
                  <span className="text-[9px] text-purple-400/80 font-normal">प्रश्न बदलें</span>
                </div>
              </button>
            </div>
          </div>

          {/* ACTIVE QUESTION CARD WITH LIVE SUBMISSION TRACKER */}
          <div className="p-6 bg-slate-900/90 border-2 border-slate-800 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
            {/* Top Question Header & Timer Ring */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400 text-sky-400 font-extrabold text-sm flex items-center justify-center">
                  Q{battleState?.questionNumber || 1}
                </span>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                    Question Mode: {currentQ?.type?.toUpperCase() || 'POLL'} · 10 Points
                  </span>
                  <span className="text-xs text-amber-400 font-bold">
                    {currentQ?.type === 'poll' ? '📊 KBC Diamond Poll Round' : currentQ?.type === 'photo' ? '📷 Photo / Diagram Question' : '📝 Numerical / Proof Question'}
                  </span>
                </div>
              </div>

              {/* 1-Minute Circular Countdown Display */}
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border font-mono font-black text-sm sm:text-base ${
                  timerSecs <= 10
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500 animate-pulse'
                    : isTimerRunning
                    ? 'bg-amber-950/60 text-amber-300 border-amber-500/60'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <span className={isTimerRunning ? 'animate-spin' : ''}>⏳</span>
                <span>{timerSecs}s / 60s</span>
              </div>
            </div>

            {/* 🔥 LIVE SUBMISSION TRACKER HUD ("KITNE LOGO NE ANSWER DIYA") */}
            <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border-2 border-sky-500/40 rounded-2xl space-y-3 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white tracking-wide flex items-center gap-1.5">
                    <span>LIVE SUBMISSION TRACKER</span>
                    <span className="text-amber-400 font-normal">(कितने छात्रों ने उत्तर दिया)</span>
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                    {answeredCount} / {totalPlayerCount} Answered ({answeredPercent}%)
                  </span>
                </div>
              </div>

              {/* Glowing Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700/80">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-sky-400 to-emerald-400 transition-all duration-500 shadow-sm shadow-emerald-400/50"
                    style={{ width: `${Math.max(answeredPercent, totalPlayerCount > 0 && answeredCount > 0 ? 8 : 0)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="text-emerald-400 font-bold">
                    ✅ {answeredCount} Students Submitted
                  </span>
                  <span className="text-amber-400 font-bold">
                    ⏳ {pendingCount} Still Solving
                  </span>
                </div>
              </div>

              {/* Real-time Student Status Chips Grid */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  👥 Students Live Status in Arena:
                </span>
                <div className="flex flex-wrap gap-2">
                  {totalPlayers.map((player) => {
                    const hasAnswered = player.answeredAt !== undefined || player.selectedOptionIndex !== undefined || (player.currentAnswer && player.currentAnswer.trim() !== '');
                    const isSelf = user && player.id === user.id;

                    return (
                      <div
                        key={player.id}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                          hasAnswered
                            ? 'bg-emerald-950/70 border-emerald-500/70 text-emerald-200 shadow-sm'
                            : 'bg-slate-950/80 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-sm">{player.avatar || '🎓'}</span>
                        <span className="truncate max-w-[100px]">{player.name.split(' ')[0]}</span>
                        {isSelf && <span className="text-[9px] text-sky-400 font-mono">(You)</span>}
                        {hasAnswered ? (
                          <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-1 rounded flex items-center gap-0.5">
                            <span>✓</span>
                            <span>Ans</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-400/80 animate-pulse">
                            ⏳
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fastest Finger Badge */}
              {fastestFinger && (
                <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl text-xs">
                  <span className="text-base">⚡</span>
                  <span className="text-slate-300">
                    <strong className="text-amber-300 font-extrabold">{fastestFinger.name}</strong> was first to submit!
                    {fastestTimeSeconds && (
                      <span className="text-amber-400 font-mono ml-1">({fastestTimeSeconds}s 🚀 Fastest Finger)</span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-amber-300 font-mono font-bold">
                <span>🎯 पड़ाव (Stage {currentQ?.stage || 1} / 5)</span>
                <span>🪙 दांव: {currentQ?.stageCoins || 1} Advait Coins</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentQ?.questionText || 'Awaiting Sir to launch the next question...'}
              </h2>

              {/* Photo Display (If Photo Question) */}
              {currentQ?.photoUrl && (
                <div className="space-y-2">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 group">
                    <img
                      src={currentQ.photoUrl}
                      alt="Battle Question Diagram"
                      className={`w-full object-contain transition-all duration-300 ${
                        zoomPhoto ? 'max-h-[500px]' : 'max-h-72'
                      }`}
                    />
                    <button
                      onClick={() => setZoomPhoto(!zoomPhoto)}
                      className="absolute bottom-2 right-2 px-2.5 py-1 bg-slate-950/80 text-white rounded-lg text-xs font-mono border border-slate-700 hover:bg-slate-800 cursor-pointer"
                    >
                      {zoomPhoto ? '🔍 Zoom Out' : '🔍 Zoom In'}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 block italic">
                    📌 Sir ne photo question diya hai. Photo dekhkar apna answer niche submit karein.
                  </span>
                </div>
              )}
            </div>

            {/* 💎 KBC HEXAGONAL/DIAMOND OPTIONS WITH "COMPUTER JI, LOCK KIYA JAYE" SUSPENSE */}
            {currentQ?.type === 'poll' && currentQ.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {currentQ.options.map((option, idx) => {
                  const letters = ['A', 'B', 'C', 'D'];
                  const isSelected = selectedPollOption === idx || currentPlayer?.selectedOptionIndex === idx;
                  const isCorrectAnswer = currentQ.correctOptionIndex === idx;
                  const showResult = battleState?.status === 'round_ended' || currentPlayer?.isCorrect !== null;
                  const votesForThisOption = pollVoteCounts[idx] || 0;
                  const votePercent = answeredCount > 0 ? Math.round((votesForThisOption / answeredCount) * 100) : 0;
                  const isEliminated = eliminatedOptions.includes(idx);
                  const isCurrentlyLocking = isLocking && lockingOptionIndex === idx;

                  return (
                    <button
                      key={idx}
                      disabled={
                        isGuest ||
                        !isJoinedContestant ||
                        currentPlayer?.selectedOptionIndex !== undefined ||
                        timerSecs <= 0 ||
                        isEliminated ||
                        isLocking
                      }
                      onClick={() => handleLockAndSubmit(idx)}
                      className={`relative overflow-hidden p-4 rounded-2xl border-2 text-left flex flex-col justify-between gap-2.5 transition-all cursor-pointer ${
                        isEliminated
                          ? 'opacity-20 bg-slate-950/50 border-slate-900 text-slate-600 line-through cursor-not-allowed'
                          : isCurrentlyLocking
                          ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-4 ring-amber-400/60 animate-pulse shadow-2xl scale-[1.02]'
                          : showResult && isCorrectAnswer
                          ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-500/60 shadow-xl shadow-emerald-950/50'
                          : showResult && isSelected && !isCorrectAnswer
                          ? 'bg-rose-950/90 border-rose-500 text-rose-200'
                          : isSelected
                          ? 'bg-indigo-900/60 border-indigo-400 text-white ring-2 ring-indigo-400/50 shadow-lg'
                          : 'bg-slate-950/80 hover:bg-indigo-950/50 border-slate-800 hover:border-amber-500/60 text-slate-200 hover:shadow-lg'
                      }`}
                    >
                      {/* Background vote distribution fill bar */}
                      {(showResult || isSelected || isTeacher) && votesForThisOption > 0 && !isEliminated && (
                        <div
                          className="absolute inset-y-0 left-0 bg-sky-500/15 transition-all duration-500 pointer-events-none"
                          style={{ width: `${votePercent}%` }}
                        />
                      )}

                      <div className="flex items-center gap-3 relative z-10">
                        {/* KBC Diamond Letter Marker */}
                        <span
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center font-mono font-black text-xs shrink-0 transition-all ${
                            isCurrentlyLocking
                              ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold animate-bounce'
                              : showResult && isCorrectAnswer
                              ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                              : isSelected
                              ? 'bg-sky-500 text-white border-sky-300'
                              : 'bg-slate-900 border-amber-500/30 text-amber-400'
                          }`}
                        >
                          ◆ {letters[idx]}
                        </span>

                        <span className="text-sm font-bold flex-1 leading-snug">
                          {isEliminated ? '🚫 [50:50 विकल्प समाप्त]' : option}
                        </span>

                        {isCurrentlyLocking && (
                          <span className="text-xs font-black text-amber-300 bg-amber-950/90 px-2 py-1 rounded-lg border border-amber-400 shrink-0 animate-pulse">
                            🔒 LOCK HO RAHA HAI...
                          </span>
                        )}

                        {showResult && isCorrectAnswer && (
                          <span className="text-emerald-300 font-black text-xs shrink-0 bg-emerald-950/90 px-2 py-0.5 rounded-md border border-emerald-500/50">
                            ✓ अद्भुत! सही (+10 Pts)
                          </span>
                        )}
                      </div>

                      {/* Vote Count indicator on Option */}
                      {(showResult || isSelected || isTeacher || answeredCount > 0) && !isEliminated && (
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1.5 border-t border-slate-800 relative z-10">
                          <span>{votesForThisOption} {votesForThisOption === 1 ? 'Student' : 'Students'} Chose This</span>
                          <span className="font-bold text-sky-400">{votePercent}%</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* TEXT ANSWER SUBMISSION BOX (For Text & Photo Questions) */}
            {currentQ?.type !== 'poll' && (
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>✍️ Student Answer Box:</span>
                  <span className="text-[11px] text-amber-400 font-mono">10 Points for Correct Solution</span>
                </label>

                {!isGuest && isJoinedContestant ? (
                  currentPlayer?.currentAnswer ? (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Aapka jama kiya gaya answer:</span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                            currentPlayer.isCorrect === true
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : currentPlayer.isCorrect === false
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {currentPlayer.isCorrect === true
                            ? '✓ Correct (+10 Points Prapt!)'
                            : currentPlayer.isCorrect === false
                            ? '✗ Incorrect (0 Points)'
                            : '⏳ Awaiting Sir Evaluation'}
                        </span>
                      </div>
                      <p className="text-sm font-mono text-white bg-slate-900 p-2.5 rounded-xl">
                        {currentPlayer.currentAnswer}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="text"
                        value={studentAnswerInput}
                        onChange={(e) => setStudentAnswerInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSubmitAnswer();
                        }}
                        disabled={isSubmitting || timerSecs <= 0}
                        placeholder="Apna uttar likhein (e.g., 22338 or x = 5 or 24 cm)..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                      />
                      <button
                        onClick={() => handleSubmitAnswer()}
                        disabled={isSubmitting || !studentAnswerInput.trim() || timerSecs <= 0}
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
                      >
                        ⚡ Submit Answer (+10 Pts)
                      </button>
                    </div>
                  )
                ) : (
                  <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-center space-y-2">
                    <p className="text-xs text-slate-400">
                      {isGuest
                        ? 'Answer box me answer submit karne ke liye Student account se Sign Up karein.'
                        : 'Aapne abhi Arena join nahi kiya hai. Upar diye button se Arena join karein.'}
                    </p>
                    {isGuest ? (
                      <button
                        onClick={onOpenAuthModal}
                        className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl"
                      >
                        🔑 Sign In / Register
                      </button>
                    ) : (
                      <button
                        onClick={handleJoinBattle}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl"
                      >
                        ⚔️ Join Battle Ground
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Correct Solution Reveal (If round ended or Teacher model answer available) */}
            {(battleState?.status === 'round_ended' || isTeacher) && currentQ?.correctAnswerText && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-emerald-400 block">💡 Model Solution / Sahi Uttar:</span>
                <p className="text-slate-300 font-mono">{currentQ.correctAnswerText}</p>
              </div>
            )}

            {/* LIVE JOSH & CHEER REACTION DOCK */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                <span>🔥 जोश &amp; चीयर:</span>
                <span className="text-slate-500 font-normal">Click to cheer contestants in real-time</span>
              </span>

              <div className="flex items-center gap-1.5">
                {[
                  { emoji: '🔥', label: 'Josh' },
                  { emoji: '⚡', label: 'Speed' },
                  { emoji: '👏', label: 'Bravo' },
                  { emoji: '🧠', label: 'Genius' },
                  { emoji: '💯', label: '100%' },
                ].map((item) => (
                  <button
                    key={item.emoji}
                    onClick={() => handleSendReaction(item.emoji)}
                    className="px-2.5 py-1 bg-slate-800/90 hover:bg-slate-750 active:scale-95 border border-slate-700/80 rounded-xl text-xs font-bold text-slate-200 transition-all flex items-center gap-1 cursor-pointer hover:border-amber-500/50"
                  >
                    <span>{item.emoji}</span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE 10-PLAYER POINT BOARD & LEADERBOARD (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-slate-900/90 border-2 border-slate-800 rounded-3xl shadow-xl space-y-5">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <div>
                  <h3 className="text-base font-extrabold text-white">Live Point Board</h3>
                  <span className="text-[11px] text-amber-400 font-bold">10 Points per Correct Answer</span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {sortedPlayers.length}/10 Students
              </span>
            </div>

            {/* Players List */}
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {sortedPlayers.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Abhi koi student arena me nahi hai. Students join karein!
                </div>
              ) : (
                sortedPlayers.map((player, idx) => {
                  const isCurrent = user && player.id === user.id;
                  const rankIcons = ['🥇', '🥈', '🥉'];
                  const hasAnswered = player.answeredAt !== undefined || player.selectedOptionIndex !== undefined || (player.currentAnswer && player.currentAnswer.trim() !== '');

                  return (
                    <div
                      key={player.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-sky-950/60 border-sky-500/60 ring-1 ring-sky-400/40'
                          : idx === 0
                          ? 'bg-amber-950/30 border-amber-500/40'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        {/* Rank + Avatar + Name */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-mono font-black text-sm w-6 text-center text-slate-400 shrink-0">
                            {idx < 3 ? rankIcons[idx] : `#${idx + 1}`}
                          </span>
                          <span className="text-lg shrink-0">{player.avatar || '🎓'}</span>
                          <div className="min-w-0">
                            <span className="text-xs sm:text-sm font-bold text-white truncate block">
                              {player.name} {isCurrent && '(You)'}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                              <span>{player.grade === 'class9' ? 'Class 9' : 'Class 10'}</span>
                              <span>·</span>
                              <span className="text-amber-400 font-mono">🪙 {player.advaitCoins}</span>
                            </div>
                          </div>
                        </div>

                        {/* Points & Answer Status Badge */}
                        <div className="flex items-center gap-2 shrink-0">
                          {hasAnswered ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                              <span>⚡</span>
                              <span>Answered</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-300/80 border border-amber-500/20 flex items-center gap-1">
                              <span>⏳</span>
                              <span>Solving</span>
                            </span>
                          )}

                          <span className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-xl font-mono font-black text-amber-300 text-sm">
                            {player.points} PTS
                          </span>

                          {/* Sir controls: Kick Student Button ("sir cha he toh kisi bhi student ko hata paye") */}
                          {isTeacher && (
                            <button
                              onClick={() => handleKickStudent(player.id, player.name)}
                              className="px-2 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/80 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                              title="Sir removes student from arena"
                            >
                              🚫 Remove
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Subjective Text Answer Review Row for Sir */}
                      {isTeacher && player.currentAnswer && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                          <span className="text-slate-400 font-mono truncate max-w-[150px]">
                            Ans: "{player.currentAnswer}"
                          </span>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleEvaluateAnswer(player.id, true)}
                              className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                                player.isCorrect === true
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                              }`}
                            >
                              ✓ Correct (+10)
                            </button>
                            <button
                              onClick={() => handleEvaluateAnswer(player.id, false)}
                              className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                                player.isCorrect === false
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900'
                              }`}
                            >
                              ✗ Incorrect
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Winner Announcement Banner */}
            {battleState?.winner && (
              <div className="p-4 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 border-2 border-amber-400 rounded-2xl text-center space-y-1 animate-pulse">
                <span className="text-2xl">🏆</span>
                <h4 className="text-sm font-black text-amber-300 uppercase tracking-wider">
                  BATTLE GROUND CHAMPION!
                </h4>
                <p className="text-xs font-bold text-white">
                  {battleState.winner.name} won with {battleState.winner.points} Points!
                </p>
                <span className="text-xs font-black text-amber-400 font-mono block">
                  🪙 +5 Advait Coins Awarded!
                </span>
              </div>
            )}
          </div>

          {/* 🌟 KBC 5-STAGE ADVAIT COINS PADAAV (मनी ट्री / पड़ाव सीढ़ी) */}
          <div className="p-5 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/70 border-2 border-amber-500/50 rounded-3xl shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-indigo-900/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🪜</span>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 font-mono">
                    KBC PADAAV (पड़ाव सीढ़ी)
                  </h4>
                  <span className="text-[10px] text-slate-400">5-Stage Advait Coins Ladder</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                Safe Zones Active
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              {[
                { stage: 5, coins: 5, label: '🏆 पड़ाव 5: महा-विजेता (CBSE Jackpot)', isJackpot: true },
                { stage: 4, coins: 4, label: '⚡ पड़ाव 4: 4 Advait Coins' },
                { stage: 3, coins: 3, label: '🛡️ पड़ाव 3: सुरक्षित पड़ाव (Safe Zone)', isSafe: true },
                { stage: 2, coins: 2, label: '🔥 पड़ाव 2: 2 Advait Coins' },
                { stage: 1, coins: 1, label: '🎯 पड़ाव 1: 1 Advait Coin' },
              ].map((tier) => {
                const isCurrentStage = (currentQ?.stage || 1) === tier.stage;
                return (
                  <div
                    key={tier.stage}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-xl border transition-all ${
                      isCurrentStage
                        ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 font-black animate-pulse shadow-md'
                        : tier.isJackpot
                        ? 'bg-gradient-to-r from-amber-950/50 to-orange-950/50 border-amber-500/30 text-amber-400 font-bold'
                        : tier.isSafe
                        ? 'bg-indigo-950/50 border-indigo-500/30 text-indigo-300 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isCurrentStage ? 'bg-amber-400 animate-ping' : 'bg-slate-700'}`} />
                      <span>{tier.label}</span>
                    </div>
                    <span className="font-black text-amber-400">
                      {'🪙'.repeat(tier.coins)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SIR (TEACHER) QUESTION CREATION MODAL */}
      {showQuestionModal && isTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>Sir: Post New Battle Question</span>
                  <span className="text-amber-400">📝</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Choose format: Rich Text, Poll (A, B, C, D), or Photo Diagram.
                </span>
              </div>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="text-slate-400 hover:text-white text-lg font-mono"
              >
                ✕
              </button>
            </div>

            {/* Quick 1-Click CBSE Question Presets */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 block">⚡ Quick 1-Click CBSE Question Presets:</span>
              <div className="flex flex-wrap gap-2">
                {PRESET_BATTLE_QUESTIONS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadPreset(preset)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-amber-950/60 border border-slate-700 hover:border-amber-500/50 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-amber-300 transition-colors"
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Format Selector */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setNewQuestionType('poll')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  newQuestionType === 'poll'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                📊 Poll / Multiple Choice (A, B, C, D)
              </button>
              <button
                type="button"
                onClick={() => setNewQuestionType('text')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  newQuestionType === 'text'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                📝 Likh Kar (Text / Formula)
              </button>
              <button
                type="button"
                onClick={() => setNewQuestionType('photo')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  newQuestionType === 'photo'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                📷 Photo / Diagram
              </button>
            </div>

            {/* Question Text Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Question Text / Problem Statement:</label>
              <textarea
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                rows={3}
                placeholder="Type the mathematical question here..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Photo URL Input (If Photo mode) */}
            {newQuestionType === 'photo' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Photo / Diagram Image URL:</label>
                <input
                  type="text"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://example.com/circle_diagram.png"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                />
                <div className="flex gap-2 text-[11px] text-slate-400">
                  <span>Presets:</span>
                  <button
                    type="button"
                    onClick={() => setNewPhotoUrl('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80')}
                    className="underline text-sky-400"
                  >
                    Geometry Tangents
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPhotoUrl('https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80')}
                    className="underline text-sky-400"
                  >
                    Trigonometry Triangles
                  </button>
                </div>
              </div>
            )}

            {/* Poll Options (If Poll mode) */}
            {newQuestionType === 'poll' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300">
                  Options (Radio button se sahi answer select karein):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {newOptions.map((opt, idx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    return (
                      <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-700">
                        <input
                          type="radio"
                          name="correctOptionRadio"
                          checked={newCorrectOptionIndex === idx}
                          onChange={() => setNewCorrectOptionIndex(idx)}
                          className="accent-amber-400 w-4 h-4 cursor-pointer"
                        />
                        <span className="font-mono font-bold text-xs text-amber-400">{letters[idx]}:</span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updated = [...newOptions];
                            updated[idx] = e.target.value;
                            setNewOptions(updated);
                          }}
                          placeholder={`Option ${letters[idx]}`}
                          className="flex-1 bg-transparent text-sm text-white focus:outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Model / Correct Solution */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Expected Correct Answer / Model Solution:</label>
              <input
                type="text"
                value={newCorrectAnswerText}
                onChange={(e) => setNewCorrectAnswerText(e.target.value)}
                placeholder="e.g. 2 or k = 2 or 22338"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowQuestionModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublishQuestion}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg cursor-pointer"
              >
                🚀 Publish Question to Arena (60s Timer Ready)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WINNER CELEBRATION MODAL */}
      {winnerCelebrated && battleState?.winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-gradient-to-b from-slate-900 via-amber-950/60 to-slate-900 border-2 border-amber-400 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl relative">
            <span className="text-5xl animate-bounce block">🏆</span>
            <div className="space-y-1">
              <span className="text-xs font-mono font-black text-amber-400 uppercase tracking-widest">
                CBSE BATTLE GROUND CHAMPION
              </span>
              <h3 className="text-2xl font-black text-white">
                {battleState.winner.name}
              </h3>
              <p className="text-sm text-slate-300 font-mono">
                Total Score: <strong className="text-amber-300 font-bold">{battleState.winner.points} Points</strong>
              </p>
            </div>

            {/* 5 Advait Coins Reward Badge */}
            <div className="p-4 bg-amber-500/20 border border-amber-400 rounded-2xl space-y-1">
              <div className="text-3xl">🪙🪙🪙🪙🪙</div>
              <span className="text-sm font-black text-amber-300 uppercase tracking-wider block">
                +5 ADVAIT COINS AWARDED!
              </span>
              <span className="text-xs text-slate-300">
                Congratulations! 5 Advait Coins have been added to the winner's account!
              </span>
            </div>

            <button
              onClick={() => setWinnerCelebrated(false)}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg cursor-pointer w-full"
            >
              Continue Battle Arena
            </button>
          </div>
        </div>
      )}

      {/* 🌟 KBC AUDIENCE POLL MODAL (जनता की राय) */}
      {showAudiencePollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-gradient-to-b from-slate-900 via-indigo-950/90 to-slate-900 border-2 border-sky-400 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-indigo-900/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <div className="text-left">
                  <h3 className="text-base font-black text-white uppercase tracking-wider font-mono">
                    AUDIENCE POLL (जनता की राय)
                  </h3>
                  <span className="text-[11px] text-sky-400">CBSE Classroom Live Consensus</span>
                </div>
              </div>
              <button
                onClick={() => setShowAudiencePollModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              कक्षा और दर्शकों का मत नीचे दिए गए प्रतिशत ग्राफ के अनुसार है:
            </p>

            {/* Vertical 4-Bar Chart */}
            <div className="grid grid-cols-4 gap-3 h-48 items-end p-4 bg-slate-950/90 rounded-2xl border border-slate-800">
              {[
                { label: 'A', votes: pollVoteCounts[0], fallback: currentQ?.correctOptionIndex === 0 ? 65 : 12 },
                { label: 'B', votes: pollVoteCounts[1], fallback: currentQ?.correctOptionIndex === 1 ? 68 : 11 },
                { label: 'C', votes: pollVoteCounts[2], fallback: currentQ?.correctOptionIndex === 2 ? 64 : 14 },
                { label: 'D', votes: pollVoteCounts[3], fallback: currentQ?.correctOptionIndex === 3 ? 70 : 8 },
              ].map((item, idx) => {
                const totalVotes = pollVoteCounts.reduce((a, b) => a + b, 0);
                const percent =
                  totalVotes > 0 ? Math.round((item.votes / totalVotes) * 100) : item.fallback;
                const isLeading =
                  (currentQ?.correctOptionIndex !== undefined && currentQ.correctOptionIndex === idx) ||
                  percent >= 50;

                return (
                  <div key={item.label} className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="font-mono font-black text-xs text-sky-300">{percent}%</span>
                    <div className="w-full bg-slate-900 rounded-t-xl overflow-hidden flex flex-col justify-end h-32 border border-slate-800">
                      <div
                        style={{ height: `${percent}%` }}
                        className={`w-full rounded-t-xl transition-all duration-700 ${
                          isLeading
                            ? 'bg-gradient-to-t from-emerald-600 via-sky-400 to-amber-300 shadow-lg shadow-sky-400/50'
                            : 'bg-gradient-to-t from-slate-700 to-indigo-500'
                        }`}
                      />
                    </div>
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-black text-xs border ${
                        isLeading
                          ? 'bg-amber-400 text-slate-950 border-amber-300'
                          : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-indigo-950/50 border border-indigo-800/80 rounded-xl text-left text-xs space-y-1">
              <span className="font-bold text-amber-300 block">📢 कंप्यूटर जी का निष्कर्ष:</span>
              <p className="text-slate-300">
                दर्शकों का स्पष्ट बहुमत विकल्प{' '}
                <strong className="text-emerald-400 font-bold">
                  {['A', 'B', 'C', 'D'][currentQ?.correctOptionIndex ?? 1]}
                </strong>{' '}
                के साथ है।
              </p>
            </div>

            <button
              onClick={() => setShowAudiencePollModal(false)}
              className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg cursor-pointer"
            >
              वापस हॉटसीट पर जाएं (Back to Hotseat)
            </button>
          </div>
        </div>
      )}

      {/* 🌟 KBC EXPERT ADVICE MODAL (हर्ष सर की सलाह) */}
      {showExpertAdviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-gradient-to-b from-slate-900 via-amber-950/60 to-slate-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/80 flex items-center justify-center text-xl font-bold">
                  👑
                </span>
                <div className="text-left">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                    HARSH SIR'S EXPERT ADVICE
                  </h3>
                  <span className="text-[10px] text-amber-300">CBSE Mathematics Faculty Clue</span>
                </div>
              </div>
              <button
                onClick={() => setShowExpertAdviceModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-amber-500/40 rounded-2xl text-left space-y-2">
              <span className="text-xs font-bold text-amber-400 block font-mono">
                💡 हर्ष सर का वैचारिक सूत्र (Conceptual Formula Tip):
              </span>
              <p className="text-sm text-slate-200 font-mono leading-relaxed bg-amber-950/20 p-3 rounded-xl border border-amber-900/60">
                "{currentQ?.expertHint || 'Apply standard CBSE NCERT theorem: always simplify fractions first and check discriminant or tangent equality!'}"
              </p>
            </div>

            <div className="text-xs text-slate-400 italic">
              "ध्यानपूर्वक हल करें और सही विकल्प को लॉक करें। शुभकामनाएँ!" — Harsh Sir
            </div>

            <button
              onClick={() => setShowExpertAdviceModal(false)}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
            >
              धन्यवाद सर! लॉक करें (Understood, Return to Battle)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
