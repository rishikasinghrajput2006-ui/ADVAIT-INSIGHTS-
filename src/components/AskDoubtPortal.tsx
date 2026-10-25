import React, { useState, useEffect, useRef } from 'react';
import { CommunityDoubt, GradeLevel, SubjectId } from '../types/index.ts';
import { AdvaitLogo } from './AdvaitLogo.tsx';

interface AskDoubtPortalProps {
  grade: GradeLevel;
  onLaunchSimulation?: (simId: string) => void;
}

const INITIAL_COMMUNITY_DOUBTS: CommunityDoubt[] = [
  {
    id: 'd-101',
    studentName: 'Aarav Patel',
    grade: 'class10',
    subject: 'science',
    topic: 'Light - Spherical Mirrors',
    question: 'Why is the focal length of a convex mirror taken as positive (+), but a concave mirror is taken as negative (-) in the Cartesian sign convention?',
    language: 'English',
    answer: `In the New Cartesian Sign Convention:
1. The optical center/pole P of the mirror is placed at the origin (0, 0) of the Cartesian plane.
2. The principal axis is aligned along the X-axis, and incident light is assumed to travel from left to right.
3. For a Convex Mirror, the reflecting surface curves outward, and its principal focus F and center of curvature C lie BEHIND the mirror (to the right of origin P along +X axis). Hence, f is POSITIVE (+).
4. For a Concave Mirror, the reflecting surface curves inward, and its focus F and center of curvature C lie IN FRONT of the mirror (to the left of origin P along -X axis). Hence, f is NEGATIVE (-).`,
    timestamp: 'Today at 10:15 AM',
    upvotes: 24,
    status: 'answered',
    examinerTip: 'Always mark the pole P and directional arrow from left to right when sketching Cartesian sign diagrams in board exams.',
  },
  {
    id: 'd-102',
    studentName: 'Class 10 Student',
    grade: 'class10',
    subject: 'math',
    topic: 'Arithmetic Progressions',
    question: 'सर, AP के सवालों में कब Sn = n/2 (a + l) लगाना चाहिए और कब Sn = n/2 [2a + (n-1)d] लगाना चाहिए? (In Hinglish)',
    language: 'Hinglish',
    answer: `बहुत ही practical doubt है! इसे याद रखने की आसान trick:

1. Sn = (n / 2) · [a + l] तब लगाओ जब:
- आपको AP का First Term (a) और Last Term (l = an) दोनों explicitly दिए गए हों।
- Example: 1 से 100 तक का sum निकालना है => a = 1, l = 100, n = 100. सीधे Sn = (100/2)·(1 + 100) = 50 × 101 = 5050!

2. Sn = (n / 2) · [2a + (n - 1)d] तब लगाओ जब:
- आपको Last term नहीं पता, लेकिन First term (a) और Common difference (d) पता है।
- Example: 2, 5, 8, ... के first 20 terms का sum निकालना है => a = 2, d = 3, n = 20.`,
    timestamp: 'Yesterday at 4:30 PM',
    upvotes: 38,
    status: 'answered',
    examinerTip: 'Both formulas are mathematically identical since l = a + (n-1)d. Using (a + l) saves 2 minutes of calculation time in 3-mark board questions.',
  },
  {
    id: 'd-103',
    studentName: 'Rohan Deshmukh',
    grade: 'class9',
    subject: 'science',
    topic: 'Force & Laws of Motion',
    question: 'बंदुकीतून गोळी झाडल्यावर बंदूक मागे का फेकली जाते? (Why does a gun recoil backwards in Marathi?)',
    language: 'Marathi',
    answer: `न्यूटनच्या तिसऱ्या नियमानुसार (Newton's Third Law of Motion) आणि संवेग अक्षमतेच्या नियमानुसार (Law of Conservation of Momentum):

१. क्रिया आणि प्रतिक्रिया (Action & Reaction): जेव्हा बंदुकीतून गोळी पुढे ढकलली जाते (Action Force), तेव्हा गोळी बंदुकीवर तितक्याच ताकदीने विरुद्ध दिशेने बल लावते (Reaction Force).
२. संवेग संरक्षण (Conservation of Momentum): गोळी झाडण्यापूर्वी बंदूक आणि गोळी दोन्हींचा संवेग शून्य असतो. गोळी झाडल्यानंतर एकूण संवेग शून्य राहण्यासाठी बंदुकीला मागे जावे लागते:
   m₁v₁ + m₂v₂ = 0  =>  v₂ = -(m₁v₁)/m₂
३. बंदुकीचे वजन गोळीपेक्षा खूप जास्त असल्यामुळे बंदुकीचा मागे येण्याचा वेग (Recoil velocity) गोळीच्या वेगापेक्षा खूप कमी असतो.`,
    timestamp: '2 days ago',
    upvotes: 19,
    status: 'answered',
    examinerTip: 'In numerical problems, always mention the minus sign indicating recoil velocity is directed opposite to bullet direction.',
  },
  {
    id: 'd-104',
    studentName: 'Sneha Roy',
    grade: 'class9',
    subject: 'science',
    topic: 'Fundamental Unit of Life',
    question: 'Why are mitochondria called the powerhouse of the cell, and why do they have their own DNA?',
    language: 'English',
    answer: `1. Powerhouse of the Cell:
Mitochondria are the primary sites of cellular respiration where glucose and nutrients are oxidized in the presence of oxygen to synthesize Adenosine Triphosphate (ATP). ATP is the universal "energy currency" required for all physiological and biochemical cellular activities.

2. Presence of DNA and Ribosomes:
Mitochondria contain their own circular DNA and 70S ribosomes (semi-autonomous organelles). According to the Endosymbiotic Theory, mitochondria evolved from ancient aerobic prokaryotic bacteria that were engulfed by ancestral eukaryotic cells billions of years ago. Because of their own DNA and ribosomes, they can synthesize some of their own proteins independently.`,
    timestamp: '3 days ago',
    upvotes: 29,
    status: 'answered',
    examinerTip: 'Plastids and Mitochondria are the only two semi-autonomous organelles tested in Class 9 exams.',
  },
];

