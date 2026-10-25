export type GradeLevel = 'class10' | 'class9';

export type SubjectId = 'math' | 'science' | 'social' | 'english';

export interface Subject {
  id: SubjectId;
  name: string;
  tagline: string;
  chaptersCount: number;
  grade: GradeLevel;
  iconName: string;
  accentColor: string;
  overview: string;
}

export interface Chapter {
  id: string;
  subjectId: SubjectId;
  grade: GradeLevel;
  number: number;
  title: string;
  subtopics: string[];
  keyConcepts: string[];
  examWeightage: string;
  formulaHighlight?: string;
  summary: string;
  tips: string[];
  pyqSample: {
    question: string;
    marks: number;
    answer: string;
    year: string;
  };
}

export interface FormulaItem {
  id: string;
  subject: SubjectId;
  grade: GradeLevel;
  chapter: string;
  name: string;
  formula: string;
  variables: { symbol: string; meaning: string; unit?: string }[];
  note?: string;
}

export interface QuizQuestion {
  id: string;
  grade: GradeLevel;
  subjectId: SubjectId;
  chapter: string;
  type: 'mcq' | 'assertion_reason' | 'numerical';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  examTip?: string;
}

export interface DoubtFAQ {
  id: string;
  grade: GradeLevel;
  subject: SubjectId;
  question: string;
  shortAnswer: string;
  deepExplanation: string;
  commonMistake: string;
}

export interface ChapterVideo {
  id: string;
  chapterId: string;
  grade: GradeLevel;
  subjectId: SubjectId;
  chapterTitle: string;
  videoTitle: string;
  duration: string;
  animationType: 'optics' | 'chemistry' | 'math' | 'circuit' | 'biology' | 'motion' | 'general';
  youtubeUrl: string;
  instructorName?: string;
  instructorBadge?: string;
  instructorChannelUrl?: string;
  summary: string;
  timestamps: { time: string; title: string; concept: string }[];
  keyAnimationHighlights: string[];
}

export interface StudyGoal {
  id: string;
  title: string;
  chapterId: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface CommunityDoubt {
  id: string;
  studentName: string;
  studentContact?: string;
  grade: GradeLevel;
  subject: SubjectId;
  topic?: string;
  question: string;
  language: string;
  answer?: string;
  timestamp: string;
  upvotes: number;
  status: 'answered' | 'processing';
  examinerTip?: string;
  sentToEmail?: string;
  referenceId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  emailOrPhone: string;
  role: 'student' | 'teacher';
  grade?: GradeLevel;
  rollNumberOrSection?: string;
  subjectSpecialty?: string;
  token?: string;
  advaitCoins?: number;
}

export type BattleQuestionType = 'text' | 'poll' | 'photo';

export interface BattleQuestion {
  id: string;
  type: BattleQuestionType;
  questionText: string;
  photoUrl?: string;
  options?: string[]; // for poll
  correctOptionIndex?: number;
  correctAnswerText?: string;
  points: number; // default 10 points
  stage?: number;
  stageCoins?: number;
  expertHint?: string;
  createdAt: number;
}

export interface BattlePlayer {
  id: string;
  name: string;
  email: string;
  role: 'student';
  avatar: string;
  grade: GradeLevel;
  points: number;
  currentAnswer?: string;
  selectedOptionIndex?: number;
  answeredAt?: number;
  isCorrect?: boolean | null;
  advaitCoins: number;
  joinedAt: number;
}

export interface BattleState {
  status: 'lobby' | 'in_progress' | 'round_ended' | 'match_completed';
  currentQuestion: BattleQuestion | null;
  questionNumber: number;
  totalQuestions: number;
  timerSecondsLeft: number;
  timerRunning: boolean;
  maxPlayers: number; // strictly 10
  players: BattlePlayer[];
  winner: BattlePlayer | null;
  lastEventMessage?: string;
}

export interface TeacherNote {
  id: string;
  teacherName: string;
  grade: GradeLevel;
  chapterTitle: string;
  title: string;
  content: string;
  pyqFocus?: string;
  formulaHighlight?: string;
  createdAt: string;
}

export interface HardestQuestionChallenge {
  id: string;
  grade: GradeLevel;
  weekTitle: string;
  chapter: string;
  marks: number;
  question: string;
  hint: string;
  timeLimitMinutes: number;
  modelSolution: string;
  submittedAttempts: number;
}

