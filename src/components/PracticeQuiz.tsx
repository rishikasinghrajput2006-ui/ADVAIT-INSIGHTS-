import React, { useState } from 'react';
import { GradeLevel, QuizQuestion, SubjectId } from '../types/index.ts';
import { QUIZ_QUESTIONS } from '../data/curriculumData.ts';

interface PracticeQuizProps {
  grade: GradeLevel;
}

export const PracticeQuiz: React.FC<PracticeQuizProps> = ({ grade }) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);

  // Filter questions for the selected grade and optional subject
  const questions: QuizQuestion[] = QUIZ_QUESTIONS.filter((q) => {
    const gradeMatch = q.grade === grade;
    const subjectMatch = selectedSubject === 'all' || q.subjectId === selectedSubject;
    return gradeMatch && subjectMatch;
  });

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);
    setAnsweredCount((prev) => prev + 1);
    if (selectedAnswer === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Loop or finish
      setCurrentIndex(0);
    }
  };

  const handleResetQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setAnsweredCount(0);
  };

  if (questions.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-300">
        <h3 className="text-lg font-bold text-white mb-2">No Practice Questions for Filter</h3>
        <p className="text-xs text-slate-400 mb-4">Switch to 'All Subjects' to see full question banks for {grade.toUpperCase()}.</p>
        <button
          onClick={() => setSelectedSubject('all')}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-semibold"
        >
          Reset Filter to All
        </button>
      </div>
    );
  }

  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold font-mono">
            {grade === 'class10' ? 'Class 10 Board Test Simulator' : 'Class 9 Foundation Assessment'}
          </span>
          <h2 className="text-2xl font-bold font-heading text-white mt-0.5">Competency &amp; Concept Exam Drill</h2>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => {
              setSelectedSubject('all');
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setIsAnswerSubmitted(false);
            }}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedSubject === 'all' ? 'bg-sky-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Subjects
          </button>
          <button
            onClick={() => {
              setSelectedSubject('science');
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setIsAnswerSubmitted(false);
            }}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedSubject === 'science' ? 'bg-sky-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Science
          </button>
          <button
            onClick={() => {
              setSelectedSubject('math');
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setIsAnswerSubmitted(false);
            }}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedSubject === 'math' ? 'bg-sky-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mathematics
          </button>
          <button
            onClick={() => {
              setSelectedSubject('social');
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setIsAnswerSubmitted(false);
            }}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedSubject === 'social' ? 'bg-sky-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Social Science
          </button>
          <button
            onClick={() => {
              setSelectedSubject('english');
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setIsAnswerSubmitted(false);
            }}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedSubject === 'english' ? 'bg-sky-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Progress & Score Strip */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Question</span>
          <span className="font-mono text-white font-bold tabular-nums">
            {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-medium capitalize">
            {currentQ.type === 'assertion_reason' ? 'Assertion & Reason' : currentQ.type.toUpperCase()}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 font-mono">{currentQ.chapter}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Score:</span>
            <span className="font-mono font-bold text-emerald-400 tabular-nums">
              {score} / {answeredCount}
            </span>
          </div>

          <button
            onClick={handleResetQuiz}
            className="text-slate-500 hover:text-slate-300 text-[11px] font-mono underline"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed whitespace-pre-line">
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let optionStyles = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700';

            if (selectedAnswer === idx && !isAnswerSubmitted) {
              optionStyles = 'bg-sky-950/40 border-sky-500 text-sky-200 ring-1 ring-sky-500';
            }

            if (isAnswerSubmitted) {
              if (idx === currentQ.correctAnswer) {
                optionStyles = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold ring-1 ring-emerald-500';
              } else if (selectedAnswer === idx) {
                optionStyles = 'bg-rose-950/40 border-rose-500 text-rose-200 line-through';
              } else {
                optionStyles = 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswerSubmitted}
                className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-start gap-3.5 ${optionStyles}`}
              >
                <span className="w-6 h-6 rounded-md bg-slate-900 border border-slate-700/80 flex items-center justify-center font-mono text-xs shrink-0 font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="leading-relaxed">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Submission & Action Bar */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {isAnswerSubmitted
              ? isCorrect
                ? 'Correct! Well done.'
                : 'Incorrect. Review the detailed board explanation below.'
              : 'Select your answer and submit to verify.'}
          </span>

          <div className="flex items-center gap-3">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className={`px-5 py-2 text-xs font-semibold rounded-lg transition-colors shadow-sm ${
                  selectedAnswer !== null
                    ? 'bg-sky-600 hover:bg-sky-500 text-white cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Restart Test'}</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            )}
          </div>
        </div>

        {/* Detailed Explanation Drawer */}
        {isAnswerSubmitted && (
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 mt-4 animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                {isCorrect ? 'Correct Solution' : 'Model Solution'}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">NCERT Marking Scheme</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {currentQ.explanation}
            </p>

            {currentQ.examTip && (
              <div className="text-xs text-amber-300/90 bg-amber-950/20 p-2.5 rounded border border-amber-900/30 flex items-start gap-2">
                <span className="font-bold text-amber-400">Examiner Tip:</span>
                <span>{currentQ.examTip}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
