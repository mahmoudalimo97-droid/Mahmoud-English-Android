import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Volume2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Clock,
  Check,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, QuizQuestion, QuizAttempt } from '../types';
import { LESSONS_DATA } from '../data/lessonsData';
import { COMPREHENSIVE_QUIZ_QUESTIONS } from '../data/quizzesData';
import { speakEnglish, speakArabic, playUiSound } from '../utils/speech';
import { LessonVisualDiagram } from './LessonVisualDiagram';
import { useLanguage } from '../context/LanguageContext';

interface LessonsAndQuizzesProps {
  onSaveQuizResult: (result: QuizAttempt) => void;
  quizHistory: QuizAttempt[];
}

export const LessonsAndQuizzes: React.FC<LessonsAndQuizzesProps> = ({
  onSaveQuizResult,
  quizHistory,
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'lessons' | 'exam'>('lessons');
  const [expandedLessonId, setExpandedLessonId] = useState<string>(LESSONS_DATA[0].id);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(
    quizHistory.length > 0 ? quizHistory[0] : null
  );

  const toggleLesson = (id: string) => {
    playUiSound('tap');
    setExpandedLessonId(expandedLessonId === id ? '' : id);
  };

  const markLessonCompleted = (id: string) => {
    playUiSound('success');
    setCompletedLessons((prev) => ({ ...prev, [id]: true }));
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    playUiSound('pop');
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    COMPREHENSIVE_QUIZ_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });

    const total = COMPREHENSIVE_QUIZ_QUESTIONS.length;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 60;

    const attempt: QuizAttempt = {
      id: 'quiz-' + Date.now(),
      date: new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US'),
      score,
      totalQuestions: total,
      percentage,
      passed,
    };

    setIsSubmitted(true);
    setLastAttempt(attempt);
    onSaveQuizResult(attempt);

    if (passed) {
      playUiSound('success');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    } else {
      playUiSound('pop');
    }
  };

  const handleResetQuiz = () => {
    playUiSound('tap');
    setUserAnswers({});
    setIsSubmitted(false);
  };

  return (
    <div className="space-y-5">
      {/* Navigation Pill Tabs */}
      <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex gap-2 w-full">
          <button
            onClick={() => {
              playUiSound('tap');
              setActiveTab('lessons');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'lessons'
                ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>
              {t('lessonsTab')} ({LESSONS_DATA.length})
            </span>
          </button>

          <button
            onClick={() => {
              playUiSound('tap');
              setActiveTab('exam');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'exam'
                ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{t('quizTab')}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: LESSONS */}
      {activeTab === 'lessons' ? (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50/40 to-teal-50/30 border border-blue-200/80 text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-1">
              <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <span>{t('lessonsHeroTitle')}</span>
                <span className="text-[11px] bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full font-sans font-semibold">
                  {language === 'ar' ? 'مخططات تفاعلية' : 'Interactive Diagrams'}
                </span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('lessonsHeroSubtitle')}
              </p>
            </div>
            <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-xl border border-blue-200 text-blue-800 shrink-0 self-start sm:self-auto shadow-2xs">
              {Object.keys(completedLessons).length} / {LESSONS_DATA.length} {t('lessonCompletedBadge')}
            </span>
          </div>

          <div className="space-y-3.5">
            {LESSONS_DATA.map((lesson, index) => {
              const isExpanded = expandedLessonId === lesson.id;
              const isDone = completedLessons[lesson.id];

              const levelLabel =
                lesson.level === 'مبتدئ'
                  ? t('levelBeginner')
                  : lesson.level === 'متوسط'
                  ? t('levelIntermediate')
                  : t('levelAdvanced');

              return (
                <div
                  key={lesson.id}
                  className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-xs transition-all"
                >
                  {/* Lesson Header Accordion */}
                  <div
                    onClick={() => toggleLesson(lesson.id)}
                    className="p-4 cursor-pointer flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center text-xs font-bold font-serif border border-blue-100">
                        0{index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {language === 'ar' ? lesson.titleAr : lesson.titleEn}
                          </h4>
                          {isDone && (
                            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-serif">
                          {language === 'ar' ? lesson.titleEn : lesson.titleAr}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md hidden sm:inline">
                        {levelLabel}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{t('durationLabel', { min: lesson.durationMin })}</span>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Lesson Content */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/40 space-y-4">
                      {/* Arabic Explanation */}
                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
                        {lesson.summaryAr}
                      </div>

                      {/* Visual Rule Diagram */}
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                        <h5 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>{t('lessonDiagramTitle')}</span>
                        </h5>
                        <LessonVisualDiagram lessonId={lesson.id} />
                      </div>

                      {/* Sections with Examples */}
                      {lesson.sections && lesson.sections.length > 0 && (
                        <div className="space-y-3">
                          {lesson.sections.map((sec, secIdx) => (
                            <div
                              key={secIdx}
                              className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs space-y-2"
                            >
                              <h5 className="font-bold text-slate-800 text-xs sm:text-sm">
                                {sec.headingAr}
                              </h5>
                              <p className="text-slate-600 leading-relaxed">{sec.explanationAr}</p>
                              {sec.englishExamples && sec.englishExamples.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                  {sec.englishExamples.map((ex, exIdx) => (
                                    <div
                                      key={exIdx}
                                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 shadow-2xs"
                                    >
                                      <div>
                                        <p className="font-serif font-bold text-slate-900 text-xs">
                                          {ex.en}
                                        </p>
                                        <p className="text-teal-800 text-[11px] mt-0.5">
                                          {ex.ar}
                                        </p>
                                      </div>
                                      <button
                                        onClick={() => {
                                          playUiSound('tap');
                                          speakEnglish(ex.en);
                                        }}
                                        title={t('listenWord')}
                                        className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 transition-colors shrink-0"
                                      >
                                        <Volume2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Key Tips */}
                      {lesson.keyTips && lesson.keyTips.length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200 text-xs space-y-1.5 text-amber-950">
                          <span className="font-bold flex items-center gap-1 text-amber-900">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>{t('keyRulesTitle')}</span>
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-amber-900">
                            {lesson.keyTips.map((tip, idx) => (
                              <li key={idx}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Mark Complete Action */}
                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => markLessonCompleted(lesson.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isDone
                              ? 'bg-teal-100 text-teal-900 border border-teal-300'
                              : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-xs'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>
                            {isDone ? t('lessonCompletedBadge') : t('markLessonComplete')}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* SECTION 2: COMPREHENSIVE QUIZ */
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="inline-block text-[11px] font-semibold bg-blue-700/80 text-blue-100 px-2.5 py-0.5 rounded-full mb-1">
                {t('quizTab')}
              </span>
              <h4 className="text-base sm:text-lg font-bold">
                {t('quizHeroTitle')}
              </h4>
              <p className="text-xs text-blue-200/90 max-w-md">
                {t('quizHeroSubtitle')}
              </p>
            </div>

            {isSubmitted && lastAttempt && (
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
                <span className="text-xl font-bold font-serif text-amber-300">
                  {lastAttempt.percentage}%
                </span>
                <p className="text-[11px] text-slate-200">
                  {t('scoreResultBadge', {
                    score: lastAttempt.score,
                    total: lastAttempt.totalQuestions,
                    pct: lastAttempt.percentage,
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Quiz Questions List */}
          <div className="space-y-3.5">
            {COMPREHENSIVE_QUIZ_QUESTIONS.map((q, qIndex) => {
              const selectedOpt = userAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = isAnswered && selectedOpt === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`p-4 sm:p-5 rounded-3xl bg-white border transition-all shadow-xs ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-teal-400 bg-teal-50/20'
                        : 'border-rose-300 bg-rose-50/20'
                      : 'border-slate-200/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400">
                        {t('questionLabel', {
                          current: qIndex + 1,
                          total: COMPREHENSIVE_QUIZ_QUESTIONS.length,
                        })}
                      </span>
                      <h5 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                        {language === 'ar' ? q.questionAr : (q.questionEn || q.questionAr)}
                      </h5>
                    </div>

                    {isSubmitted && (
                      <span className="shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-teal-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-500" />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      let btnStyle =
                        'bg-slate-50 border-slate-200 hover:border-blue-300 text-slate-800';

                      if (isSubmitted) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-teal-100 border-teal-400 text-teal-950 font-bold';
                        } else if (isOptionSelected) {
                          btnStyle = 'bg-rose-100 border-rose-400 text-rose-950 font-bold';
                        } else {
                          btnStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                        }
                      } else if (isOptionSelected) {
                        btnStyle =
                          'bg-gradient-to-r from-blue-700 to-indigo-700 text-white border-blue-600 shadow-xs font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isSubmitted}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`p-3 rounded-2xl border text-xs sm:text-sm text-start transition-all flex items-center gap-2 active:scale-98 ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="font-serif">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {isSubmitted && q.explanationAr && (
                    <div className="mt-3 p-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-slate-900 block mb-0.5">
                        {t('explanationLabel')}
                      </span>
                      <p>{q.explanationAr}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit / Reset Action Buttons */}
          <div className="p-4 bg-white rounded-3xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={
                  Object.keys(userAnswers).length < COMPREHENSIVE_QUIZ_QUESTIONS.length
                }
                className={`w-full py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
                  Object.keys(userAnswers).length === COMPREHENSIVE_QUIZ_QUESTIONS.length
                    ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 hover:from-blue-800 hover:to-teal-700 text-white shadow-blue-500/20 active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {t('submitQuizBtn')} (
                  {Object.keys(userAnswers).length} /{' '}
                  {COMPREHENSIVE_QUIZ_QUESTIONS.length})
                </span>
              </button>
            ) : (
              <button
                onClick={handleResetQuiz}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('retakeQuizBtn')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
