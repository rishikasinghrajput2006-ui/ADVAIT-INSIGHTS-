import React, { useState } from 'react';
import { GradeLevel } from '../../types/index.ts';

interface SamplePaperQuestionVaultProps {
  grade: GradeLevel;
  onAskAIGuruWithQuestion?: (questionText: string) => void;
}

interface QuestionCard {
  id: string;
  grade: GradeLevel;
  chapter: string;
  type: 'mcq' | 'sa1' | 'sa2' | 'long' | 'case_study';
  marks: number;
  question: string;
  options?: string[];
  correctOption?: number;
  stepByStepSolution: string;
  markingScheme: string;
  boardYear: string;
}

const MATHEMATICS_VAULT_QUESTIONS: QuestionCard[] = [
  // Class 10
  {
    id: 'q10-1',
    grade: 'class10',
    chapter: 'Real Numbers',
    type: 'mcq',
    marks: 1,
    question: 'If two positive integers a and b are written as a = x³y² and b = xy³, where x and y are prime numbers, then HCF(a, b) is:',
    options: ['xy', 'xy²', 'x³y³', 'x²y²'],
    correctOption: 1,
    stepByStepSolution: 'HCF is the product of the smallest power of each common prime factor involved in the numbers.\nPowers of x: min(3, 1) = 1 => x\nPowers of y: min(2, 3) = 2 => y²\nTherefore, HCF(a, b) = xy².',
    markingScheme: '1 Mark for correct option (B) xy²',
    boardYear: 'CBSE 2024 / 2020 Standard',
  },
  {
    id: 'q10-2',
    grade: 'class10',
    chapter: 'Real Numbers',
    type: 'sa2',
    marks: 3,
    question: 'Prove that √5 is an irrational number using the method of contradiction.',
    stepByStepSolution: '1. Let √5 = a/b where a and b are coprime integers (b ≠ 0, HCF(a, b) = 1).\n2. Squaring both sides: 5 = a²/b² => a² = 5b².\n3. Since 5 divides a², by NCERT Theorem, 5 divides a.\n4. Let a = 5c for some integer c. Substitute: (5c)² = 5b² => 25c² = 5b² => b² = 5c².\n5. Therefore 5 divides b² => 5 divides b.\n6. This implies both a and b share 5 as a common factor, which contradicts that a and b are coprime.\n7. Hence √5 is strictly irrational. (Q.E.D.)',
    markingScheme: '1 Mark for coprime assumption and squaring, 1 Mark for showing 5 divides both a and b, 1 Mark for stating contradiction and concluding.',
    boardYear: 'CBSE 2023, 2022, 2019',
  },
  {
    id: 'q10-3',
    grade: 'class10',
    chapter: 'Polynomials',
    type: 'sa1',
    marks: 2,
    question: 'Find a quadratic polynomial whose zeroes are (3 + √2) and (3 - √2).',
    stepByStepSolution: 'Sum of zeroes (S) = (3 + √2) + (3 - √2) = 6.\nProduct of zeroes (P) = (3 + √2)(3 - √2) = 3² - (√2)² = 9 - 2 = 7.\nA quadratic polynomial is given by k[x² - Sx + P] = k[x² - 6x + 7].\nFor k = 1, required polynomial is x² - 6x + 7.',
    markingScheme: '1 Mark for finding Sum S = 6 and Product P = 7, 1 Mark for formula k(x² - Sx + P) = x² - 6x + 7.',
    boardYear: 'CBSE 2023 Standard',
  },
  {
    id: 'q10-4',
    grade: 'class10',
    chapter: 'Quadratic Equations',
    type: 'long',
    marks: 5,
    question: 'A motor boat whose speed is 18 km/h in still water takes 1 hour more to go 24 km upstream than to return downstream to the same spot. Find the speed of the stream.',
    stepByStepSolution: '1. Let speed of stream = x km/h.\n2. Upstream speed = (18 - x) km/h; Downstream speed = (18 + x) km/h.\n3. Time upstream = 24 / (18 - x); Time downstream = 24 / (18 + x).\n4. Equation: 24/(18 - x) - 24/(18 + x) = 1.\n5. 24[(18 + x - (18 - x)) / (324 - x²)] = 1 => 24(2x) = 324 - x² => 48x = 324 - x².\n6. x² + 48x - 324 = 0 => (x + 54)(x - 6) = 0.\n7. Since speed cannot be negative, x = 6 km/h.\nTherefore, the speed of the stream is 6 km/h.',
    markingScheme: '1 Mark for defining speeds, 2 Marks for forming equation, 1 Mark for quadratic factorization, 1 Mark for rejecting negative root and concluding 6 km/h.',
    boardYear: 'CBSE 2024, 2020, 2018 High-Yield 5-Marker',
  },
  {
    id: 'q10-5',
    grade: 'class10',
    chapter: 'Triangles',
    type: 'long',
    marks: 5,
    question: 'State and prove Basic Proportionality Theorem (Thales Theorem).',
    stepByStepSolution: 'Statement: If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio.\nGiven: In ∆ABC, line DE || BC intersects AB at D and AC at E.\nTo Prove: AD/DB = AE/EC.\nConstruction: Join BE and CD. Draw DM ⊥ AC and EN ⊥ AB.\nProof:\nArea(∆ADE) = 1/2 × AD × EN\nArea(∆BDE) = 1/2 × DB × EN\n=> Area(∆ADE) / Area(∆BDE) = AD / DB  --- (1)\nSimilarly, Area(∆ADE) / Area(∆DEC) = (1/2 × AE × DM) / (1/2 × EC × DM) = AE / EC --- (2)\nSince ∆BDE and ∆DEC are on the same base DE and between same parallels DE and BC:\nArea(∆BDE) = Area(∆DEC) --- (3)\nFrom (1), (2), (3): AD/DB = AE/EC. (Hence Proved)',
    markingScheme: '1 Mark for Statement & Figure, 1 Mark for Given, To Prove & Construction, 2.5 Marks for proof steps and equal area theorem, 0.5 Mark for conclusion.',
    boardYear: 'Compulsory CBSE Theorem (Tested almost every alternative year)',
  },
  {
    id: 'q10-6',
    grade: 'class10',
    chapter: 'Introduction to Trigonometry',
    type: 'sa2',
    marks: 3,
    question: 'Prove the identity: (sin θ - 2 sin³ θ) / (2 cos³ θ - cos θ) = tan θ.',
    stepByStepSolution: 'LHS = (sin θ - 2 sin³ θ) / (2 cos³ θ - cos θ)\n= [sin θ (1 - 2 sin² θ)] / [cos θ (2 cos² θ - 1)]\n= (sin θ / cos θ) × [(1 - 2(1 - cos² θ)) / (2 cos² θ - 1)]\n= tan θ × [(1 - 2 + 2 cos² θ) / (2 cos² θ - 1)]\n= tan θ × [(2 cos² θ - 1) / (2 cos² θ - 1)]\n= tan θ × 1 = tan θ = RHS. (Hence Proved)',
    markingScheme: '1 Mark for factoring out sin θ and cos θ, 1 Mark for substituting sin² θ = 1 - cos² θ, 1 Mark for simplifying to tan θ.',
    boardYear: 'CBSE 2023, 2019 Standard',
  },
  {
    id: 'q10-7',
    grade: 'class10',
    chapter: 'Circles',
    type: 'sa2',
    marks: 3,
    question: 'Prove that the lengths of tangents drawn from an external point to a circle are equal.',
    stepByStepSolution: 'Given: Circle with center O. P is an external point. Tangents PA and PB touch circle at A and B.\nTo Prove: PA = PB.\nConstruction: Join OA, OB, OP.\nProof: In ∆OAP and ∆OBP:\n1. ∠OAP = ∠OBP = 90° (Radius is perpendicular to tangent at point of contact)\n2. OP = OP (Common hypotenuse)\n3. OA = OB (Radii of same circle)\nTherefore, ∆OAP ≅ ∆OBP by RHS congruence criterion.\nHence PA = PB by CPCT. (Hence Proved)',
    markingScheme: '0.5 Mark for Figure, 1 Mark for RHS Congruence, 1.5 Marks for correct proof & CPCT conclusion.',
    boardYear: 'NCERT Theorem 10.2 / CBSE 2024, 2023',
  },
  {
    id: 'q10-8',
    grade: 'class10',
    chapter: 'Statistics',
    type: 'long',
    marks: 5,
    question: 'The median of the following data is 525. Find the values of x and y, if the total frequency is 100:\nClasses: 0-100(2), 100-200(5), 200-300(x), 300-400(12), 400-500(17), 500-600(20), 600-700(y), 700-800(9), 800-900(7), 900-1000(4).',
    stepByStepSolution: '1. Total frequency N = 100 => 76 + x + y = 100 => x + y = 24  --- (1)\n2. Median = 525, which lies in class 500 - 600. So median class is 500 - 600.\n3. Lower limit l = 500, h = 100, f = 20, cf of preceding class = 36 + x.\n4. Median Formula: l + [(N/2 - cf) / f] × h = 525\n5. 500 + [(50 - (36 + x)) / 20] × 100 = 525\n6. 500 + (14 - x) × 5 = 525 => 70 - 5x = 25 => 5x = 45 => x = 9.\n7. From (1): 9 + y = 24 => y = 15.\nAnswer: x = 9, y = 15.',
    markingScheme: '1 Mark for cumulative frequency table, 1 Mark for equation x + y = 24, 2 Marks for median formula substitution, 1 Mark for x = 9 and y = 15.',
    boardYear: 'CBSE 2024, 2020 Standard',
  },
  // Class 9
  {
    id: 'q9-1',
    grade: 'class9',
    chapter: 'Number Systems',
    type: 'sa1',
    marks: 2,
    question: 'Express 0.2353535... in the form p/q, where p and q are integers and q ≠ 0.',
    stepByStepSolution: 'Let x = 0.2353535...  --- (1)\nMultiply (1) by 10 to shift non-repeating digit: 10x = 2.3535... --- (2)\nMultiply (2) by 100 to shift two repeating digits: 1000x = 235.3535... --- (3)\nSubtract (2) from (3): 1000x - 10x = 235.3535... - 2.3535...\n990x = 233 => x = 233 / 990.\nAnswer: 233/990.',
    markingScheme: '1 Mark for forming equations (2) and (3), 1 Mark for subtraction and final fraction 233/990.',
    boardYear: 'Class 9 Annual Exam NCERT Exemplar',
  },
  {
    id: 'q9-2',
    grade: 'class9',
    chapter: 'Heron’s Formula',
    type: 'sa2',
    marks: 3,
    question: 'Find the area of a triangle whose sides are 13 cm, 14 cm and 15 cm using Heron’s formula.',
    stepByStepSolution: 'Side lengths: a = 13 cm, b = 14 cm, c = 15 cm.\n1. Semi-perimeter s = (a + b + c) / 2 = (13 + 14 + 15) / 2 = 42 / 2 = 21 cm.\n2. s - a = 21 - 13 = 8 cm\n   s - b = 21 - 14 = 7 cm\n   s - c = 21 - 15 = 6 cm\n3. Area = √[s(s - a)(s - b)(s - c)]\n   = √[21 × 8 × 7 × 6] = √[(7 × 3) × (4 × 2) × 7 × (3 × 2)]\n   = √[7² × 3² × 2² × 2²] = 7 × 3 × 4 = 84 cm².\nAnswer: Area = 84 cm².',
    markingScheme: '1 Mark for semi-perimeter s = 21 cm, 1.5 Marks for Heron formula application and prime factorization, 0.5 Mark for 84 cm².',
    boardYear: 'Class 9 Annual Exam Regular',
  },
];

