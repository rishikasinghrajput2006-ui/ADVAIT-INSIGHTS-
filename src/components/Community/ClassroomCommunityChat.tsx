import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { GradeLevel } from '../../types/index.ts';

export interface ChatAttachment {
  name: string;
  type: 'image' | 'file';
  mimeType: string;
  url: string;
  size?: number;
}

export interface ChatMessageItem {
  id: string;
  senderName: string;
  senderEmail: string;
  senderRole: 'teacher' | 'student';
  grade?: string;
  batch?: string;
  channel?: 'general' | 'doubts' | 'announcements' | 'pyq';
  text: string;
  timestamp: string;
  isTeacher: boolean;
  avatarIcon: string;
  badgeLabel: string;
  reactions?: Record<string, number>;
  reactedUsers?: Record<string, string[]>;
  isPinned?: boolean;
  chapterTag?: string;
  isResolved?: boolean;
  attachments?: ChatAttachment[];
}

interface ClassroomCommunityChatProps {
  grade: GradeLevel;
  onOpenAIGuru?: () => void;
  onCloseFullPage?: () => void;
  onOpenTeacherAuth?: () => void;
  defaultFullPage?: boolean;
}

interface RealUserSession {
  clientId: string;
  name: string;
  role: string;
  grade?: string;
  currentTab?: string;
  isTeacher: boolean;
}

const MATH_SYMBOLS = ['√', '²', '³', '±', 'π', 'θ', 'α', 'β', 'Δ', '≤', '≥', '≠', '×', '÷', '°', 'b²-4ac'];

const CHAPTER_OPTIONS = [
  'General Discussion',
  'Real Numbers',
  'Polynomials',
  'Pair of Linear Equations',
  'Quadratic Equations',
  'Arithmetic Progressions',
  'Triangles',
  'Coordinate Geometry',
  'Introduction to Trigonometry',
  'Circles',
  'Surface Areas & Volumes',
  'Statistics',
  'Probability',
];

const QUICK_PROMPTS = [
  'Sir, please explain Section Formula in Coordinate Geometry! 📐',
  'Is √5 irrational question guaranteed for 3 marks in Board Exam? ✍️',
  'Quadratic discriminant: D = b² - 4ac real roots shortcut? ⚡',
  'When is the next YouTube live doubt session starting? 🔴',
  'Can someone share the converse of Basic Proportionality Theorem? 💡',
];

const TEACHER_SHORTCUTS = [
  '👑 Remember: HCF(a, b) × LCM(a, b) = a × b is strictly valid for 2 numbers only!',
  '👑 In CBSE Boards, always write Given, To Prove, Construction, and Proof with neat figure!',
  '👑 Check D = b² - 4ac: If D < 0, write "No Real Roots" and do not factorize further.',
  '👑 Live Class starts sharp at 7:00 PM today on YouTube @AdvaitInsights_AI. Join on time!',
];

