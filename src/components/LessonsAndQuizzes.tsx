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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, QuizQuestion, QuizAttempt } from '../types';
import { LESSONS_DATA } from '../data/lessonsData';
import { COMPREHENSIVE_QUIZ_QUESTIONS } from '../data/quizzesData';
import { speakEnglish, speakArabic, playUiSound } from '../utils/speech';
import { LessonVisualDiagram } from './LessonVisualDiagram';

interface LessonsAndQuizzesProps {
  onSaveQuizResult: (result: QuizAttempt) => void;
  quizHistory: QuizAttempt[];
}

export const LessonsAndQuizzes: React.FC<LessonsAndQuizzesProps> = ({
  onSaveQuizResult,
  quizHistory,
}) => {
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
      date: new Date().toLocaleDateString('ar-EG'),
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
      <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex gap-2 w-full">
          <button
            onClick={() => {
              playUiSound('tap');
              setActiveTab('lessons');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'lessons'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>الدروس التأسيسية المصورة ({LESSONS_DATA.length})</span>
          </button>

          <button
            onClick={() => {
              playUiSound('tap');
              setActiveTab('exam');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'exam'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>اختبار اللغة الإنجليزية الشامل</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: LESSONS */}
      {activeTab === 'lessons' ? (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200/80 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-1">
              <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <span>دروس تأسيسية مصورة وناطقة قبل الامتحان</span>
                <span className="text-[11px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-sans">
                  مخططات تفاعلية
                </span>
              </h4>
              <p className="text-xs text-emerald-800/90 leading-relaxed">
                اضغط على المخططات والأمثلة لتستمع إلى النطق الصوتي الدقيق والشرح
              </p>
            </div>
            <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-800 shrink-0 self-start sm:self-auto shadow-2xs">
              {Object.keys(completedLessons).length} من {LESSONS_DATA.length} مكتمل
            </span>
          </div>

          <div className="space-y-3.5">
            {LESSONS_DATA.map((lesson, index) => {
              const isExpanded = expandedLessonId === lesson.id;
              const isDone = completedLessons[lesson.id];

              return (
                <div
                  key={lesson.id}
                  className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-2xs transition-all"
                >
                  {/* Lesson Header Accordion */}
                  <div
                    onClick={() => toggleLesson(lesson.id)}
                    className="p-4 cursor-pointer flex items-center justify-between gap-3 hover:bg-stone-50/80 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center text-xs font-bold font-serif shadow-2xs">
                        0{index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                            {lesson.titleAr}
                          </h4>
                          {isDone && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> تم الإنجاز
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-emerald-800 font-serif font-medium">{lesson.titleEn}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-stone-400">
                      <span className="text-[11px] bg-stone-100 px-2.5 py-0.5 rounded-md text-stone-600 hidden sm:inline">
                        {lesson.durationMin} دقائق
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-stone-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-stone-600" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Lesson Body */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 pt-0 border-t border-stone-100 space-y-4 text-xs">
                      {/* Optional Banner Image */}
                      {lesson.bannerImageUrl && (
                        <div className="relative h-32 w-full rounded-2xl overflow-hidden mt-3 shadow-2xs">
                          <img
                            src={lesson.bannerImageUrl}
                            alt={lesson.titleAr}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3">
                            <p className="text-white text-xs font-medium drop-shadow-sm">
                              💡 {lesson.summaryAr}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Visual Graphic Interactive Diagram */}
                      <LessonVisualDiagram diagramType={lesson.diagramType} />

                      {/* Sections */}
                      <div className="space-y-4">
                        {lesson.sections.map((sec, sIdx) => (
                          <div key={sIdx} className="space-y-2.5 p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/70">
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-stone-900 text-xs sm:text-sm border-r-2 border-emerald-600 pr-2">
                                {sec.headingAr}
                              </h5>
                              <button
                                onClick={() => {
                                  playUiSound('tap');
                                  speakArabic(sec.explanationAr);
                                }}
                                title="قراءة الشرح بالعربية صوتياً"
                                className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-1 rounded-lg transition-colors"
                              >
                                <Volume2 className="w-3 h-3" />
                                <span>قراءة الشرح</span>
                              </button>
                            </div>

                            <p className="text-stone-600 leading-relaxed whitespace-pre-line pr-2.5">
                              {sec.explanationAr}
                            </p>

                            {/* Examples */}
                            <div className="space-y-2 pt-1">
                              {sec.englishExamples.map((ex, exIdx) => (
                                <div
                                  key={exIdx}
                                  className="p-3 rounded-2xl bg-white border border-emerald-100/90 flex items-center justify-between gap-2 shadow-2xs hover:border-emerald-400 transition-colors"
                                >
                                  <div>
                                    <p className="font-serif font-bold text-emerald-950 text-xs sm:text-sm">
                                      {ex.en}
                                    </p>
                                    <p className="text-stone-500 text-[11px] mt-0.5">{ex.ar}</p>
                                    {ex.note && (
                                      <p className="text-amber-800 text-[10px] mt-1 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                                        📌 {ex.note}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => {
                                      playUiSound('tap');
                                      speakEnglish(ex.en);
                                    }}
                                    title="استمع للنطق الإنجليزي"
                                    className="p-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs shrink-0 active:scale-95"
                                  >
                                    <Volume2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Key Tips Bullet Points */}
                      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900 block text-xs">
                            ✨ نقاط ذهبية تذكرها دائماً:
                          </span>
                          <button
                            onClick={() => {
                              playUiSound('tap');
                              speakArabic(lesson.keyTips.join('. '));
                            }}
                            className="text-[10px] text-amber-800 font-bold hover:underline flex items-center gap-1"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>نطق النصائح</span>
                          </button>
                        </div>
                        <ul className="space-y-1 list-disc list-inside text-amber-950 text-[11px]">
                          {lesson.keyTips.map((tip, tIdx) => (
                            <li key={tIdx}>{tip}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Complete Lesson Button */}
                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => markLessonCompleted(lesson.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs active:scale-95'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isDone ? 'تمت دراسة هذا الدرس بنجاح' : 'أنهيت قراءة الدرس'}</span>
                        </button>

                        <button
                          onClick={() => {
                            playUiSound('tap');
                            setActiveTab('exam');
                          }}
                          className="text-stone-500 hover:text-emerald-800 font-semibold"
                        >
                          الانتقال للاختبار ➔
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
        /* SECTION 2: COMPREHENSIVE EXAM */
        <div className="space-y-4">
          {/* Result Card if submitted */}
          {isSubmitted && lastAttempt && (
            <div
              className={`p-6 rounded-3xl border text-center space-y-3 shadow-md ${
                lastAttempt.passed
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-white shadow-xs">
                {lastAttempt.passed ? (
                  <Award className="w-8 h-8 text-emerald-800 animate-bounce" />
                ) : (
                  <HelpCircle className="w-8 h-8 text-amber-600" />
                )}
              </div>

              <div>
                <h4 className="text-xl font-bold font-serif">
                  {lastAttempt.passed
                    ? 'أحسنت صنعاً! اجتزت الاختبار بنجاح'
                    : 'محاولة جيدة! راجع الدروس وحاول مرة أخرى'}
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  نتيجتك: {lastAttempt.score} من {lastAttempt.totalQuestions} ({lastAttempt.percentage}%)
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={handleResetQuiz}
                  className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5 shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة المحاولة</span>
                </button>
                <button
                  onClick={() => {
                    playUiSound('tap');
                    setActiveTab('lessons');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 shadow-xs"
                >
                  مراجعة الدروس التأسيسية
                </button>
              </div>
            </div>
          )}

          {/* Quiz Header Instructions */}
          <div className="p-4 rounded-3xl bg-white border border-stone-200/90 flex items-center justify-between shadow-2xs">
            <div>
              <h4 className="font-bold text-stone-900 text-sm">
                اختبار تحديد المستوى والتثبيت
              </h4>
              <p className="text-xs text-stone-500">
                يحتوي على {COMPREHENSIVE_QUIZ_QUESTIONS.length} أسئلة شاملة للقواعد والترجمة
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-stone-100 px-3 py-1.5 rounded-xl text-stone-700">
              {Object.keys(userAnswers).length} / {COMPREHENSIVE_QUIZ_QUESTIONS.length} مجاب
            </span>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {COMPREHENSIVE_QUIZ_QUESTIONS.map((q, qIndex) => {
              const selectedOpt = userAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = isAnswered && selectedOpt === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/90 space-y-3.5 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        السؤال {qIndex + 1}
                      </span>
                      <h5 className="font-bold text-stone-900 text-sm">{q.questionAr}</h5>
                      {q.contextEn && (
                        <div className="flex items-center gap-2 pt-0.5">
                          <p className="font-serif font-medium text-emerald-950 text-xs bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200/70 inline-block">
                            "{q.contextEn}"
                          </p>
                          <button
                            onClick={() => {
                              playUiSound('tap');
                              speakEnglish(q.contextEn!);
                            }}
                            title="استمع للسياق الإنجليزي"
                            className="p-1 text-emerald-800 hover:text-emerald-950"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {isSubmitted && (
                      <span className="shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-500" />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIndex) => {
                      const isThisSelected = selectedOpt === optIndex;
                      let btnStyle = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100';

                      if (isSubmitted) {
                        if (optIndex === q.correctIndex) {
                          btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                        } else if (isThisSelected && !isCorrect) {
                          btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                        } else {
                          btnStyle = 'bg-stone-50 border-stone-200 text-stone-400 opacity-60';
                        }
                      } else if (isThisSelected) {
                        btnStyle = 'bg-emerald-800 border-emerald-800 text-white font-semibold shadow-xs';
                      }

                      return (
                        <button
                          key={optIndex}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIndex)}
                          disabled={isSubmitted}
                          className={`p-3 rounded-2xl border text-xs text-right transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {/* Audio button for options that are in English */}
                          {/[a-zA-Z]/.test(opt) && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                playUiSound('tap');
                                speakEnglish(opt);
                              }}
                              className="p-1 hover:text-emerald-500"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {isSubmitted && q.explanationAr && (
                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-[11px] text-stone-700 leading-relaxed">
                      <span className="font-bold text-stone-900 ml-1">💡 التوضيح:</span>
                      {q.explanationAr}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Action */}
          {!isSubmitted && (
            <div className="sticky bottom-4 z-20 pt-2">
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(userAnswers).length === 0}
                className="w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-lg shadow-emerald-900/20 disabled:opacity-50 transition-all active:scale-98"
              >
                تصحيح الاختبار وعرض النتيجة ({Object.keys(userAnswers).length} من {COMPREHENSIVE_QUIZ_QUESTIONS.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