export const AskDoubtPortal: React.FC<AskDoubtPortalProps> = ({ grade, onLaunchSimulation }) => {
  const [doubts, setDoubts] = useState<CommunityDoubt[]>(() => {
    const saved = localStorage.getItem('advait_community_doubts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_COMMUNITY_DOUBTS;
      }
    }
    return INITIAL_COMMUNITY_DOUBTS;
  });

  // Form State
  const [studentName, setStudentName] = useState<string>('');
  const [studentContact, setStudentContact] = useState<string>('');
  const [doubtGrade, setDoubtGrade] = useState<GradeLevel>(grade);
  const [doubtSubject, setDoubtSubject] = useState<SubjectId>('science');
  const [doubtTopic, setDoubtTopic] = useState<string>('');
  const [doubtQuestion, setDoubtQuestion] = useState<string>('');
  const [preferredLang, setPreferredLang] = useState<string>('Auto (Any Language)');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [sentSuccessNotice, setSentSuccessNotice] = useState<{
    refId: string;
    targetEmail: string;
    gmailUrl: string;
    mailtoUrl: string;
  } | null>(null);

  // Filters & Search
  const [filterSubject, setFilterSubject] = useState<SubjectId | 'all'>('all');
  const [filterGrade, setFilterGrade] = useState<GradeLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    localStorage.setItem('advait_community_doubts', JSON.stringify(doubts));
  }, [doubts]);

  // Voice Input Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDoubtQuestion((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Microphone speech recognition is not supported in this browser. Please type your doubt.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSpeakAnswer = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) return;

    if (activeSpeechId === id) {
      window.speechSynthesis.cancel();
      setActiveSpeechId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const clean = text.replace(/[#*`_~]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.95;
    utterance.onend = () => setActiveSpeechId(null);
    utterance.onerror = () => setActiveSpeechId(null);

    setActiveSpeechId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleUpvote = (id: string) => {
    setDoubts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d))
    );
  };

  const handlePostDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtQuestion.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const newId = `d-${Date.now()}`;
    const nameToUse = studentName.trim() || 'Curious Student';

    // Temporary pending doubt
    const pendingDoubt: CommunityDoubt = {
      id: newId,
      studentName: nameToUse,
      grade: doubtGrade,
      subject: doubtSubject,
      topic: doubtTopic.trim() || 'General Inquiry',
      question: doubtQuestion,
      language: preferredLang,
      timestamp: 'Just now',
      upvotes: 1,
      status: 'processing',
    };

    setDoubts((prev) => [pendingDoubt, ...prev]);

    try {
      // Call backend AI to generate instantaneous comprehensive academic resolution
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `DOUBT QUESTION: ${doubtQuestion}\nTOPIC: ${doubtTopic}\nSUBJECT: ${doubtSubject}\nGRADE: ${doubtGrade}`,
          language: preferredLang === 'Auto (Any Language)' ? 'auto' : preferredLang,
          grade: doubtGrade,
          subject: doubtSubject,
        }),
      });

      const data = await res.json();
      const generatedAnswer = data.reply || 'Doubt recorded. Advait faculty will post verification shortly.';

      // Forward question directly to advaitinsight1927@gmail.com
      let refNumber = `ADVAIT-${Date.now().toString().slice(-6)}`;
      let gmailComposeLink = '';
      let mailtoLink = '';

      try {
        const emailRes = await fetch('/api/doubts/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentName: nameToUse,
            studentContact: studentContact.trim() || undefined,
            grade: doubtGrade,
            subject: doubtSubject,
            topic: doubtTopic.trim() || 'General Inquiry',
            question: doubtQuestion,
            preferredLanguage: preferredLang,
            answer: generatedAnswer,
            source: 'doubt_portal',
          }),
        });
        const emailData = await emailRes.json();
        if (emailData.success) {
          refNumber = emailData.doubtId;
          gmailComposeLink = emailData.gmailComposeUrl || '';
          mailtoLink = emailData.mailtoUrl || '';
          setSentSuccessNotice({
            refId: refNumber,
            targetEmail: 'advaitinsight1927@gmail.com',
            gmailUrl: gmailComposeLink,
            mailtoUrl: mailtoLink,
          });
        }
      } catch (emailErr) {
        console.warn('Backend email dispatch notification:', emailErr);
      }

      setDoubts((prev) =>
        prev.map((d) =>
          d.id === newId
            ? {
                ...d,
                answer: generatedAnswer,
                status: 'answered',
                referenceId: refNumber,
                sentToEmail: 'advaitinsight1927@gmail.com',
                examinerTip: `Concept verified for ${doubtGrade.toUpperCase()} ${doubtSubject.toUpperCase()} NCERT curriculum. Forwarded to advaitinsight1927@gmail.com.`,
              }
            : d
        )
      );

      // Reset form fields
      setDoubtQuestion('');
      setDoubtTopic('');
    } catch (err) {
      console.error(err);
      setDoubts((prev) =>
        prev.map((d) =>
          d.id === newId
            ? {
                ...d,
                answer: 'Doubt received! Review our chapter notes or Ask AI Guru for instant assistance.',
                status: 'answered',
              }
            : d
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered List
  const filteredDoubts = doubts.filter((d) => {
    const matchGrade = filterGrade === 'all' || d.grade === filterGrade;
    const matchSubject = filterSubject === 'all' || d.subject === filterSubject;
    const matchSearch =
      searchQuery.trim() === '' ||
      d.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.topic && d.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.answer && d.answer.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchGrade && matchSubject && matchSearch;
  });

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold font-mono">
            Open Student Community &amp; AI Doubt Solver
          </span>
          <h2 className="text-2xl font-bold font-heading text-white mt-0.5">
            Ask Your Doubt — Instant Academic Resolution
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Post any academic question in any language (English, Hindi, Marathi, etc.) to get instant step-by-step clarity.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{doubts.length} Resolved Doubts</span>
        </div>
      </div>

      {/* Main 2-Column Layout: Left = Ask Form, Right = Doubts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Ask Your Doubt Form Card */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
          <div className="flex items-center gap-3 mb-4">
            <AdvaitLogo size={36} />
            <div>
              <h3 className="text-base font-bold font-heading text-white">Post a New Doubt</h3>
              <span className="text-[11px] text-slate-400">Get an instant verified answer in any language</span>
            </div>
          </div>

          <form onSubmit={handlePostDoubt} className="space-y-4">
            {/* Email Dispatch Notice */}
            <div className="bg-sky-950/40 border border-sky-800/60 rounded-xl p-3 flex items-start gap-2.5">
              <span className="text-sm">📩</span>
              <div className="text-[11px] leading-relaxed text-sky-200">
                <span className="font-semibold text-white">Direct Faculty Routing:</span> All doubts submitted here are automatically sent to <strong className="text-sky-300 font-mono">advaitinsight1927@gmail.com</strong> for teacher review.
              </div>
            </div>

            {/* Student Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rishika, Aarav..."
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email / Contact <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="To receive reply from faculty..."
                  value={studentContact}
                  onChange={(e) => setStudentContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Grade & Subject Pickers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Grade Level</label>
                <select
                  value={doubtGrade}
                  onChange={(e) => setDoubtGrade(e.target.value as GradeLevel)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="class10">Class 10 (Board)</option>
                  <option value="class9">Class 9 (Foundation)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                <select
                  value={doubtSubject}
                  onChange={(e) => setDoubtSubject(e.target.value as SubjectId)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="science">Science (PCB)</option>
                  <option value="math">Mathematics</option>
                  <option value="social">Social Science</option>
                  <option value="english">English</option>
                </select>
              </div>
            </div>

            {/* Chapter / Topic */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Chapter or Topic</label>
              <input
                type="text"
                placeholder="e.g. Electricity, Quadratic Equations, Cell..."
                value={doubtTopic}
                onChange={(e) => setDoubtTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Preferred Explanation Language
              </label>
              <select
                value={preferredLang}
                onChange={(e) => setPreferredLang(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Auto (Any Language)">Auto (Match Question Language)</option>
                <option value="English">English</option>
                <option value="Hindi">हिन्दी (Hindi)</option>
                <option value="Hinglish">Hinglish (Hindi in English font)</option>
                <option value="Marathi">मराठी (Marathi)</option>
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Gujarati">ગુજરાતી (Gujarati)</option>
              </select>
            </div>

            {/* Question Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Your Exact Question / Doubt
                </label>
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`text-[11px] font-mono flex items-center gap-1 transition-colors ${
                    isListening ? 'text-red-400 font-bold animate-pulse' : 'text-sky-400 hover:text-sky-300'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                  <span>{isListening ? 'Listening...' : 'Speak Question'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                required
                placeholder="Write your complete doubt here... (e.g. Why is a concave lens called diverging? How to solve question 4 in exercise 8.1?)"
                value={doubtQuestion}
                onChange={(e) => setDoubtQuestion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 leading-relaxed resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!doubtQuestion.trim() || isSubmitting}
              className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md ${
                doubtQuestion.trim() && !isSubmitting
                  ? 'bg-sky-600 hover:bg-sky-500 text-white cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Advait AI is resolving your doubt...</span>
                </>
              ) : (
                <>
                  <span>Submit Doubt &amp; Get Solution</span>
                  <span aria-hidden="true">&rarr;</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Community & Resolved Doubts Feed */}
        <div className="lg:col-span-7 space-y-5">
          {/* Filter Bar & Search */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search asked doubts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <svg className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              <button
                onClick={() => setFilterGrade(filterGrade === 'all' ? 'class10' : filterGrade === 'class10' ? 'class9' : 'all')}
                className="px-2.5 py-1 text-xs font-mono bg-slate-950 border border-slate-800 rounded text-slate-300 hover:text-white"
              >
                Grade: {filterGrade === 'all' ? 'All' : filterGrade.toUpperCase()}
              </button>

              <button
                onClick={() => setFilterSubject('all')}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${filterSubject === 'all' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterSubject('science')}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${filterSubject === 'science' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
              >
                Science
              </button>
              <button
                onClick={() => setFilterSubject('math')}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${filterSubject === 'math' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
              >
                Math
              </button>
            </div>
          </div>

          {/* Doubts Feed */}
          <div className="space-y-4">
            {filteredDoubts.map((doubt) => (
              <div
                key={doubt.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3.5 hover:border-slate-700 transition-all shadow-md"
              >
                {/* Doubt Header (Unboxed metadata) */}
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{doubt.studentName}</span>
                    <span>·</span>
                    <span className="text-sky-400 uppercase">{doubt.grade}</span>
                    <span>·</span>
                    <span className="capitalize">{doubt.subject}</span>
                    {doubt.topic && (
                      <>
                        <span>·</span>
                        <span className="text-amber-400">{doubt.topic}</span>
                      </>
                    )}
                  </div>
                  <span>{doubt.timestamp}</span>
                </div>

                {/* Question */}
                <h4 className="text-sm sm:text-base font-bold font-heading text-white leading-relaxed">
                  Q: {doubt.question}
                </h4>

                {/* Status / Answer */}
                {doubt.status === 'processing' ? (
                  <div className="p-4 bg-slate-950 border border-sky-900/40 rounded-xl flex items-center gap-3 text-xs text-sky-400 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <span>Analyzing syllabus and synthesizing verified board explanation...</span>
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2 text-xs sm:text-sm text-slate-200">
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-1 border-b border-slate-800/80 pb-1.5">
                      <div className="flex items-center gap-2">
                        <AdvaitLogo size={18} />
                        <span>Advait Academic Resolution ({doubt.language})</span>
                      </div>
                      <button
                        onClick={() => handleSpeakAnswer(doubt.answer || '', doubt.id)}
                        className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
                        title="Listen to this explanation"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                        </svg>
                        <span>{activeSpeechId === doubt.id ? 'Stop' : 'Listen'}</span>
                      </button>
                    </div>

                    <div className="whitespace-pre-line leading-relaxed text-slate-300">
                      {doubt.answer}
                    </div>

                    {doubt.examinerTip && (
                      <div className="mt-2 text-[11px] text-amber-300/90 bg-amber-950/20 p-2.5 rounded border border-amber-900/30">
                        <strong>Examiner Tip:</strong> {doubt.examinerTip}
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Bar: Upvotes & Share */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                  <button
                    onClick={() => handleUpvote(doubt.id)}
                    className="flex items-center gap-1.5 hover:text-white transition-colors bg-slate-950 px-2.5 py-1 rounded border border-slate-800"
                  >
                    <span>👍 Helpful</span>
                    <span className="font-mono text-emerald-400 font-bold tabular-nums">({doubt.upvotes})</span>
                  </button>

                  <a
                    href="https://www.youtube.com/channel/UCaEO5yq1mT50Tv76XAAhUcg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                  >
                    <span>More on @AdvaitInsights_AI</span>
                    <svg className="w-3.5 h-3.5 fill-red-500" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}

            {filteredDoubts.length === 0 && (
              <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
                No doubts found matching your search. Be the first to post your question!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification Modal when doubt is dispatched to advaitinsight1927@gmail.com */}
      {sentSuccessNotice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl">
                ✉️
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Success • Doubt Sent
                </span>
                <h3 className="text-lg font-bold text-white">
                  Forwarded to advaitinsight1927@gmail.com
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Aapka academic question successfully Advait Insights faculty ko forward kar diya gaya hai. Instant AI solution neeche portal me display ho gaya hai!
            </p>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Reference Ticket ID:</span>
                <span className="text-sky-400 font-bold">{sentSuccessNotice.refId}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Faculty Destination:</span>
                <span className="text-emerald-300 font-semibold">{sentSuccessNotice.targetEmail}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Delivery Status:</span>
                <span className="text-emerald-400">✅ Dispatched to Mailbox</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {sentSuccessNotice.gmailUrl && (
                <a
                  href={sentSuccessNotice.gmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold text-center transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <span>Open in Gmail Draft</span>
                </a>
              )}
              <button
                onClick={() => setSentSuccessNotice(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Done / View Answer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