export const ClassroomCommunityChat: React.FC<ClassroomCommunityChatProps> = ({
  grade,
  onOpenAIGuru,
  onCloseFullPage,
  onOpenTeacherAuth,
  defaultFullPage = false,
}) => {
  const { user, isTeacher } = useAuth();
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'general' | 'doubts' | 'announcements' | 'pyq'>('all');
  const [selectedChapter, setSelectedChapter] = useState('General Discussion');
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState(false);
  const [aiGeneratingId, setAiGeneratingId] = useState<string | null>(null);
  const [showMathSymbols, setShowMathSymbols] = useState(false);
  const [autoAskAI, setAutoAskAI] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // REAL LIVE PRESENCE STATE (Tumhare wale nahi, real live sessions only!)
  const [clientId] = useState(() => `client_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [activeUsersRoster, setActiveUsersRoster] = useState<RealUserSession[]>([]);
  const [showRosterModal, setShowRosterModal] = useState(false);

  // Dedicated Full Page View State (Chat ek new page me khule)
  const [isFullPage, setIsFullPage] = useState<boolean>(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      return defaultFullPage || p.get('fullpage') === 'true' || p.get('tab') === 'chat';
    } catch {
      return defaultFullPage;
    }
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Attachments State (Photos, PDFs, Hand-written Notes, Solution Sheets)
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [selectedZoomImage, setSelectedZoomImage] = useState<string | null>(null);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, forceType?: 'image' | 'file') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 15 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 15MB limit.`);
        return;
      }
      const isImg = forceType === 'image' || file.type.startsWith('image/');
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPendingAttachments((prev) => [
            ...prev,
            {
              name: file.name,
              type: isImg ? 'image' : 'file',
              mimeType: file.type || (isImg ? 'image/jpeg' : 'application/octet-stream'),
              url: reader.result as string,
              size: file.size,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removePendingAttachment = (index: number) => {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              setPendingAttachments((prev) => [
                ...prev,
                {
                  name: `doubt-photo-${Date.now().toString().slice(-4)}.png`,
                  type: 'image',
                  mimeType: file.type,
                  url: reader.result as string,
                  size: file.size,
                },
              ]);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  // Persistent Unique User ID for Like/Unlike Tracking
  const getOrCreateUserId = (): string => {
    if (user?.id) return user.id;
    if (user?.emailOrPhone) return user.emailOrPhone;
    try {
      let anonId = localStorage.getItem('advait_chat_user_id');
      if (!anonId) {
        anonId = `advaitian_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        localStorage.setItem('advait_chat_user_id', anonId);
      }
      return anonId;
    } catch {
      return 'advaitian_guest';
    }
  };

  const currentUserId = getOrCreateUserId();

  // REAL PRESENCE HEARTBEAT (Runs every 5s with actual connected users)
  const sendPresenceHeartbeat = async () => {
    try {
      const res = await fetch('/api/presence/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          userId: currentUserId,
          userName: isTeacher ? (user?.name || 'Harsh Sir (Faculty Lead)') : (user?.name || 'Advait Student'),
          userRole: isTeacher ? 'teacher' : 'student',
          grade,
          currentTab: 'chat',
        }),
      });
      const data = await res.json();
      if (data.onlineCount !== undefined) {
        setOnlineCount(data.onlineCount);
      }
      if (data.users) {
        setActiveUsersRoster(data.users);
      }
    } catch (e) {
      // presence error fallback
    }
  };

  useEffect(() => {
    sendPresenceHeartbeat();
    const presenceInterval = setInterval(sendPresenceHeartbeat, 5000);
    return () => clearInterval(presenceInterval);
  }, [isTeacher, user?.name, grade]);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/chat/messages');
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.warn('Failed to fetch chat messages:', e);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const playNotificationSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio not supported
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && pendingAttachments.length === 0) || sending) return;

    const trimmed = inputText.trim();
    setSending(true);

    // Strictly enforce real identity! If user is NOT authenticated as a teacher,
    // they can NEVER post as Harsh Sir or have teacher crown!
    const senderName = isTeacher
      ? (user?.name || 'Harsh Sir (Faculty Lead)')
      : (user?.name || 'Advait Student');
    const senderEmail = isTeacher
      ? 'Advaitinsights1927@gmail.com'
      : (user?.emailOrPhone || 'student@advait.edu');
    const senderRole = isTeacher ? 'teacher' : 'student';
    const channelToUse = selectedChannel === 'all' ? (trimmed.includes('?') ? 'doubts' : 'general') : selectedChannel;

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName,
          senderEmail,
          senderRole,
          isTeacherVerified: isTeacher,
          text: trimmed,
          grade,
          channel: channelToUse,
          chapterTag: selectedChapter !== 'General Discussion' ? selectedChapter : undefined,
          attachments: pendingAttachments.length > 0 ? pendingAttachments : undefined,
        }),
      });

      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
        setInputText('');
        setPendingAttachments([]);
        playNotificationSound();

        if (autoAskAI || (trimmed.endsWith('?') && !isTeacher)) {
          triggerAIGuruInChat(trimmed, selectedChapter);
        }
      }
    } catch (err) {
      console.error('Send error:', err);
    } finally {
      setSending(false);
    }
  };

  const triggerAIGuruInChat = async (questionText: string, chapterTag?: string) => {
    setAiGeneratingId('new');
    try {
      const res = await fetch('/api/chat/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          chapterTag: chapterTag || 'Classroom Doubt',
          grade,
        }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
        playNotificationSound();
      }
    } catch (err) {
      console.error('AI Guru in chat error:', err);
    } finally {
      setAiGeneratingId(null);
    }
  };

  // ONE-CLICK LIKE / UNLIKE HANDLER (1 user can like only once; second click removes like)
  const handleReact = async (messageId: string, emoji: string) => {
    try {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== messageId) return m;
          const currentReactions = { ...(m.reactions || {}) };
          const currentReactedUsers = { ...(m.reactedUsers || {}) };
          const userList = currentReactedUsers[emoji] ? [...currentReactedUsers[emoji]] : [];
          const idx = userList.indexOf(currentUserId);

          if (idx > -1) {
            userList.splice(idx, 1);
            currentReactions[emoji] = Math.max(0, (currentReactions[emoji] || 1) - 1);
          } else {
            userList.push(currentUserId);
            currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
          }

          currentReactedUsers[emoji] = userList;
          return {
            ...m,
            reactions: currentReactions,
            reactedUsers: currentReactedUsers,
          };
        })
      );

      const res = await fetch(`/api/chat/messages/${messageId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji, userIdentifier: currentUserId }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => prev.map((m) => (m.id === messageId ? data.message : m)));
      }
    } catch (err) {
      console.error('Reaction error:', err);
      fetchMessages();
    }
  };

  // TEACHER ONLY: Pin / Unpin Announcements
  const handleTogglePin = async (messageId: string) => {
    if (!isTeacher) return;
    try {
      const res = await fetch(`/api/chat/messages/${messageId}/pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTeacher: true }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => prev.map((m) => (m.id === messageId ? data.message : m)));
      }
    } catch (err) {
      console.error('Pin error:', err);
    }
  };

  // TEACHER ONLY: Mark doubt as solved
  const handleToggleResolve = async (messageId: string) => {
    if (!isTeacher) {
      return;
    }
    try {
      const res = await fetch(`/api/chat/messages/${messageId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isTeacher: true,
          teacherName: user?.name || 'Harsh Sir (Faculty Lead)',
        }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => prev.map((m) => (m.id === messageId ? data.message : m)));
      }
    } catch (err) {
      console.error('Resolve error:', err);
    }
  };

  // TEACHER ONLY: Delete message
  const handleDeleteMessage = async (messageId: string) => {
    if (!isTeacher) return;
    if (!confirm('Are you sure you want to remove this message as Faculty Lead?')) return;
    try {
      const res = await fetch(`/api/chat/messages/${messageId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTeacher: true }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleInsertSymbol = (sym: string) => {
    setInputText((prev) => prev + sym);
    inputRef.current?.focus();
  };

  const handleQuickPromptClick = (prompt: string) => {
    setInputText(prompt);
    inputRef.current?.focus();
  };

  // Filter messages
  const filteredMessages = messages.filter((m) => {
    if (selectedChannel !== 'all') {
      if (selectedChannel === 'announcements' && !m.isTeacher && m.channel !== 'announcements') return false;
      if (selectedChannel === 'doubts' && m.channel !== 'doubts' && !m.text.includes('?')) return false;
      if (selectedChannel === 'pyq' && m.channel !== 'pyq') return false;
      if (selectedChannel === 'general' && m.channel !== 'general' && m.channel !== undefined) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = m.text.toLowerCase().includes(q);
      const matchSender = m.senderName.toLowerCase().includes(q);
      const matchChapter = m.chapterTag?.toLowerCase().includes(q);
      return matchText || matchSender || matchChapter;
    }
    return true;
  });

  const pinnedMessages = messages.filter((m) => m.isPinned);

  return (
    <div
      className={
        isFullPage
          ? 'fixed inset-0 z-50 bg-slate-950 flex flex-col h-screen w-screen overflow-hidden p-2 sm:p-4'
          : 'space-y-4'
      }
    >
      {/* Real Live Attendance Roster Modal */}
      {showRosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="font-heading font-bold text-white text-base">
                  Real-Time Active Users ({activeUsersRoster.length})
                </h3>
              </div>
              <button
                onClick={() => setShowRosterModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-400">
              This list reflects genuine connected browser sessions active in the last 12 seconds.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {activeUsersRoster.map((u, i) => (
                <div
                  key={u.clientId || i}
                  className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{u.isTeacher ? '👑' : '🎓'}</span>
                    <div>
                      <span className="font-bold text-white block">
                        {u.name} {u.clientId === clientId && '(You)'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Active in {u.currentTab || 'Live Chat'}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      u.isTeacher
                        ? 'bg-amber-950 text-amber-300 border border-amber-600'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                    }`}
                  >
                    {u.isTeacher ? 'Teacher 👑' : 'Student 🟢'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top Banner Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border border-sky-800/50 p-4 sm:p-5 rounded-2xl shadow-xl shrink-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-amber-500 flex items-center justify-center text-xl shadow-lg ring-2 ring-sky-400/30 shrink-0">
              💬
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                  Advait Live Classroom
                </span>

                {/* Real Live Online Count (Clickable to view real users) */}
                <button
                  onClick={() => setShowRosterModal(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/50 text-[11px] font-mono font-bold transition-colors cursor-pointer"
                  title="Click to view genuine active users online right now"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {onlineCount} {onlineCount === 1 ? 'Live User (You) 🟢' : 'Live Users 🟢'}
                  </span>
                </button>

                <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/40">
                  {grade === 'class10' ? 'Class 10 CBSE' : 'Class 9 Foundation'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white font-heading mt-0.5">
                Classroom Discussion &amp; Doubt Hub
              </h2>
            </div>
          </div>

          {/* Quick controls: Full Page Mode, Open in New Tab, Sound, Refresh */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
            <a
              href="?tab=live"
              className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
              title="Go to Live Video Classroom"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>🔴 Live Video Page</span>
            </a>

            <a
              href="?tab=chat&fullpage=true"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              title="Open Chat in a New Browser Window / Tab"
            >
              <span>↗ Open in New Page</span>
            </a>

            <button
              onClick={() => {
                if (isFullPage && onCloseFullPage) {
                  onCloseFullPage();
                }
                setIsFullPage((prev) => !prev);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                isFullPage
                  ? 'bg-sky-500 text-white border-sky-400 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-sky-300 border-slate-700'
              }`}
              title={isFullPage ? 'Exit Full Page View' : 'Open in Dedicated Full Page Mode'}
            >
              <span>{isFullPage ? '✕ Exit Full Page' : '⛶ Full Page Mode'}</span>
            </button>

            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-mono border transition-all flex items-center gap-1 cursor-pointer ${
                soundEnabled
                  ? 'bg-slate-800 text-sky-300 border-slate-700'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
              title={soundEnabled ? 'Mute notification sound' : 'Enable notification sound'}
            >
              <span>{soundEnabled ? '🔔' : '🔕'}</span>
            </button>

            <button
              onClick={fetchMessages}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
              title="Refresh Messages"
            >
              <span>🔄</span>
            </button>

            {onOpenAIGuru && (
              <button
                onClick={onOpenAIGuru}
                className="px-3 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>🤖 Ask AI Guru</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TEACHER EXCLUSIVE COMMAND BAR OR STUDENT IDENTITY BANNER */}
      {isTeacher ? (
        <div className="p-3.5 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-2 border-amber-500 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center text-xl font-black shadow-lg ring-2 ring-amber-300">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-amber-300 text-sm">
                  Faculty Lead Active • {user?.name || 'Harsh Sir'}
                </span>
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.2 rounded-full font-mono uppercase">
                  Verified Educator
                </span>
              </div>
              <p className="text-[11px] text-amber-200/90 mt-0.5">
                Exclusive Teacher Powers: You are the ONLY one who can mark doubts as <strong>Solved (✓)</strong>, pin notices (📌), and moderate messages.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowRosterModal(true)}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>👥 Real Live Attendance ({onlineCount})</span>
          </button>
        </div>
      ) : (
        <div className="p-2.5 px-4 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sky-400 font-bold">🎓 Student Mode</span>
            <span className="text-slate-300">({user?.name || 'Advaitian Guest'})</span>
            <span className="hidden sm:inline text-slate-500">• Doubts can only be marked as Solved by Faculty</span>
          </div>

          <button
            onClick={() => {
              if (onOpenTeacherAuth) {
                onOpenTeacherAuth();
              } else {
                window.dispatchEvent(new CustomEvent('open-teacher-auth'));
              }
            }}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline font-mono cursor-pointer flex items-center gap-1"
          >
            <span>👑 Are you Harsh Sir? Faculty Login</span>
          </button>
        </div>
      )}

      {/* Pinned Announcements Ribbon */}
      {pinnedMessages.length > 0 && (
        <div className="space-y-2 shrink-0">
          {pinnedMessages.map((pin) => (
            <div
              key={`pin-${pin.id}`}
              className="p-3 bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/40 border border-amber-500/60 rounded-xl flex items-start gap-3 shadow-lg"
            >
              <span className="text-base text-amber-400 shrink-0">📌</span>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span>Pinned Announcement • {pin.senderName}</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                      Faculty Bulletin
                    </span>
                  </span>
                  <span className="text-[10px] text-amber-400/80 font-mono">{pin.timestamp}</span>
                </div>
                <p className="text-amber-100 font-medium mt-0.5 leading-relaxed">{pin.text}</p>
              </div>
              {isTeacher && (
                <button
                  onClick={() => handleTogglePin(pin.id)}
                  className="text-[11px] text-amber-400 hover:text-amber-200 underline font-mono shrink-0 cursor-pointer"
                  title="Unpin message"
                >
                  Unpin
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main Chat Box Container */}
      <div
        className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col ${
          isFullPage ? 'flex-1 min-h-0' : 'h-[650px]'
        }`}
      >
        {/* Navigation Toolbar: Channels & Search */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs shrink-0">
          {/* Channel Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setSelectedChannel('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedChannel === 'all'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              💬 All ({messages.length})
            </button>
            <button
              onClick={() => setSelectedChannel('doubts')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                selectedChannel === 'doubts'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <span>❓ Math Doubts</span>
            </button>
            <button
              onClick={() => setSelectedChannel('announcements')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                selectedChannel === 'announcements'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <span>👑 Teacher Bulletin</span>
            </button>
            <button
              onClick={() => setSelectedChannel('pyq')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                selectedChannel === 'pyq'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-400 hover:text-purple-300'
              }`}
            >
              <span>⚡ PYQ Challenges</span>
            </button>
          </div>

          {/* Search Box & Single-Like Help Tooltip */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doubts or chapter..."
                className="w-full sm:w-52 px-3 py-1.5 pl-8 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <span className="absolute left-2.5 top-2 text-slate-500 text-xs">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1.5 text-slate-500 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages Stream Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <span className="text-4xl">💬</span>
              <p className="text-sm font-semibold text-slate-300">No messages found in this channel.</p>
              <p className="text-xs text-slate-500">
                Be the first to post a math doubt or start a discussion!
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isMsgTeacher = msg.isTeacher;
              const isAIGuru = msg.avatarIcon === '🤖' || msg.senderName.includes('AI Guru');

              return (
                <div
                  key={msg.id}
                  className={`group relative flex gap-3.5 items-start transition-all rounded-2xl p-4 ${
                    isMsgTeacher
                      ? isAIGuru
                        ? 'bg-gradient-to-r from-sky-950/50 via-slate-900 to-indigo-950/40 border-2 border-sky-500/50 shadow-md'
                        : 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/60 shadow-md ring-2 ring-amber-500/30'
                      : 'bg-slate-950/80 border border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  {/* Sender Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl font-bold shadow-md ${
                        isAIGuru
                          ? 'bg-gradient-to-tr from-sky-400 to-indigo-500 text-white ring-2 ring-sky-400/50'
                          : isMsgTeacher
                          ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 font-black'
                          : 'bg-slate-800 text-sky-400 border border-slate-700'
                      }`}
                    >
                      {msg.avatarIcon || (isMsgTeacher ? '👑' : '🎓')}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 space-y-1.5">
                    {/* Header line */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-black flex items-center gap-1 ${
                            isAIGuru
                              ? 'text-sky-300'
                              : isMsgTeacher
                              ? 'text-amber-400 font-black'
                              : 'text-white'
                          }`}
                        >
                          {isMsgTeacher && !isAIGuru && <span>👑</span>}
                          {isAIGuru && <span>✨</span>}
                          <span>{msg.senderName}</span>
                        </span>

                        <span
                          className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                            isAIGuru
                              ? 'bg-sky-950 text-sky-300 border-sky-500/60'
                              : isMsgTeacher
                              ? 'bg-amber-950 text-amber-300 border-amber-500/70 shadow-sm'
                              : 'bg-slate-900 text-slate-400 border-slate-700'
                          }`}
                        >
                          {msg.badgeLabel}
                        </span>

                        {msg.chapterTag && (
                          <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-700/60 px-2 py-0.5 rounded-md">
                            📖 {msg.chapterTag}
                          </span>
                        )}

                        {msg.isResolved && (
                          <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/80 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                            <span>✓</span> Solved by Faculty 👑
                          </span>
                        )}

                        {msg.isPinned && (
                          <span className="text-[10px] font-mono bg-amber-900/60 text-amber-300 border border-amber-500/60 px-2 py-0.5 rounded-md">
                            📌 Pinned
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-slate-500">
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Chat Text */}
                    <div
                      className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans ${
                        isAIGuru
                          ? 'text-sky-100 bg-sky-950/30 p-3 rounded-xl border border-sky-800/40 font-mono text-xs'
                          : isMsgTeacher
                          ? 'text-amber-100 font-medium'
                          : 'text-slate-200'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Attached Photos & Files Rendering */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-2.5">
                        {msg.attachments.map((att, attIdx) => {
                          if (att.type === 'image') {
                            return (
                              <div
                                key={attIdx}
                                className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-900/90 cursor-pointer shadow-md hover:border-sky-400 transition-all max-w-[280px] sm:max-w-xs"
                                onClick={() => setSelectedZoomImage(att.url)}
                                title="Click to view high-resolution photo"
                              >
                                <img
                                  src={att.url}
                                  alt={att.name}
                                  className="max-h-52 w-auto object-cover rounded-lg group-hover:scale-[1.02] transition-transform"
                                />
                                <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold pointer-events-none">
                                  <span>🔍 Click to Zoom</span>
                                </div>
                                <div className="p-1.5 bg-slate-950/95 text-[10px] text-slate-300 font-mono truncate flex items-center justify-between border-t border-slate-800">
                                  <span className="truncate max-w-[170px]">{att.name}</span>
                                  {att.size && <span className="text-slate-400 shrink-0 ml-1">{formatFileSize(att.size)}</span>}
                                </div>
                              </div>
                            );
                          }

                          return (
                            <a
                              key={attIdx}
                              href={att.url}
                              download={att.name}
                              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-400 transition-all text-xs text-sky-300 max-w-xs shadow-sm group"
                              title={`Download ${att.name}`}
                            >
                              <div className="w-9 h-9 rounded-lg bg-sky-950 border border-sky-800/80 flex items-center justify-center text-lg shrink-0 group-hover:bg-sky-900 transition-colors">
                                📄
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="font-bold text-white block truncate text-xs">{att.name}</span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {att.size ? formatFileSize(att.size) : 'File'} • Download ⬇
                                </span>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    )}

                    {/* Reactions & Action Toolbar */}
                    <div className="pt-1.5 flex items-center justify-between gap-2 flex-wrap text-xs">
                      {/* Emoji Reactions List: ONE-CLICK LIKE / UNLIKE */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {['👍', '💡', '🔥', '👑'].map((emoji) => {
                          const count = msg.reactions?.[emoji] || 0;
                          const hasLiked = Boolean(msg.reactedUsers?.[emoji]?.includes(currentUserId));

                          return (
                            <button
                              key={emoji}
                              onClick={() => handleReact(msg.id, emoji)}
                              className={`px-2.5 py-1 rounded-xl border text-[11px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                                hasLiked
                                  ? 'bg-sky-500/20 text-sky-300 border-sky-400 ring-1 ring-sky-400/50 shadow-sm font-bold'
                                  : count > 0
                                  ? 'bg-slate-800 text-white border-slate-700 shadow-sm hover:border-sky-500'
                                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                              }`}
                              title={
                                hasLiked
                                  ? `You liked with ${emoji}. Click again to remove like (Unlike)`
                                  : `Like with ${emoji} (1 like allowed per user)`
                              }
                            >
                              <span>{emoji}</span>
                              {count > 0 && <span className="font-bold">{count}</span>}
                              {hasLiked && (
                                <span className="text-[9px] text-sky-400 font-semibold">• Liked</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Right Action buttons */}
                      <div className="flex items-center gap-2">
                        {/* Instant AI Guru explanation trigger for student doubts */}
                        {!isMsgTeacher && !isAIGuru && (
                          <button
                            onClick={() => triggerAIGuruInChat(msg.text, msg.chapterTag)}
                            disabled={aiGeneratingId === msg.id}
                            className="px-2.5 py-1 bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-700/60 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                            title="Get AI Guru Step-by-Step Answer in Chat"
                          >
                            <span>🤖</span>
                            <span>{aiGeneratingId === msg.id ? 'Thinking...' : 'AI Guru Answer'}</span>
                          </button>
                        )}

                        {/* STRICTLY TEACHER ONLY: Mark doubt as solved */}
                        {isTeacher ? (
                          <button
                            onClick={() => handleToggleResolve(msg.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 shadow-sm ${
                              msg.isResolved
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-500 ring-1 ring-emerald-500/40'
                                : 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border-amber-600/70'
                            }`}
                            title="Faculty Lead: Click to mark this doubt as officially Solved / Unsolved"
                          >
                            <span>👑</span>
                            <span>{msg.isResolved ? '✓ Solved by Teacher' : 'Mark as Solved'}</span>
                          </button>
                        ) : msg.isResolved ? (
                          <span className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-600/60 flex items-center gap-1">
                            <span>✓ Solved by Faculty</span>
                          </span>
                        ) : null}

                        {/* STRICTLY TEACHER ONLY: Pin toggle */}
                        {isTeacher && (
                          <button
                            onClick={() => handleTogglePin(msg.id)}
                            className="p-1 text-slate-400 hover:text-amber-400 rounded transition-colors cursor-pointer"
                            title={msg.isPinned ? 'Unpin message' : 'Pin to top of classroom'}
                          >
                            📌
                          </button>
                        )}

                        {/* STRICTLY TEACHER ONLY: Delete message */}
                        {isTeacher && (
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1 text-slate-400 hover:text-red-400 rounded transition-colors cursor-pointer text-xs"
                            title="Faculty Lead: Delete message"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* AI Guru Generating indicator */}
          {aiGeneratingId && (
            <div className="flex gap-3 items-center p-3.5 bg-sky-950/40 border border-sky-800/50 rounded-2xl animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <span className="text-xs font-bold text-sky-300 block">
                  AI Guru is formulating step-by-step CBSE explanation...
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Verifying NCERT formula &amp; exam presentation
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Teacher Quick Shortcuts Bar (Only visible to verified teacher) */}
        {isTeacher && (
          <div className="p-2.5 bg-amber-950/40 border-t border-amber-900/60 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0">
            <span className="text-amber-400 font-mono text-[10px] font-bold shrink-0">
              👑 Faculty Quick Advice:
            </span>
            {TEACHER_SHORTCUTS.map((sc, i) => (
              <button
                key={i}
                onClick={() => setInputText(sc)}
                className="px-2.5 py-1 bg-amber-900/40 hover:bg-amber-900/70 text-amber-200 border border-amber-600/50 rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {sc.slice(0, 45)}...
              </button>
            ))}
          </div>
        )}

        {/* Quick Math Doubts Chips */}
        <div className="p-2 bg-slate-950/90 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0">
          <span className="text-slate-400 font-mono text-[10px] shrink-0">Quick Doubts:</span>
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleQuickPromptClick(prompt)}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Math Symbols Inserter Toolbar */}
        {showMathSymbols && (
          <div className="p-2 bg-slate-950 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
            <span className="text-[10px] font-mono text-sky-400 font-bold shrink-0">
              Insert Symbol:
            </span>
            {MATH_SYMBOLS.map((sym) => (
              <button
                key={sym}
                onClick={() => handleInsertSymbol(sym)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-sky-600 hover:text-white text-sky-300 font-mono font-bold rounded-lg border border-slate-800 transition-colors cursor-pointer shrink-0"
              >
                {sym}
              </button>
            ))}
          </div>
        )}

        {/* Chat Input & Controller Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 space-y-2.5 shrink-0">
          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileChange(e, 'image')}
          />
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.doc,.docx,.txt,.zip,image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileChange(e)}
          />

          <div className="flex items-center justify-between gap-3 text-xs flex-wrap">
            {/* Chapter Tag Selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono text-[10px]">Tag Chapter:</span>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-sky-500"
              >
                {CHAPTER_OPTIONS.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>
            </div>

            {/* Media Upload Buttons, Symbols toggle & Auto-AI reply toggle */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Photo Upload Button */}
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono border bg-slate-900 hover:bg-sky-950 text-sky-400 border-sky-800/80 hover:border-sky-500 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                title="Send a photo or screenshot of math problem/doubt"
              >
                <span>📷</span>
                <span>Send Photo</span>
              </button>

              {/* Document / File Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono border bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                title="Attach PDF, notes worksheet, or document file"
              >
                <span>📎</span>
                <span>Attach File</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMathSymbols((prev) => !prev)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all cursor-pointer ${
                  showMathSymbols
                    ? 'bg-sky-500/20 text-sky-300 border-sky-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                ∑ Math Symbols {showMathSymbols ? '▲' : '▼'}
              </button>

              <label className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoAskAI}
                  onChange={(e) => setAutoAskAI(e.target.checked)}
                  className="rounded border-slate-700 text-sky-500 focus:ring-0"
                />
                <span className="text-sky-400">✨ Auto-AI Guru</span>
              </label>
            </div>
          </div>

          {/* Pending Attachments Preview Strip */}
          {pendingAttachments.length > 0 && (
            <div className="p-2.5 bg-slate-900/90 border border-sky-800/60 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-sky-400 font-mono font-bold">
                <span>📎 Ready to send ({pendingAttachments.length} file{pendingAttachments.length > 1 ? 's' : ''}):</span>
                <button
                  type="button"
                  onClick={() => setPendingAttachments([])}
                  className="text-slate-400 hover:text-red-400 text-[10px] cursor-pointer"
                >
                  Clear all
                </button>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {pendingAttachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="relative flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-700 rounded-lg shrink-0 max-w-xs"
                  >
                    {att.type === 'image' ? (
                      <img
                        src={att.url}
                        alt="preview"
                        className="w-10 h-10 object-cover rounded border border-slate-800"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-sky-950 border border-sky-800 flex items-center justify-center text-base">
                        📄
                      </div>
                    )}
                    <div className="min-w-0 pr-5">
                      <span className="text-xs text-white font-medium block truncate max-w-[140px]">{att.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{formatFileSize(att.size)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePendingAttachment(idx)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-400 text-xs flex items-center justify-center cursor-pointer transition-colors"
                      title="Remove attachment"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form and Send */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onPaste={handlePaste}
                placeholder={
                  isTeacher
                    ? '👑 Broadcast verified formula advice, exam notices, or solution steps...'
                    : 'Type doubt, question, or paste screenshot (Ctrl+V)...'
                }
                className={`w-full px-4 py-3 bg-slate-900 border rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none ${
                  isTeacher
                    ? 'border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 ring-1 ring-amber-500/30'
                    : 'border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={(!inputText.trim() && pendingAttachments.length === 0) || sending}
              className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 ${
                isTeacher
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black shadow-amber-500/20'
                  : 'bg-sky-500 hover:bg-sky-400 text-white'
              }`}
            >
              {isTeacher && <span>👑</span>}
              <span>{sending ? 'Posting...' : isTeacher ? 'Publish' : 'Send'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Lightbox Modal for Full Resolution Photo Viewing */}
      {selectedZoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedZoomImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-slate-950 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 bg-slate-900 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-sky-400 flex items-center gap-2">
                <span>🔍</span> High-Resolution Math Photo / Diagram
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={selectedZoomImage}
                  download="math-doubt-photo.png"
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white rounded-lg border border-slate-700 transition-colors"
                >
                  Download ⬇
                </a>
                <button
                  onClick={() => setSelectedZoomImage(null)}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-red-900 text-white text-xs flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-2 overflow-auto flex items-center justify-center max-h-[calc(90vh-60px)]">
              <img
                src={selectedZoomImage}
                alt="Zoomed math diagram"
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
