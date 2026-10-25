import React, { useState, useEffect } from 'react';

export interface JoshWord {
  id: number;
  wordHindi: string;
  wordEnglish: string;
  tagline: string;
  fullQuoteHindi: string;
  fullQuoteEnglish: string;
  authorOrSpirit: string;
  focusArea: string;
  themeColor: string;
}

export const JOSH_WORDS_COLLECTION: JoshWord[] = [
  {
    id: 1,
    wordHindi: 'अजेय',
    wordEnglish: 'UNCONQUERABLE',
    tagline: 'जो किसी भी मुश्किल सवाल के आगे नहीं झुकता!',
    fullQuoteHindi:
      'मुश्किलें सिर्फ उन पत्थरों की तरह हैं जो तुम्हारी धार को तेज़ करने के लिए बनी हैं। आज अगर एक घंटा ज़्यादा पढ़ोगे, तो कल बोर्ड रिजल्ट के दिन तुम्हारे माता-पिता की आँखों में गर्व के आँसू होंगे। उठो, जागो और कलम को अपनी तलवार बनाओ!',
    fullQuoteEnglish:
      'Hardships are merely grindstones sharpening your intellect. Put in that extra hour today, so on board exam result day, your parents weep tears of uncontainable pride. Arise, conquer every equation!',
    authorOrSpirit: '#ADVAITIN Fire Manifesto',
    focusArea: 'Unbreakable Willpower',
    themeColor: 'from-amber-500 via-orange-500 to-red-600',
  },
  {
    id: 2,
    wordHindi: 'प्रचंड',
    wordEnglish: 'FEROCIOUS DISCIPLINE',
    tagline: 'जब ध्यान ऐसा हो कि शोर भी खामोश हो जाए!',
    fullQuoteHindi:
      'आलस को अपनी कब्र बना लो या अपनी मेहनत से एक नया इतिहास लिख दो! जब पूरा देश सो रहा होता है, तब एक सच्चा टॉपर अपनी कॉपी पर फार्मूला सिद्ध कर रहा होता है। तुम्हारा एक-एक मिनट तुम्हारी तकदीर तराश रहा है।',
    fullQuoteEnglish:
      'Either let lethargy bury your dreams, or let relentless focus script history! When the world slumbers, a true champion proves mathematical theorems under the midnight lamp. Every second is forging your destiny.',
    authorOrSpirit: 'Daily Josh Sutra',
    focusArea: 'Total Focus',
    themeColor: 'from-rose-500 via-red-600 to-amber-500',
  },
  {
    id: 3,
    wordHindi: 'साधना',
    wordEnglish: 'SACRED MASTERY',
    tagline: 'शिक्षा कोई मजबूरी नहीं, तुम्हारा सबसे बड़ा हथियार है!',
    fullQuoteHindi:
      'गणित से डरो मत, उसे अपनी ताक़त बनाओ। एक-एक स्टेप, एक-एक कैलकुलेशन तुम्हारी एकाग्रता की तपस्या है। अगर तुम सवाल को 5 बार गलत करके भी 6वीं बार सही करने का दम रखते हो, तो दुनिया का कोई एग्जाम तुम्हें हरा नहीं सकता!',
    fullQuoteEnglish:
      'Do not fear mathematics; transform it into your greatest weapon. If you have the tenacity to attempt a problem five times and nail it on the sixth, no examination on Earth can withstand your grit!',
    authorOrSpirit: 'Advait Insights Core Oath',
    focusArea: 'Resilience in Math',
    themeColor: 'from-sky-500 via-blue-600 to-indigo-700',
  },
  {
    id: 4,
    wordHindi: 'अडिग',
    wordEnglish: 'UNSHAKABLE RESOLVE',
    tagline: 'परिस्थितियां कैसी भी हों, लक्ष्य नहीं बदलेगा!',
    fullQuoteHindi:
      'हवाओं से कह दो अपनी औकात में रहें, क्योंकि हमारे हौसले पंखों से नहीं, हमारे इरादों से उड़ते हैं। 100 में से 100 लाने का संकल्प लिया है, तो जब तक आखिरी नंबर हासिल न हो जाए, आराम शब्द तुम्हारी डिक्शनरी से मिट जाना चाहिए!',
    fullQuoteEnglish:
      'Tell the tempests to back down, for our ascent is powered by indestructible resolve, not mere luck. If the target is 100/100, the word "rest" ceases to exist until victory is sealed!',
    authorOrSpirit: 'Topper Mindset Code',
    focusArea: 'Target 100%',
    themeColor: 'from-emerald-500 via-teal-600 to-cyan-600',
  },
  {
    id: 5,
    wordHindi: 'पराक्रम',
    wordEnglish: 'VALIANT ACTION',
    tagline: 'सोचने से कहाँ मिलते हैं तमन्नाओं के शहर, चलना भी जरूरी है मंजिल पाने के लिए!',
    fullQuoteHindi:
      'सपनों को सिर्फ आँखों में मत रखो, उन्हें अपनी दिनचर्या बनाओ। किताब खोलना अगर जंग जैसा लगे, तो याद रखना कि जीतने वाला कभी मैदान छोड़कर नहीं भागता। आज की तुम्हारी मेहनत, कल तुम्हारी पहचान बनेगी!',
    fullQuoteEnglish:
      'Wishing alone will never build fortresses—sweat and relentless execution will. If opening the textbook feels like stepping onto a battlefield, remember: legends never flee the arena. Today’s sweat is tomorrow’s legacy!',
    authorOrSpirit: 'Warrior of Wisdom',
    focusArea: 'Daily Consistency',
    themeColor: 'from-purple-600 via-indigo-600 to-sky-500',
  },
  {
    id: 6,
    wordHindi: 'विजयी भव',
    wordEnglish: 'DESTINED TO TRIUMPH',
    tagline: 'हार मान लेना हमारी फितरत में नहीं है!',
    fullQuoteHindi:
      'किस्मत का रोना वो रोते हैं जिनमें मेहनत करने का माद्दा नहीं होता। तुम्हारे पास दिमाग है, हाथ में कलम है और साथ में अद्वैत इनसाइट्स की ताक़त। अब कोई बहाना नहीं चलेगा—सिर्फ पढ़ाई, सिर्फ प्रैक्टिस और सिर्फ जीत!',
    fullQuoteEnglish:
      'Excuses belong to those who shrink from the anvil of toil. You possess the mind, the pen, and the boundless guidance of Advait Insights. No more excuses—only practice, only mastery, only triumph!',
    authorOrSpirit: 'Advaitian Victory Chant',
    focusArea: 'Absolute Confidence',
    themeColor: 'from-amber-400 via-yellow-500 to-orange-600',
  },
  {
    id: 7,
    wordHindi: 'जिजीविषा',
    wordEnglish: 'BURNING DESIRE',
    tagline: 'खुद को इतना काबिल बनाओ कि लोग तुम्हें खोकर पछताएं!',
    fullQuoteHindi:
      'हर टॉपर भी कभी तुम्हारी तरह ही शुरुआत करता था। फर्क सिर्फ इतना है कि उसने हार मानने से इनकार कर दिया। अपनी कमजोरियों को एक-एक करके खत्म करो। आज का दिन तुम्हारा है, इसे पूरी शिद्दत से जियो!',
    fullQuoteEnglish:
      'Every state topper once stood exactly where you stand now. The only difference: they simply refused to surrender. Demolish your doubts one question at a time. Seize this day with unmatched vigor!',
    authorOrSpirit: 'Board Topper Secret',
    focusArea: 'Self-Belief',
    themeColor: 'from-cyan-500 via-blue-500 to-indigo-600',
  },
];

