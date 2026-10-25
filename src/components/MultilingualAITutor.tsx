import React, { useState, useEffect, useRef } from 'react';
import { GradeLevel, SubjectId } from '../types/index.ts';
import { AdvaitLogo } from './AdvaitLogo.tsx';

interface MultilingualAITutorProps {
  grade: GradeLevel;
  activeSubject?: SubjectId;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  languageUsed?: string;
}

const LANGUAGES = [
  { code: 'auto', name: 'Auto Detect (Any Language)', native: '🌍 Universal' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
  { code: 'hinglish', name: 'Hinglish', native: 'Hinglish' },
  { code: 'en-IN', name: 'English', native: 'English' },
  { code: 'mr-IN', name: 'Marathi', native: 'मराठी' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు' },
  { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa-IN', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'ur-IN', name: 'Urdu', native: 'اردو' },
  { code: 'es-ES', name: 'Spanish', native: 'Español' },
  { code: 'fr-FR', name: 'French', native: 'Français' },
  { code: 'de-DE', name: 'German', native: 'Deutsch' },
];

const QUICK_PROMPTS: Record<GradeLevel, { label: string; text: string; lang: string }[]> = {
  class10: [
    { label: '🇮🇳 Ohm\'s Law in Hindi', text: 'ओम का नियम (Ohm\'s Law) और इसका सूत्र हिन्दी में विस्तार से समझाइए।', lang: 'hi-IN' },
    { label: '⚡ Light Reflection in Hinglish', text: 'Convex and Concave lens ke sign conventions Hinglish me easy trick ke saath samjhao.', lang: 'hinglish' },
    { label: '📐 Quadratic Formula', text: 'Derive the quadratic formula x = (-b ± √D)/2a and explain nature of roots with examples.', lang: 'en-IN' },
    { label: '🔬 Double Circulation in Marathi', text: 'मानवी हृदयातील दुहेरी रक्ताभिसरण (Double circulation) सोप्या मराठीत स्पष्ट करा.', lang: 'mr-IN' },
    { label: '🧪 Acids & Bases in Bengali', text: 'অম্ল, ক্ষারক ও পিএইচ (pH Scale) এর গুরুত্ব বাংলায় সহজভাবে বুঝিয়ে দাও।', lang: 'bn-IN' },
  ],
  class9: [
    { label: '🚀 Equations of Motion in Hindi', text: 'गति के तीनों समीकरण (Equations of Motion) और उनका ग्राफिकल प्रूफ हिन्दी में बताएं।', lang: 'hi-IN' },
    { label: '🍎 Newton\'s 3 Laws in Hinglish', text: 'Newton ke 3 laws of motion daily life examples ke saath Hinglish me samjhao.', lang: 'hinglish' },
    { label: '⚖️ Mass vs Weight', text: 'Explain the fundamental difference between mass and weight in simple terms with units.', lang: 'en-IN' },
    { label: '🧬 Cell Organelles in Marathi', text: 'वनस्पती पेशी आणि प्राणी पेशी यांमधील फरक मराठीत स्पष्ट करा.', lang: 'mr-IN' },
    { label: '🌊 Archimedes Principle in Tamil', text: 'ஆர்க்கிமிடீஸ் கொள்கை மற்றும் மிதத்தல் விதிகள் பற்றி தமிழில் விளக்குக.', lang: 'ta-IN' },
  ],
};

interface GuruDoubtQuestion {
  id: string;
  topic: string;
  subject: string;
  question: string;
  hint: string;
}

const GURU_DOUBT_QUESTIONS: Record<GradeLevel, GuruDoubtQuestion[]> = {
  class10: [
    {
      id: 'gq1',
      topic: 'Light - Reflection & Refraction',
      subject: 'Science',
      question: 'क्या उत्तल लेंस (Convex Lens) कभी आभासी (Virtual) और सीधा (Erect) प्रतिबिम्ब बना सकता है? यदि हाँ, तो वस्तु को कहाँ रखना होगा? (Can a convex lens form a virtual image?)',
      hint: 'वस्तु को फोकस F1 और प्रकाशिक केन्द्र O के बीच रखकर सोचें।',
    },
    {
      id: 'gq2',
      topic: 'Electricity',
      subject: 'Science',
      question: 'बिजली के हीटर की डोरी (connecting cord) चमकती नहीं है, जबकि उसका हीटिंग एलिमेंट लाल-तप्त होकर चमकने लगता है। ऐसा क्यों? (Why does the heater element glow while the cord does not?)',
      hint: 'हीटिंग एलिमेंट नाइक्रोम मिश्रधातु (उच्च प्रतिरोधकता) का होता है जबकि तार तांबे का होता है। जूल का तापन नियम H = I²Rt याद करें।',
    },
    {
      id: 'gq3',
      topic: 'Chemical Reactions',
      subject: 'Science',
      question: 'श्वसन (Respiration) को एक ऊष्माक्षेपी अभिक्रिया (Exothermic reaction) क्यों माना जाता है? समीकरण सहित स्पष्ट कीजिए।',
      hint: 'ग्लूकोज का ऑक्सीजन के साथ दहन होकर ऊर्जा (ATP) मुक्त होना। C6H12O6 + 6O2 -> 6CO2 + 6H2O + ऊर्जा।',
    },
    {
      id: 'gq4',
      topic: 'Real Numbers',
      subject: 'Mathematics',
      question: 'क्या किन्हीं दो संख्याओं का HCF 18 और LCM 380 हो सकता है? कारण सहित समझाइए।',
      hint: 'याद रखें कि LCM सदैव HCF से पूर्णतः विभाज्य (divisible) होना चाहिए। क्या 380, 18 से पूरा कटता है?',
    },
    {
      id: 'gq5',
      topic: 'Life Processes',
      subject: 'Science',
      question: 'शाकाहारी (Herbivores) जीवों की छोटी आंत (Small Intestine) मांसाहारी जीवों की तुलना में अधिक लंबी क्यों होती है?',
      hint: 'घास में मौजूद सेल्यूलोज (Cellulose) का पाचन कठिन होता है, जिसके लिए लंबी आंत और अधिक समय चाहिए।',
    },
  ],
  class9: [
    {
      id: 'gq1',
      topic: 'Motion',
      subject: 'Science',
      question: 'क्या किसी वस्तु का वेग (Velocity) शून्य हो सकता है, फिर भी उसमें त्वरण (Acceleration) मौजूद हो? एक वास्तविक उदाहरण दीजिए।',
      hint: 'जब किसी गेंद को सीधा ऊपर हवा में फेंका जाता है, तो उच्चतम बिंदु (highest point) पर क्या होता है?',
    },
    {
      id: 'gq2',
      topic: 'Force and Laws of Motion',
      subject: 'Science',
      question: 'क्रिकेट का खिलाड़ी तेजी से आती हुई गेंद को पकड़ते (कैच लेते) समय अपने हाथों को पीछे की ओर क्यों खींचता है?',
      hint: 'न्यूटन का दूसरा नियम (F = Δp / Δt)। संवेग परिवर्तन का समय (time) बढ़ाकर बल का झटका कम करना।',
    },
    {
      id: 'gq3',
      topic: 'Gravitation',
      subject: 'Science',
      question: 'यदि पृथ्वी चंद्रमा को अपने गुरुत्वाकर्षण बल से खींचती है, तो चंद्रमा पृथ्वी से आकर टकरा क्यों नहीं जाता?',
      hint: 'चंद्रमा की कक्षीय गति (orbital speed) और अभिकेंद्रीय बल (centripetal force)।',
    },
    {
      id: 'gq4',
      topic: 'Matter in Our Surroundings',
      subject: 'Science',
      question: '273 K (0°C) पर बर्फ पानी की तुलना में अधिक शीतलन (cooling effect) क्यों प्रदान करती है?',
      hint: 'बर्फ में गलन की गुप्त ऊष्मा (Latent heat of fusion = 3.34 × 10⁵ J/kg) अवशोषित करने की क्षमता होती है।',
    },
    {
      id: 'gq5',
      topic: 'Cell - Fundamental Unit of Life',
      subject: 'Science',
      question: 'लाइसोसोम (Lysosomes) को कोशिका की "आत्मघाती थैली" (Suicidal Bags) क्यों कहा जाता है?',
      hint: 'पाचक एंजाइम (Hydrolytic enzymes) जब कोशिका क्षतिग्रस्त होती है तो अपनी ही कोशिका को पचा डालते हैं।',
    },
  ],
};

export const MultilingualAITutor: React.FC<MultilingualAITutorProps> = ({ grade }) => {
  const [activeMode, setActiveMode] = useState<'ask_doubt' | 'guru_quizzes'>('ask_doubt');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);

  // Guru Quizzes State
  const [currentGuruQIndex, setCurrentGuruQIndex] = useState<number>(0);
  const [guruAnswerText, setGuruAnswerText] = useState<string>('');
  const [showGuruHint, setShowGuruHint] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: grade === 'class10'
        ? `Namaste! I am Advait Guru, your multilingual AI academic tutor for Class 10.
I speak and explain in ALL languages (Hindi, English, Hinglish, Marathi, Bengali, Tamil, Telugu, Gujarati, and worldwide).
Ask me any question in your native language about Science, Mathematics, Social Science, or English!`
        : `Namaste! I am Advait Guru, your multilingual AI academic tutor for Class 9.
I speak and explain in ALL languages (Hindi, English, Hinglish, Marathi, Bengali, Tamil, Telugu, Gujarati, and worldwide).
Ask me any concept question about Newton's laws, Cell biology, Polynomials, or Number systems in your preferred language!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Speech Recognition (Voice Input)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLanguage === 'auto' ? 'en-IN' : selectedLanguage;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLanguage]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = selectedLanguage === 'auto' ? 'en-IN' : selectedLanguage;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Mic start error:', err);
        setIsListening(false);
      }
    }
  };

  // Text-To-Speech (AI Talking Output)
  const speakText = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown symbols for natural audio speech
    const cleanSpeech = text
      .replace(/[#*`_~]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick appropriate voice if available
    const voices = window.speechSynthesis.getVoices();
    if (selectedLanguage !== 'auto' && selectedLanguage !== 'hinglish') {
      const langPrefix = selectedLanguage.split('-')[0];
      const match = voices.find((v) => v.lang.startsWith(langPrefix) || v.lang.includes(selectedLanguage));
      if (match) utterance.voice = match;
    }

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (customPrompt?: string, customLang?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || loading) return;

    const lang = customLang || selectedLanguage;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language: lang,
          grade: grade,
          chatHistory: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server error');
      }

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        languageUsed: lang,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Auto-dispatch student inquiry to advaitinsight1927@gmail.com
      fetch('/api/doubts/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: 'AI Guru Student',
          grade: grade,
          subject: 'AI Guru Chat Query',
          topic: textToSend.slice(0, 45),
          question: textToSend,
          preferredLanguage: lang,
          answer: data.reply,
          source: 'ai_guru',
        }),
      }).catch((err) => console.warn('Auto-sync to faculty email:', err));

      if (autoSpeak) {
        speakText(data.reply, assistantMsg.id);
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: 'I apologize, I encountered a temporary connection glitch. Please ask your question again, and I will explain it thoroughly!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[750px] overflow-hidden text-slate-100">
      {/* Top Header Bar */}
      <div className="bg-slate-950 border-b border-slate-800 p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <AdvaitLogo size={46} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-lg text-white">
                Advait AI Guru — पूछिए अपना कोई भी Doubt
              </h3>
              <span className="text-[10px] font-bold text-sky-400 bg-sky-950 border border-sky-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                All Languages AI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hindi, English, Hinglish, Marathi, Bengali, Tamil, Telugu, Gujarati &amp; worldwide ({grade === 'class10' ? 'Class 10 Board' : 'Class 9 Foundation'})
            </p>
          </div>
        </div>

        {/* Controls: Language Selector & Auto-Voice Toggle */}
        <div className="flex items-center gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500 cursor-pointer pr-8 font-medium"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.native} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Auto Speak Audio Toggle */}
          <button
            onClick={() => {
              if (autoSpeak) window.speechSynthesis?.cancel();
              setAutoSpeak(!autoSpeak);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
              autoSpeak
                ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Automatically speak responses aloud"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
            <span>{autoSpeak ? 'Voice ON' : 'Voice OFF'}</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="bg-slate-950 px-6 py-2 border-b border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMode('ask_doubt')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeMode === 'ask_doubt'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>🗣️ Ask Your Doubt (हम पूछें Doubt)</span>
          </button>
          <button
            onClick={() => setActiveMode('guru_quizzes')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeMode === 'guru_quizzes'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>🧠 Guru Doubts Challenge (AI Guru पूछेगा सवाल)</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
          {activeMode === 'ask_doubt' ? 'Instant AI Doubt Solver' : 'Concept Stress Test'}
        </span>
      </div>

      {activeMode === 'guru_quizzes' ? (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/40">
          {(() => {
            const currentQ = GURU_DOUBT_QUESTIONS[grade][currentGuruQIndex] || GURU_DOUBT_QUESTIONS[grade][0];
            return (
              <div className="max-w-3xl mx-auto space-y-5">
                {/* Question Header */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                        {currentQ.subject} · {currentQ.topic}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      Challenge {currentGuruQIndex + 1} of {GURU_DOUBT_QUESTIONS[grade].length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      AI Guru asks you this conceptual doubt:
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                      {currentQ.question}
                    </h3>
                  </div>

                  {/* Hint Toggle */}
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setShowGuruHint(!showGuruHint)}
                      className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <span>💡</span>
                      <span>{showGuruHint ? 'Hide Concept Hint' : 'Need a Hint / संकेत चाहिए?'}</span>
                    </button>
                    {showGuruHint && (
                      <p className="mt-2 text-xs text-amber-300/90 bg-amber-950/30 p-3 rounded-xl border border-amber-900/40 leading-relaxed animate-fade-in">
                        {currentQ.hint}
                      </p>
                    )}
                  </div>
                </div>

                {/* Answer Composer */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      आपका जवाब / Write or Speak Your Answer:
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Type in any language (Hindi / English / Hinglish etc.)
                    </span>
                  </div>

                  <textarea
                    rows={4}
                    value={guruAnswerText}
                    onChange={(e) => setGuruAnswerText(e.target.value)}
                    placeholder="अपना तर्क या वैज्ञानिक कारण यहाँ लिखें (जैसे: लेंस के फोकस और पोल के बीच रखने पर आभासी प्रतिबिंब बनता है...)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setShowGuruHint(false);
                          setGuruAnswerText('');
                          setCurrentGuruQIndex((prev) =>
                            prev > 0 ? prev - 1 : GURU_DOUBT_QUESTIONS[grade].length - 1
                          );
                        }}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-950 rounded-lg border border-slate-800 transition-colors"
                      >
                        &larr; Previous Doubt
                      </button>
                      <button
                        onClick={() => {
                          setShowGuruHint(false);
                          setGuruAnswerText('');
                          setCurrentGuruQIndex((prev) =>
                            (prev + 1) % GURU_DOUBT_QUESTIONS[grade].length
                          );
                        }}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-950 rounded-lg border border-slate-800 transition-colors"
                      >
                        Next Doubt &rarr;
                      </button>
                    </div>

                    <button
                      onClick={async () => {
                        if (!guruAnswerText.trim() || loading) return;
                        const answerToSend = guruAnswerText;
                        setGuruAnswerText('');
                        setActiveMode('ask_doubt');
                        const evaluationPrompt = `[AI GURU CONCEPT CHALLENGE EVALUATION]
Question asked to student: "${currentQ.question}"
Student's Answer: "${answerToSend}"

Please evaluate the student's answer:
1. Did the student get the core scientific/mathematical concept right? Give an encouraging verdict (e.g. "Outstanding Concept Clarity!" or "Good Attempt! Let's Refine This").
2. Point out specific NCERT keywords or formulas mentioned or missed.
3. Provide the full model board exam answer in the student's language with memory trick.`;
                        await handleSendMessage(evaluationPrompt);
                      }}
                      disabled={!guruAnswerText.trim() || loading}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-md flex items-center gap-2 ${
                        guruAnswerText.trim() && !loading
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <span>Submit Answer to AI Guru (जाँचें)</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        <>
          {/* Suggested Quick Question Prompts */}
          <div className="bg-slate-950/60 border-b border-slate-800/80 px-6 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
            <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap uppercase tracking-wider">
              Quick Ask:
            </span>
            {QUICK_PROMPTS[grade].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.text, p.lang)}
                disabled={loading}
                className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-3 py-1 rounded-full whitespace-nowrap transition-colors shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3.5 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            {msg.role === 'assistant' ? (
              <div className="w-8 h-8 rounded-full bg-slate-950 border border-sky-500/40 flex items-center justify-center shrink-0 shadow-md">
                <AdvaitLogo size={24} />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md">
                You
              </div>
            )}

            {/* Bubble */}
            <div
              className={`rounded-2xl p-4 sm:p-5 text-sm leading-relaxed shadow-lg ${
                msg.role === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

              {/* Message Footer Action Tools */}
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">{msg.timestamp}</span>

                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => speakText(msg.text, msg.id)}
                      className="text-slate-400 hover:text-sky-300 transition-colors flex items-center gap-1 font-mono"
                      title="Listen to this explanation"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                      </svg>
                      <span>{speakingMessageId === msg.id ? 'Stop' : 'Listen'}</span>
                    </button>

                    <button
                      onClick={() => navigator.clipboard.writeText(msg.text)}
                      className="text-slate-400 hover:text-white transition-colors font-mono"
                      title="Copy explanation"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3 mr-auto max-w-xl">
            <div className="w-8 h-8 rounded-full bg-slate-950 border border-sky-500/40 flex items-center justify-center shrink-0">
              <AdvaitLogo size={24} />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-sky-400 flex items-center gap-2.5 rounded-tl-none shadow-md">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>Advait Guru is thinking and formulating the explanation...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer & Mic Bar */}
      <div className="bg-slate-950 border-t border-slate-800 p-4 px-6 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2.5"
        >
          {/* Microphone Voice Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl border transition-all shrink-0 ${
              isListening
                ? 'bg-red-600 border-red-500 text-white animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Click to speak in your language'}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder={
              isListening
                ? 'Listening to your voice... Speak your doubt now!'
                : 'अपना Doubt यहाँ लिखें या बोलें / Ask your doubt in Hindi, English, Marathi, etc...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className={`px-5 py-3 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shrink-0 ${
              inputText.trim() && !loading
                ? 'bg-sky-600 hover:bg-sky-500 text-white cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Ask Doubt / पूछें</span>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
          <span>Supported: English, हिन्दी, मराठी, বাংলা, தமிழ், తెలుగు, ગુજરાતી, ਪੰਜਾਬੀ &amp; 100+ global languages</span>
          <span>Powered by Gemini Multilingual STEM Engine</span>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
