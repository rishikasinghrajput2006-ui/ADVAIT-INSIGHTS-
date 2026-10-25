import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { GradeLevel } from '../../types/index.ts';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Edit3,
  Trash2,
  ThumbsUp,
  Pin,
  Send,
  Radio,
  Clock,
  MessageSquare,
  Sparkles,
  Maximize2,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface LiveClassRoomProps {
  grade: GradeLevel;
  onOpenTeacherAuth?: () => void;
  onOpenAIGuru?: () => void;
}

interface LiveStreamState {
  isLive: boolean;
  streamId: string;
  title: string;
  chapter: string;
  grade: 'class9' | 'class10' | 'both';
  teacherName: string;
  startedAt: string | null;
  viewerCount: number;
  pinnedCommentId?: string;
  mode: 'camera' | 'whiteboard' | 'screen';
  lastFrameData?: string;
  teacherMicActive: boolean;
  teacherCamActive: boolean;
}

interface LiveStreamComment {
  id: string;
  senderName: string;
  senderRole: 'teacher' | 'student' | 'guest';
  isTeacher: boolean;
  text: string;
  timestamp: string;
  likes: number;
  likedBy: string[];
  attachments?: {
    name: string;
    type: 'image' | 'file';
    mimeType: string;
    url: string;
    size?: number;
  }[];
}

const MATH_SHORTCUTS = ['√', '²', '³', '±', 'π', 'θ', 'α', 'β', 'Δ', '≤', '≥', '≠', '×', '÷', 'b²-4ac'];

const QUICK_LIVE_REACTIONS = [
  { emoji: '🔥', text: 'Josh High, Sir! 🔥' },
  { emoji: '💡', text: 'Concept Crystal Clear! 💡' },
  { emoji: '🙋‍♂️', text: 'Sir, please repeat this step! ❓' },
  { emoji: '👏', text: 'Brilliant explanation, Sir! 👏' },
];