interface TrueWordsSectionProps {
  onStartPractice?: () => void;
  onOpenAIGuru?: () => void;
}

export const TrueWordsSection: React.FC<TrueWordsSectionProps> = ({
  onStartPractice,
  onOpenAIGuru,
}) => {
  // Day of year calculation for automatic daily rotation
  const getDayOfYearIndex = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear % JOSH_WORDS_COLLECTION.length;
  };

  const [currentIndex, setCurrentIndex] = useState<number>(getDayOfYearIndex);
  const [joshClicks, setJoshClicks] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('advait_josh_counter');
      return stored ? parseInt(stored, 10) : 108;
    } catch {
      return 108;
    }
  });
  const [hasVowedToday, setHasVowedToday] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const current = JOSH_WORDS_COLLECTION[currentIndex];

  const handleNextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % JOSH_WORDS_COLLECTION.length);
    setCopied(false);
  };

  const handlePrevWord = () => {
    setCurrentIndex((prev) => (prev - 1 + JOSH_WORDS_COLLECTION.length) % JOSH_WORDS_COLLECTION.length);
    setCopied(false);
  };

  const handleBoostJosh = () => {
    const updated = joshClicks + 1;
    setJoshClicks(updated);
    setHasVowedToday(true);
    try {
      localStorage.setItem('advait_josh_counter', updated.toString());
    } catch {
      // ignore
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${current.wordHindi}. ${current.tagline}. ${current.fullQuoteHindi}`
    );
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyQuote = () => {
    const text = `🔥 TRUE WORDS • दैनिक जोश शब्द: "${current.wordHindi}" (${current.wordEnglish})\n"${current.tagline}"\n\n${current.fullQuoteHindi}\n\n— ${current.authorOrSpirit} | Advait Insights #ADVAITIN`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full relative overflow-hidden rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-[#0c0517] via-[#0b0c20] to-[#040814] p-6 sm:p-8 shadow-2xl text-slate-100 select-none">
      {/* Background Animated Energy Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Tagline & Daily Badge */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-xl shadow-lg shadow-orange-950/60 font-black animate-bounce">
            🔥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black uppercase tracking-widest text-amber-400">
                TRUE WORDS • सच्चा जोश व संकल्प
              </span>
              <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-bold animate-pulse">
                TODAY'S POWER WORD
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              हर दिन नया जोश — आलस छोड़ो, टॉपर बनो!
            </h3>
          </div>
        </div>

        {/* Next / Previous Word Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrevWord}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            title="पिछला जोश शब्द (Previous Word)"
          >
            ◀
          </button>
          <span className="text-xs font-mono text-slate-400 px-2">
            {currentIndex + 1} / {JOSH_WORDS_COLLECTION.length}
          </span>
          <button
            onClick={handleNextWord}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black transition-all shadow-md cursor-pointer text-xs flex items-center gap-1.5"
            title="अगला जोश शब्द (Next True Word)"
          >
            <span>अगला जोश बाण 🔥</span>
            <span>▶</span>
          </button>
        </div>
      </div>

      {/* Main Feature Word Display */}
      <div className="relative z-10 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Huge High-Impact Word */}
        <div className="lg:col-span-4 text-center lg:text-left space-y-2">
          <span className="inline-block text-[11px] font-mono font-bold tracking-widest uppercase text-sky-400 bg-sky-950/60 border border-sky-600/40 px-3 py-1 rounded-full">
            {current.focusArea}
          </span>

          <div className="relative inline-block lg:block">
            <h1 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 font-heading tracking-tight leading-none drop-shadow-md">
              {current.wordHindi}
            </h1>
            <div className="text-base sm:text-lg font-mono font-extrabold tracking-widest text-slate-300 uppercase mt-1">
              {current.wordEnglish}
            </div>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-amber-300/90 italic">
            "{current.tagline}"
          </p>
        </div>

        {/* Right Column: Inspiring Quote & Student Fire Message */}
        <div className="lg:col-span-8 bg-slate-950/70 border border-amber-500/30 rounded-2xl p-5 sm:p-7 relative shadow-inner space-y-4">
          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            <span className="text-amber-400 text-xl font-serif">“</span>
            {current.fullQuoteHindi}
            <span className="text-amber-400 text-xl font-serif">”</span>
          </div>

          <div className="text-[11px] text-slate-400 font-mono italic border-t border-slate-800/80 pt-3">
            English Translation: "{current.fullQuoteEnglish}"
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{current.authorOrSpirit}</span>
            </div>

            {/* Audio Voice & Copy Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeak}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSpeaking
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
                title="Sunne ke liye tap karein (Listen to Motivation)"
              >
                <span>{isSpeaking ? '⏹️ Stop Voice' : '🔊 आवाज़ में सुनो'}</span>
              </button>

              <button
                onClick={handleCopyQuote}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                title="Copy quote for WhatsApp / Status"
              >
                <span>{copied ? '✅ Copied!' : '📋 Copy Quote'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Josh Oath Bar */}
      <div className="relative z-10 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBoostJosh}
            className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all transform active:scale-95 shadow-lg flex items-center gap-2 cursor-pointer ${
              hasVowedToday
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 ring-2 ring-emerald-400'
                : 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white ring-2 ring-amber-400/60 animate-pulse'
            }`}
          >
            <span className="text-lg">🔥</span>
            <span>
              {hasVowedToday ? 'संकल्प ले लिया! (Aaj Phod Denge)' : 'संकल्प लें: मैं आज नहीं रुकूँगा!'}
            </span>
          </button>

          <div className="text-[11px] font-mono text-slate-400">
            <span className="text-amber-400 font-black text-sm">{joshClicks}</span> Advaitians ने आज पढ़ाई का संकल्प लिया
          </div>
        </div>

        {/* Quick Action to Channel Josh into Study */}
        <div className="flex items-center gap-2.5">
          {onStartPractice && (
            <button
              onClick={onStartPractice}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>📝 Solve 1000+ PYQs</span>
            </button>
          )}

          {onOpenAIGuru && (
            <button
              onClick={onOpenAIGuru}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>🤖 Ask Doubt to AI Guru</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
