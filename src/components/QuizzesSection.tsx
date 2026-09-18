import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Volume2,
  RotateCcw,
  Sparkles,
  Flame,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, QuizAttempt } from '../types';
import { COMPREHENSIVE_QUIZ_QUESTIONS } from '../data/quizzesData';
import { speakEnglish, speakArabic, playUiSound } from '../utils/speech';
import { useLanguage } from '../context/LanguageContext';

interface QuizzesSectionProps {
  onSaveQuizResult: (result: QuizAttempt) => void;
  quizHistory: QuizAttempt[];
}

export const QuizzesSection: React.FC<QuizzesSectionProps> = ({
  onSaveQuizResult,
  quizHistory,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<Record<string, boolean>>({});
  const [shakingQuestionId, setShakingQuestionId] = useState<string | null>(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const totalQuestions = COMPREHENSIVE_QUIZ_QUESTIONS.length;
  const currentQuestion: QuizQuestion = COMPREHENSIVE_QUIZ_QUESTIONS[currentQIndex];

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isAnswerRevealed[questionId] || isQuizCompleted) return;

    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setIsAnswerRevealed((prev) => ({ ...prev, [questionId]: true }));

    const question = COMPREHENSIVE_QUIZ_QUESTIONS.find((q) => q.id === questionId);
    const isCorrect = question && optionIndex === question.correctIndex;

    if (isCorrect) {
      playUiSound('success');
      // Visual celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {}

      // Male voice praise
      speakArabic('إجابة صحيحة، أحسنت!');
    } else {
      playUiSound('pop');
      // Gentle shaking visual effect
      setShakingQuestionId(questionId);
      setTimeout(() => setShakingQuestionId(null), 800);

      // Male voice explanation
      if (question) {
        const correctOpt = question.options[question.correctIndex];
        speakArabic(`إجابة غير صحيحة. الإجابة الصحيحة هي: ${correctOpt}`);
      }
    }
  };

  const handleNext = () => {
    if (currentQIndex < totalQuestions - 1) {
      playUiSound('tap');
      setCurrentQIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      playUiSound('tap');
      setCurrentQIndex((prev) => prev - 1);
    }
  };

  const finishQuiz = () => {
    let score = 0;
    COMPREHENSIVE_QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });

    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 60;

    const attempt: QuizAttempt = {
      id: 'quiz-' + Date.now(),
      date: new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US'),
      score,
      totalQuestions,
      percentage,
      passed,
    };

    setFinalScore(score);
    setIsQuizCompleted(true);
    onSaveQuizResult(attempt);

    if (passed) {
      playUiSound('success');
      try {
        confetti({ particleCount: 120, spread: 80 });
      } catch (e) {}
      speakArabic(`تهانينا! أحرزت ${score} من ${totalQuestions}. أداء ممتاز!`);
    } else {
      playUiSound('pop');
      speakArabic(`أحرزت ${score} من ${totalQuestions}. حاول مرة أخرى لتحقيق نتيجة أفضل!`);
    }
  };

  const handleRetakeQuiz = () => {
    playUiSound('chime');
    setSelectedAnswers({});
    setIsAnswerRevealed({});
    setCurrentQIndex(0);
    setIsQuizCompleted(false);
    setFinalScore(0);
  };

  const isCurrentRevealed = !!isAnswerRevealed[currentQuestion?.id];
  const currentSelectedOpt = selectedAnswers[currentQuestion?.id];
  const isCurrentCorrect = currentSelectedOpt === currentQuestion?.correctIndex;

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Quiz Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-600/80 text-purple-100">
              {isAr ? 'اختبار المعرفة' : 'Knowledge Test'}
            </span>
            <span className="text-xs text-purple-200">
              {isAr ? 'تأثيرات بصرية وصوتية تفاعلية' : 'Audio & visual feedback'}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold">
            {isAr ? 'الاختبارات التفاعلية الفورية' : 'Interactive English Quizzes'}
          </h2>
          <p className="text-xs text-purple-200/90 max-w-md mt-0.5 leading-relaxed">
            {isAr
              ? 'اختبر مستواك: عند الإجابة الصحيحة تحصل على احتفال وصوت تشجيعي، وعند الخطأ يتم توضيح الإجابة فوراً بصوت رجل وقور.'
              : 'Test your skills: celebration on correct answers, gentle shake & voice guidance on mistakes.'}
          </p>
        </div>

        {/* Question Counter Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold font-mono">
            {currentQIndex + 1} / {totalQuestions}
          </span>
        </div>
      </div>

      {/* Main Quiz Flow */}
      {!isQuizCompleted ? (
        <div className="space-y-4">
          {/* Progress dots bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {COMPREHENSIVE_QUIZ_QUESTIONS.map((q, idx) => {
              const isDone = isAnswerRevealed[q.id];
              const isCorrect = selectedAnswers[q.id] === q.correctIndex;
              const isCurrent = idx === currentQIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    playUiSound('tap');
                    setCurrentQIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all flex-1 min-w-[18px] ${
                    isCurrent
                      ? 'bg-purple-600 scale-y-125'
                      : isDone
                      ? isCorrect
                        ? 'bg-teal-500'
                        : 'bg-rose-400'
                      : 'bg-slate-200'
                  }`}
                />
              );
            })}
          </div>

          {/* Question Card */}
          <div
            className={`p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5 transition-all duration-300 ${
              shakingQuestionId === currentQuestion.id
                ? 'animate-shake border-rose-400 ring-2 ring-rose-400/20'
                : ''
            }`}
          >
            {/* Question Header */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-700">
                {isAr ? `السؤال رقم ${currentQIndex + 1}` : `Question ${currentQIndex + 1}`}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {isAr ? currentQuestion.questionAr : (currentQuestion.questionEn || currentQuestion.questionAr)}
              </h3>
              {currentQuestion.questionEn && isAr && (
                <p className="text-xs text-slate-500 font-serif">
                  {currentQuestion.questionEn}
                </p>
              )}
            </div>

            {/* Options List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = currentSelectedOpt === optIdx;
                let btnStyle = 'bg-slate-50 hover:bg-purple-50/50 border-slate-200 text-slate-800 hover:border-purple-300';

                if (isCurrentRevealed) {
                  if (optIdx === currentQuestion.correctIndex) {
                    btnStyle = 'bg-teal-100 border-teal-500 text-teal-950 font-bold ring-2 ring-teal-500/20';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-100 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-500/20';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    disabled={isCurrentRevealed}
                    onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                    className={`p-4 rounded-2xl border text-start transition-all flex items-center justify-between gap-2 shadow-2xs active:scale-98 cursor-pointer ${btnStyle}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="font-serif text-xs sm:text-sm font-medium">{opt}</span>
                    </div>

                    {isCurrentRevealed && optIdx === currentQuestion.correctIndex && (
                      <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                    )}
                    {isCurrentRevealed && isSelected && optIdx !== currentQuestion.correctIndex && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback Explanation Card */}
            {isCurrentRevealed && (
              <div
                className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-1.5 transition-all animate-in fade-in duration-200 ${
                  isCurrentCorrect
                    ? 'bg-teal-50/80 border-teal-200 text-teal-950'
                    : 'bg-rose-50/80 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    {isCurrentCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        <span>{isAr ? 'أحسنت! إجابة ممتازة' : 'Great Job! Correct'}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>{isAr ? 'توضيح الإجابة الصحيحة:' : 'Correct Answer Explanation:'}</span>
                      </>
                    )}
                  </span>

                  <button
                    onClick={() => {
                      playUiSound('tap');
                      speakArabic(currentQuestion.explanationAr);
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-white/70 px-2.5 py-1 rounded-lg border border-slate-200"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'استمع للشرح' : 'Listen'}</span>
                  </button>
                </div>
                <p>{currentQuestion.explanationAr}</p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={handlePrev}
                disabled={currentQIndex === 0}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all ${
                  currentQIndex === 0
                    ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs active:scale-95'
                }`}
              >
                {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{isAr ? 'السؤال السابق' : 'Previous'}</span>
              </button>

              <button
                onClick={handleNext}
                disabled={!isCurrentRevealed}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 ${
                  isCurrentRevealed
                    ? 'bg-purple-700 hover:bg-purple-800 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>
                  {currentQIndex < totalQuestions - 1
                    ? (isAr ? 'السؤال التالي' : 'Next Question')
                    : (isAr ? 'عرض النتيجة النهائية' : 'View Results')}
                </span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Final Result Screen */
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 text-center space-y-5 shadow-md max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-teal-500 text-white flex items-center justify-center mx-auto text-4xl shadow-lg">
            {finalScore / totalQuestions >= 0.8 ? '🏆' : finalScore / totalQuestions >= 0.6 ? '🌟' : '💪'}
          </div>

          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              {finalScore / totalQuestions >= 0.6
                ? (isAr ? 'تهانينا! لقد اجتزت الاختبار بنجاح' : 'Congratulations! You Passed')
                : (isAr ? 'محاولة جيدة! واصل التدريب' : 'Good Try! Keep Practicing')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {isAr ? 'تم تقييم إجاباتك وتسجيل النتيجة في ملف إنجازك' : 'Your performance has been evaluated and saved'}
            </p>
          </div>

          {/* Score Display Card */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-purple-950 flex items-center justify-around">
            <div>
              <span className="text-xs text-purple-700 block">{isAr ? 'النقاط' : 'Score'}</span>
              <span className="text-2xl font-extrabold text-purple-900">
                {finalScore} / {totalQuestions}
              </span>
            </div>
            <div className="w-px h-8 bg-purple-200"></div>
            <div>
              <span className="text-xs text-purple-700 block">{isAr ? 'النسبة المئوية' : 'Percentage'}</span>
              <span className="text-2xl font-extrabold text-purple-900">
                {Math.round((finalScore / totalQuestions) * 100)}%
              </span>
            </div>
          </div>

          <button
            onClick={handleRetakeQuiz}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isAr ? 'إعادة الاختبار من البداية' : 'Retake Quiz'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