export const LiveClassRoom: React.FC<LiveClassRoomProps> = ({
  grade,
  onOpenTeacherAuth,
  onOpenAIGuru,
}) => {
  const { user, isTeacher } = useAuth();

  // Stream state
  const [streamState, setStreamState] = useState<LiveStreamState>({
    isLive: false,
    streamId: '',
    title: 'Class 10 CBSE Math High-Yield Doubt Clearing & Live Derivations',
    chapter: 'Real Numbers & Coordinate Geometry',
    grade: 'class10',
    teacherName: 'Harsh Sir (Faculty Lead)',
    startedAt: null,
    viewerCount: 1,
    mode: 'camera',
    teacherMicActive: true,
    teacherCamActive: true,
  });

  const [comments, setComments] = useState<LiveStreamComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Teacher Hardware / Stream Controls
  const [playerSource, setPlayerSource] = useState<'direct' | 'youtube'>('direct');
  const [customYoutubeId, setCustomYoutubeId] = useState<string>('');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [streamMode, setStreamMode] = useState<'camera' | 'whiteboard' | 'screen'>('camera');
  const [hardwareError, setHardwareError] = useState<string | null>(null);
  const [isStartingStream, setIsStartingStream] = useState(false);

  // Stream title configuration inputs for teacher
  const [configTitle, setConfigTitle] = useState('Class 10 CBSE Math Live Doubt Clearing');
  const [configChapter, setConfigChapter] = useState('Real Numbers & Theorems');

  // Whiteboard drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#38bdf8'); // sky blue
  const [penWidth, setPenWidth] = useState(3);

  // Live Chat Media Attachment States (Photos, Doubt Sheets, PDFs)
  const [livePendingAttachments, setLivePendingAttachments] = useState<{
    name: string;
    type: 'image' | 'file';
    mimeType: string;
    url: string;
    size?: number;
  }[]>([]);
  const [selectedLiveZoomImage, setSelectedLiveZoomImage] = useState<string | null>(null);
  const liveImageInputRef = useRef<HTMLInputElement | null>(null);
  const liveFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleLiveFileChange = (e: React.ChangeEvent<HTMLInputElement>, forceType?: 'image' | 'file') => {
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
          setLivePendingAttachments((prev) => [
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

  // Viewer controls
  const [viewerMuted, setViewerMuted] = useState(false);
  const [showMathSymbols, setShowMathSymbols] = useState(false);

  // Unique client ID
  const [currentUserId] = useState(() => {
    if (user?.id) return user.id;
    return `viewer_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  });

  // DOM Refs
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const whiteboardCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const broadcastCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [audioMeterLevel, setAudioMeterLevel] = useState(0);

  // Poll Stream Status & Comments from server every 2 seconds
  const fetchStreamStatus = async () => {
    try {
      const res = await fetch('/api/live/status');
      const data = await res.json();
      if (data.stream) {
        setStreamState(data.stream);
      }
      if (data.comments) {
        setComments(data.comments);
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchStreamStatus();
    const interval = setInterval(fetchStreamStatus, 2500);
    return () => clearInterval(interval);
  }, []);

  // Timer for elapsed stream duration
  useEffect(() => {
    let timer: any = null;
    if (streamState.isLive && streamState.startedAt) {
      const startMs = new Date(streamState.startedAt).getTime();
      timer = setInterval(() => {
        const nowMs = Date.now();
        setElapsedSeconds(Math.max(0, Math.floor((nowMs - startMs) / 1000)));
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [streamState.isLive, streamState.startedAt]);

  // Auto-scroll chat
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments.length]);

  // Teacher Hardware Initialization (Camera & Mic)
  const startCameraAndMic = async () => {
    try {
      setHardwareError(null);
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: true,
      });

      setMediaStream(stream);
      setCameraActive(true);
      setMicActive(true);

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play().catch(() => {});
      }

      // Audio Level Analyzer for pulsing mic feel
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const checkAudio = () => {
          if (!stream.active) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          const avg = sum / dataArray.length;
          setAudioMeterLevel(Math.min(100, Math.round((avg / 128) * 100)));
          requestAnimationFrame(checkAudio);
        };
        checkAudio();
      } catch {
        // audio analyzer fallback
      }
    } catch (err: any) {
      console.warn('Camera/mic access error:', err);
      setHardwareError(
        'Camera or Microphone access was blocked by browser. You can still stream via Digital Whiteboard mode!'
      );
    }
  };

  // Teacher Screen Sharing
  const handleToggleScreenShare = async () => {
    if (!isTeacher) return;
    try {
      if (streamMode === 'screen') {
        // revert to camera
        await startCameraAndMic();
        setStreamMode('camera');
      } else {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        setMediaStream(displayStream);
        setStreamMode('screen');
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = displayStream;
          videoPreviewRef.current.play().catch(() => {});
        }
        displayStream.getVideoTracks()[0].onended = () => {
          startCameraAndMic();
          setStreamMode('camera');
        };
      }
    } catch (err) {
      console.warn('Screen share canceled or denied');
    }
  };

  // Toggle Camera Mute
  const handleToggleCamera = () => {
    if (!mediaStream) return;
    const videoTrack = mediaStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraActive(videoTrack.enabled);
    }
  };

  // Toggle Mic Mute
  const handleToggleMic = () => {
    if (!mediaStream) return;
    const audioTrack = mediaStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicActive(audioTrack.enabled);
    }
  };

  // Start Broadcasting Live
  const handleStartBroadcast = async () => {
    if (!isTeacher) return;
    setIsStartingStream(true);
    try {
      if (!mediaStream && streamMode !== 'whiteboard') {
        await startCameraAndMic();
      }

      const res = await fetch('/api/live/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: configTitle.trim() || 'Class 10 CBSE Math Live Lecture',
          chapter: configChapter.trim() || 'Core NCERT Concepts',
          grade,
          teacherName: user?.name || 'Harsh Sir (Faculty Lead)',
          isTeacher: true,
        }),
      });

      const data = await res.json();
      if (data.stream) {
        setStreamState(data.stream);
      }
    } catch (err) {
      console.error('Failed to start broadcast:', err);
    } finally {
      setIsStartingStream(false);
    }
  };

  // End Broadcast Live
  const handleEndBroadcast = async () => {
    if (!isTeacher) return;
    if (!confirm('Are you sure you want to end this live broadcast?')) return;
    try {
      const res = await fetch('/api/live/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTeacher: true }),
      });
      const data = await res.json();
      if (data.stream) {
        setStreamState(data.stream);
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
        setMediaStream(null);
      }
    } catch (err) {
      console.error('Failed to end broadcast:', err);
    }
  };

  // Teacher broadcasts canvas snapshot every 1.5s so remote viewers see the live stream
  useEffect(() => {
    let frameTimer: any = null;
    if (isTeacher && streamState.isLive) {
      frameTimer = setInterval(() => {
        try {
          const canvas = broadcastCanvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          canvas.width = 640;
          canvas.height = 360;

          if (streamMode === 'whiteboard' && whiteboardCanvasRef.current) {
            ctx.drawImage(whiteboardCanvasRef.current, 0, 0, canvas.width, canvas.height);
          } else if (videoPreviewRef.current && videoPreviewRef.current.readyState >= 2) {
            ctx.drawImage(videoPreviewRef.current, 0, 0, canvas.width, canvas.height);
          } else {
            // Placeholder canvas frame
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🔴 Harsh Sir Live Class', canvas.width / 2, canvas.height / 2);
          }

          const frameBase64 = canvas.toDataURL('image/jpeg', 0.5);
          fetch('/api/live/frame', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              frameData: frameBase64,
              mode: streamMode,
              teacherMicActive: micActive,
              teacherCamActive: cameraActive,
              isTeacher: true,
            }),
          }).catch(() => {});
        } catch {
          // ignore frame capture error
        }
      }, 1500);
    }
    return () => {
      if (frameTimer) clearInterval(frameTimer);
    };
  }, [isTeacher, streamState.isLive, streamMode, micActive, cameraActive]);

  // Whiteboard drawing handlers
  const handleWhiteboardMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isTeacher || streamMode !== 'whiteboard') return;
    const canvas = whiteboardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    setIsDrawing(true);
  };

  const handleWhiteboardMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isTeacher || streamMode !== 'whiteboard') return;
    const canvas = whiteboardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleWhiteboardMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClearWhiteboard = () => {
    const canvas = whiteboardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Submit comment in live stream
  const handleSendComment = async (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (presetText || newCommentText).trim();
    if ((!textToSend && livePendingAttachments.length === 0) || isSubmittingComment) return;

    setIsSubmittingComment(true);
    const senderName = isTeacher
      ? (user?.name || 'Harsh Sir (Faculty Lead)')
      : (user?.name || 'Guest Advaitian');
    const senderRole = isTeacher ? 'teacher' : (user?.role || 'student');

    try {
      const res = await fetch('/api/live/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName,
          senderRole,
          isTeacher,
          text: textToSend,
          attachments: livePendingAttachments.length > 0 ? livePendingAttachments : undefined,
        }),
      });

      const data = await res.json();
      if (data.comment) {
        setComments((prev) => [...prev, data.comment]);
        if (!presetText) setNewCommentText('');
        setLivePendingAttachments([]);
      }
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Like comment
  const handleLikeComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/live/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIdentifier: currentUserId }),
      });
      const data = await res.json();
      if (data.comment) {
        setComments((prev) => prev.map((c) => (c.id === commentId ? data.comment : c)));
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  // Teacher Pin question on video screen
  const handlePinComment = async (commentId: string) => {
    if (!isTeacher) return;
    try {
      const res = await fetch(`/api/live/comments/${commentId}/pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTeacher: true }),
      });
      const data = await res.json();
      setStreamState((prev) => ({
        ...prev,
        pinnedCommentId: data.pinnedCommentId,
      }));
    } catch (err) {
      console.error('Pin error:', err);
    }
  };

  // Teacher Delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!isTeacher) return;
    try {
      const res = await fetch(`/api/live/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTeacher: true }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const pinnedComment = comments.find((c) => c.id === streamState.pinnedCommentId);

  return (
    <div className="space-y-4">
      {/* Hidden canvas used for broadcasting frame snapshots */}
      <canvas ref={broadcastCanvasRef} className="hidden" />

      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-indigo-950 border border-red-500/40 p-5 sm:p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center text-2xl shadow-xl ring-2 ring-red-400/50">
              <Radio className="text-white animate-pulse" size={30} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-900 text-red-200 border border-red-500 font-mono text-xs font-black tracking-wider uppercase">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" />
                  <span>{streamState.isLive ? 'DIRECT LIVE STREAMING ON WEBSITE' : 'ADVAIT LIVE CLASSROOM'}</span>
                </span>
                <span className="text-xs font-mono text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-600/50">
                  {grade === 'class10' ? 'Class 10 CBSE' : 'Class 9 Foundation'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                {streamState.isLive ? streamState.title : 'Harsh Sir Live Math Classroom'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Direct in-website video broadcasting with real-time peer doubt chat, math formulas, and interactive blackboard.
              </p>
            </div>
          </div>

          {/* Quick status counters */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{streamState.viewerCount} Viewers Live</span>
              </div>
              {streamState.isLive && (
                <div className="flex items-center gap-1 pl-2.5 border-l border-slate-800 text-xs font-mono text-red-400 font-bold">
                  <Clock size={13} />
                  <span>{formatSeconds(elapsedSeconds)}</span>
                </div>
              )}
            </div>

            {onOpenAIGuru && (
              <button
                onClick={onOpenAIGuru}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={14} />
                <span>Ask AI Guru</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Studio Arena: Left Video/Board Stage (8 cols) + Right Live Q&A Chat (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Video & Broadcast Stage */}
        <div className="lg:col-span-8 space-y-3">
          {/* Stream Source Selector: Website Direct Studio vs Official YouTube Live Stream */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPlayerSource('direct')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  playerSource === 'direct'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>🔴 Website Direct Studio</span>
              </button>

              <button
                onClick={() => setPlayerSource('youtube')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  playerSource === 'youtube'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <svg className="w-3.5 h-3.5 fill-current text-red-500" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502-5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>📺 YouTube Live Stream (@AdvaitInsights)</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Playing Directly on Website</span>
            </div>
          </div>

          <div className="relative aspect-video w-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center">
            {/* Ambient backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/40" />

            {/* Embedded YouTube Live Player when playerSource === 'youtube' */}
            {playerSource === 'youtube' && (
              <div className="w-full h-full relative z-10 bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${
                    customYoutubeId
                      ? customYoutubeId
                      : 'live_stream?channel=UCaEO5yq1mT50Tv76XAAhUcg'
                  }&autoplay=1&enablejsapi=1`}
                  title="Advait Insights Live Broadcast"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}

            {/* Case A: Teacher is Broadcasting Camera/Screen */}
            {playerSource === 'direct' && isTeacher && streamMode !== 'whiteboard' && (
              <video
                ref={videoPreviewRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover relative z-10"
              />
            )}

            {/* Case B: Teacher or Viewer viewing Digital Whiteboard */}
            {playerSource === 'direct' && (streamMode === 'whiteboard' || (streamState.isLive && streamState.mode === 'whiteboard')) && (
              <div className="w-full h-full relative z-10 flex flex-col">
                <canvas
                  ref={whiteboardCanvasRef}
                  width={1280}
                  height={720}
                  onMouseDown={handleWhiteboardMouseDown}
                  onMouseMove={handleWhiteboardMouseMove}
                  onMouseUp={handleWhiteboardMouseUp}
                  className="w-full h-full bg-slate-950 cursor-crosshair touch-none"
                />
              </div>
            )}

            {/* Case C: Viewer Watching Teacher's Broadcast Frame when not teacher */}
            {playerSource === 'direct' && !isTeacher && streamState.isLive && streamState.lastFrameData && streamState.mode !== 'whiteboard' && (
              <img
                src={streamState.lastFrameData}
                alt="Teacher Live Broadcast"
                className="w-full h-full object-cover relative z-10"
              />
            )}

            {/* Case D: Stream is NOT LIVE and user is student/guest */}
            {playerSource === 'direct' && !streamState.isLive && !isTeacher && (
              <div className="relative z-10 p-6 text-center max-w-md space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-red-950/80 border-2 border-red-500/50 flex items-center justify-center mx-auto text-3xl shadow-xl animate-pulse">
                  📻
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest block">
                    Standby Mode
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Harsh Sir’s Studio is Ready
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Live video will appear here as soon as Harsh Sir begins the direct broadcast. You can write your questions in the live chat right now!
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => onOpenTeacherAuth?.()}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span>👑 Are you Harsh Sir? Faculty Go Live</span>
                  </button>
                </div>
              </div>
            )}

            {/* Case E: Teacher Preview when offline */}
            {playerSource === 'direct' && !streamState.isLive && isTeacher && (
              <div className="relative z-10 p-6 text-center max-w-lg space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto text-2xl shadow-xl">
                  👑
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                    Faculty Broadcasting Studio
                  </span>
                  <h3 className="text-xl font-black text-white mt-1">
                    Ready to Go Live Directly on Website
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Students and guests across India can see and hear you in real-time, ask doubts, and see your blackboard solutions.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleStartBroadcast}
                    disabled={isStartingStream}
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Radio className="animate-pulse" size={18} />
                    <span>{isStartingStream ? 'Starting...' : '🔴 Go Live on Website'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* On-Screen Overlays (LIVE badge, Lower Third, Pinned Question) */}
            {streamState.isLive && (
              <>
                {/* Top Left Live Badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-red-600 text-white font-mono text-xs font-black flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>LIVE</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-white font-mono text-xs font-bold">
                    ⏱️ {formatSeconds(elapsedSeconds)}
                  </span>
                </div>

                {/* Top Right Mic / Cam Status */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Audio Transmitting 🎙️</span>
                  </span>
                </div>

                {/* Pinned Student Question (Lower Third Graphic) */}
                {pinnedComment && (
                  <div className="absolute bottom-4 left-4 right-4 z-20 p-3 bg-gradient-to-r from-slate-950/95 via-indigo-950/95 to-slate-950/95 border border-sky-400/60 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 animate-fade-in">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400 text-sky-400 flex items-center justify-center shrink-0 text-sm">
                        📌
                      </span>
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-sky-400 font-bold uppercase block">
                          Current Question on Screen • {pinnedComment.senderName}
                        </span>
                        <p className="text-xs text-white font-medium truncate">{pinnedComment.text}</p>
                      </div>
                    </div>
                    {isTeacher && (
                      <button
                        onClick={() => handlePinComment(pinnedComment.id)}
                        className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 shrink-0 cursor-pointer"
                      >
                        Unpin
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Teacher Broadcast Toolbar Console (When logged in as Teacher) */}
          {isTeacher && (
            <div className="p-4 bg-slate-900 border-2 border-amber-500/60 rounded-2xl space-y-3 shadow-xl">
              <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-800 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👑</span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                    Faculty Live Broadcasting Studio Controls
                  </span>
                </div>

                {/* Live Mic Audio Pulsing Bar */}
                {micActive && (
                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400">Mic Level:</span>
                    <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 transition-all duration-75"
                        style={{ width: `${Math.max(10, audioMeterLevel)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Hardware & Mode Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Camera Mute/Unmute */}
                  <button
                    onClick={handleToggleCamera}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      cameraActive
                        ? 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700'
                        : 'bg-red-950 text-red-300 border border-red-700'
                    }`}
                  >
                    {cameraActive ? <Video size={15} /> : <VideoOff size={15} />}
                    <span>{cameraActive ? 'Camera On' : 'Camera Off'}</span>
                  </button>

                  {/* Mic Mute/Unmute */}
                  <button
                    onClick={handleToggleMic}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      micActive
                        ? 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700'
                        : 'bg-red-950 text-red-300 border border-red-700'
                    }`}
                  >
                    {micActive ? <Mic size={15} /> : <MicOff size={15} />}
                    <span>{micActive ? 'Mic Active' : 'Mic Muted'}</span>
                  </button>

                  {/* Screen Share */}
                  <button
                    onClick={handleToggleScreenShare}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      streamMode === 'screen'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    <Monitor size={15} />
                    <span>{streamMode === 'screen' ? 'Sharing Screen' : 'Share Screen / PDF'}</span>
                  </button>

                  {/* Whiteboard Mode */}
                  <button
                    onClick={() => {
                      if (streamMode === 'whiteboard') {
                        setStreamMode('camera');
                      } else {
                        setStreamMode('whiteboard');
                        setTimeout(handleClearWhiteboard, 50);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      streamMode === 'whiteboard'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    <Edit3 size={15} />
                    <span>{streamMode === 'whiteboard' ? 'Whiteboard Active' : 'Digital Blackboard'}</span>
                  </button>

                  {streamMode === 'whiteboard' && (
                    <button
                      onClick={handleClearWhiteboard}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Clear Board
                    </button>
                  )}

                  <a
                    href="?tab=canvas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-sky-950 text-sky-300 border border-sky-500/40 hover:bg-sky-900/50 hover:text-white"
                    title="Open full-featured World-Class Whiteboard with photo upload, sticky notes & formulas"
                  >
                    <span>🎨 World-Class Whiteboard (Add Photos) ↗</span>
                  </a>
                </div>

                {/* Primary Go Live / End Stream Button */}
                <div className="flex items-center gap-2">
                  {streamState.isLive ? (
                    <button
                      onClick={handleEndBroadcast}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      <span>⏹️ End Live Stream</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStartBroadcast}
                      disabled={isStartingStream}
                      className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer"
                    >
                      <Radio size={16} className="animate-pulse" />
                      <span>{isStartingStream ? 'Starting...' : '🔴 Start Direct Live'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Topic customization */}
              {!streamState.isLive && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono text-[10px]">Live Session Headline:</label>
                    <input
                      type="text"
                      value={configTitle}
                      onChange={(e) => setConfigTitle(e.target.value)}
                      placeholder="e.g. Real Numbers & Coordinate Geometry Live Doubts"
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono text-[10px]">NCERT Chapter / Topic Focus:</label>
                    <input
                      type="text"
                      value={configChapter}
                      onChange={(e) => setConfigChapter(e.target.value)}
                      placeholder="e.g. Fundamental Theorem & Section Formula"
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Student/Guest Viewer Audio and Fullscreen Controls (when student) */}
          {!isTeacher && streamState.isLive && (
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewerMuted(!viewerMuted)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {viewerMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  <span>{viewerMuted ? 'Unmute Stream' : 'Audio On'}</span>
                </button>
                <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
                  Harsh Sir is speaking live. You can hear live voice explanations.
                </span>
              </div>

              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-600/50">
                ● Synchronized Live Broadcast
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Live Stream Comments & Doubt Chat (4 cols) */}
        <div className="lg:col-span-4 flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl h-[560px] lg:h-[620px]">
          {/* Chat Header */}
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-red-400" />
              <h3 className="font-heading font-bold text-white text-xs sm:text-sm">
                Live Classroom Q&amp;A Chat
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
              {comments.length} comments
            </span>
          </div>

          {/* Comments Stream Viewport */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {comments.map((c) => {
              const isCommentTeacher = c.isTeacher;
              const isPinned = streamState.pinnedCommentId === c.id;

              return (
                <div
                  key={c.id}
                  className={`p-3 rounded-2xl transition-all space-y-1 text-xs ${
                    isCommentTeacher
                      ? 'bg-gradient-to-r from-amber-950/50 via-slate-950 to-slate-950 border border-amber-500/50 shadow-md'
                      : isPinned
                      ? 'bg-sky-950/40 border border-sky-400/50'
                      : 'bg-slate-950/80 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm">{isCommentTeacher ? '👑' : '🎓'}</span>
                      <span
                        className={`font-bold ${
                          isCommentTeacher ? 'text-amber-400' : 'text-slate-200'
                        }`}
                      >
                        {c.senderName}
                      </span>
                      {isCommentTeacher && (
                        <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded font-mono">
                          Faculty
                        </span>
                      )}
                      {isPinned && (
                        <span className="text-[9px] bg-sky-500/20 text-sky-300 font-bold px-1.5 py-0.2 rounded font-mono border border-sky-400/40">
                          On Screen 📌
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{c.timestamp}</span>
                  </div>

                  <p className="text-slate-300 leading-relaxed font-sans">{c.text}</p>

                  {/* Attached Photos & Files in Live Comment */}
                  {c.attachments && c.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {c.attachments.map((att, aIdx) => {
                        if (att.type === 'image') {
                          return (
                            <div
                              key={aIdx}
                              onClick={() => setSelectedLiveZoomImage(att.url)}
                              className="relative group rounded-lg overflow-hidden border border-slate-700 bg-slate-900 cursor-pointer shadow-sm hover:border-sky-400 transition-all max-w-[200px]"
                              title="Click to zoom live doubt photo"
                            >
                              <img
                                src={att.url}
                                alt={att.name}
                                className="max-h-36 w-auto object-cover rounded group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold pointer-events-none">
                                🔍 Zoom
                              </div>
                            </div>
                          );
                        }

                        return (
                          <a
                            key={aIdx}
                            href={att.url}
                            download={att.name}
                            className="flex items-center gap-1.5 p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-[10px] text-sky-300 max-w-xs transition-colors"
                          >
                            <span>📄</span>
                            <span className="truncate max-w-[120px] font-medium text-white">{att.name}</span>
                            <span>⬇</span>
                          </a>
                        );
                      })}
                    </div>
                  )}

                  {/* Comment Action Footer */}
                  <div className="pt-1 flex items-center justify-between gap-2 text-[11px]">
                    <button
                      onClick={() => handleLikeComment(c.id)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <ThumbsUp size={12} />
                      <span>{c.likes > 0 ? c.likes : 'Like'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Teacher Pin on Video Screen */}
                      {isTeacher && (
                        <button
                          onClick={() => handlePinComment(c.id)}
                          className="text-slate-400 hover:text-amber-400 flex items-center gap-0.5 cursor-pointer"
                          title="Pin question to live stream screen"
                        >
                          <Pin size={12} />
                          <span>{isPinned ? 'Unpin' : 'Pin to Screen'}</span>
                        </button>
                      )}

                      {/* Teacher Delete Comment */}
                      {isTeacher && (
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="text-slate-500 hover:text-red-400 cursor-pointer"
                          title="Delete comment"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatScrollRef} />
          </div>

          {/* Quick Preset Student Reactions */}
          <div className="p-2 bg-slate-950 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
            <span className="text-slate-500 font-mono text-[10px] shrink-0">Quick Reaction:</span>
            {QUICK_LIVE_REACTIONS.map((qr, i) => (
              <button
                key={i}
                onClick={() => handleSendComment(undefined, qr.text)}
                className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-colors whitespace-nowrap cursor-pointer shrink-0"
              >
                {qr.emoji} {qr.text.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Math Symbols Inserter Toolbar */}
          {showMathSymbols && (
            <div className="p-1.5 bg-slate-950 border-t border-slate-800 flex items-center gap-1 overflow-x-auto text-xs shrink-0">
              {MATH_SHORTCUTS.map((sym) => (
                <button
                  key={sym}
                  onClick={() => setNewCommentText((prev) => prev + sym)}
                  className="px-2 py-0.5 bg-slate-900 hover:bg-sky-600 hover:text-white text-sky-300 font-mono text-[11px] rounded border border-slate-800 cursor-pointer shrink-0"
                >
                  {sym}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2 shrink-0">
            {/* Hidden live file inputs */}
            <input
              type="file"
              ref={liveImageInputRef}
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleLiveFileChange(e, 'image')}
            />
            <input
              type="file"
              ref={liveFileInputRef}
              accept=".pdf,.doc,.docx,.txt,.zip,image/*"
              multiple
              className="hidden"
              onChange={(e) => handleLiveFileChange(e)}
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-1">
              <span>{isTeacher ? '👑 Posting as Faculty Lead' : `🎓 Commenting as ${user?.name || 'Guest'}`}</span>

              <div className="flex items-center gap-2">
                {/* Photo Upload in Live Chat */}
                <button
                  type="button"
                  onClick={() => liveImageInputRef.current?.click()}
                  className="text-sky-400 hover:text-sky-300 font-mono flex items-center gap-1 cursor-pointer bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                  title="Send photo of question or doubt sheet"
                >
                  <span>📷 Photo</span>
                </button>

                {/* File Upload in Live Chat */}
                <button
                  type="button"
                  onClick={() => liveFileInputRef.current?.click()}
                  className="text-slate-300 hover:text-white font-mono flex items-center gap-1 cursor-pointer bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                  title="Attach document or PDF"
                >
                  <span>📎 File</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowMathSymbols(!showMathSymbols)}
                  className="text-sky-400 hover:text-sky-300 font-mono cursor-pointer"
                >
                  ∑ Math Symbols
                </button>
              </div>
            </div>

            {/* Pending Attachments in Live Chat */}
            {livePendingAttachments.length > 0 && (
              <div className="p-2 bg-slate-900/90 border border-sky-800/60 rounded-xl flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-mono text-sky-400 shrink-0">Attached:</span>
                {livePendingAttachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="relative flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-700 rounded text-[11px] text-white shrink-0"
                  >
                    <span>{att.type === 'image' ? '📷' : '📄'}</span>
                    <span className="truncate max-w-[100px]">{att.name}</span>
                    <button
                      type="button"
                      onClick={() => setLivePendingAttachments((prev) => prev.filter((_, i) => i !== idx))}
                      className="ml-1 text-slate-400 hover:text-red-400 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSendComment} className="flex items-center gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={
                  isTeacher
                    ? '👑 Broadcast note or announcement to live viewers...'
                    : 'Ask Harsh Sir your live doubt or step inquiry...'
                }
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                disabled={(!newCommentText.trim() && livePendingAttachments.length === 0) || isSubmittingComment}
                className="p-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl transition-all shadow-md cursor-pointer shrink-0"
                title="Send Live Comment"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Live Stream Photo Zoom */}
      {selectedLiveZoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedLiveZoomImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-slate-950 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 bg-slate-900 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-sky-400 flex items-center gap-2">
                <span>🔍</span> Live Doubt Photo / Diagram
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={selectedLiveZoomImage}
                  download="live-doubt-photo.png"
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white rounded-lg border border-slate-700 transition-colors"
                >
                  Download ⬇
                </a>
                <button
                  onClick={() => setSelectedLiveZoomImage(null)}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-red-900 text-white text-xs flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-2 overflow-auto flex items-center justify-center max-h-[calc(90vh-60px)]">
              <img
                src={selectedLiveZoomImage}
                alt="Zoomed live diagram"
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