export const SamplePaperQuestionVault: React.FC<SamplePaperQuestionVaultProps> = ({
  grade,
  onAskAIGuruWithQuestion,
}) => {
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('q10-2');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isExamPaperMode, setIsExamPaperMode] = useState(false);

  const filteredQuestions = MATHEMATICS_VAULT_QUESTIONS.filter((q) => {
    if (q.grade !== grade) return false;
    if (selectedChapter !== 'all' && q.chapter !== selectedChapter) return false;
    if (selectedType !== 'all' && q.type !== selectedType) return false;
    if (
      searchKeyword &&
      !q.question.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      !q.chapter.toLowerCase().includes(searchKeyword.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const chaptersList = Array.from(
    new Set(MATHEMATICS_VAULT_QUESTIONS.filter((q) => q.grade === grade).map((q) => q.chapter))
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-3xl shrink-0">
            📚
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                CBSE 1000+ Question &amp; Sample Paper Bank
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                {grade === 'class10' ? 'Class 10 Board Standards' : 'Class 9 Foundation'}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold font-heading text-white mt-1">
              NCERT Mathematics Chapter-wise MCQs, PYQs &amp; Model Papers
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              1000+ interactive practice questions with official CBSE step-by-step marking schemes and video explanations by Advait Insights.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsExamPaperMode(!isExamPaperMode)}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 ${
              isExamPaperMode
                ? 'bg-amber-500 text-slate-950 font-extrabold'
                : 'bg-slate-800 text-slate-200 hover:text-white border border-slate-700'
            }`}
          >
            <span>⏱️</span>
            <span>{isExamPaperMode ? 'Exit Mock Exam Mode' : 'Start 80-Mark Mock Paper'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-medium"
          >
            <option value="all">All Mathematics Chapters</option>
            {chaptersList.map((ch) => (
              <option key={ch} value={ch}>
                {ch}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-medium"
          >
            <option value="all">All Question Types</option>
            <option value="mcq">Section A: 1-Mark MCQs</option>
            <option value="sa1">Section B: 2-Marks Short Answer</option>
            <option value="sa2">Section C: 3-Marks Derivations</option>
            <option value="long">Section D: 5-Marks Long HOTS</option>
          </select>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search theorem or question..."
            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 text-xs"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const isExpanded = expandedId === q.id;
          return (
            <div
              key={q.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 transition-all hover:border-slate-700 shadow-md space-y-4"
            >
              {/* Question Header Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800/80 font-bold">
                    Q{idx + 1} · {q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}
                  </span>
                  <span className="text-slate-400 font-semibold">{q.chapter}</span>
                </div>
                <span className="text-amber-400/90 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                  {q.boardYear}
                </span>
              </div>

              {/* Question Body */}
              <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                {q.question}
              </h3>

              {/* MCQ Options */}
              {q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={`p-2.5 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                        isExpanded && optIdx === q.correctOption
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>{isExpanded ? 'Hide Solution ▲' : 'View Step-by-Step Marking Scheme ▼'}</span>
                </button>

                <div className="flex items-center gap-2">
                  {onAskAIGuruWithQuestion && (
                    <button
                      onClick={() => onAskAIGuruWithQuestion(q.question)}
                      className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>🤖 Ask AI Guru Doubt</span>
                    </button>
                  )}

                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=Advaitinsights1927@gmail.com&su=Question%20Help%20${encodeURIComponent(q.chapter)}&body=${encodeURIComponent(`Hello Harsh Sir,\n\nI need help understanding this question from the Practice Vault:\n\n${q.question}\n\nChapter: ${q.chapter}\nMarks: ${q.marks}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>✉️ Send Doubt to Harsh Sir</span>
                  </a>
                </div>
              </div>

              {/* Collapsible Solution & Marking Scheme */}
              {isExpanded && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs leading-relaxed animate-fade-in">
                  <div>
                    <span className="font-bold text-emerald-400 uppercase font-mono block mb-1">
                      CBSE Model Answer &amp; Step-by-Step Solution:
                    </span>
                    <p className="whitespace-pre-line text-slate-200 font-sans">{q.stepByStepSolution}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="font-bold text-amber-300 uppercase font-mono block mb-1">
                      Official Marking Scheme Breakdown:
                    </span>
                    <p className="text-slate-400 font-mono text-[11px]">{q.markingScheme}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
