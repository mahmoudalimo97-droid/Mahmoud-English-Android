import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  RotateCcw,
} from 'lucide-react';
import { Lesson } from '../types';
import { LESSONS_DATA } from '../data/lessonsData';
import { speakEnglish, speakArabic, playUiSound } from '../utils/speech';
import { LessonVisualDiagram } from './LessonVisualDiagram';
import { useLanguage } from '../context/LanguageContext';

interface LessonsSectionProps {
  completedLessons: Record<string, boolean>;
  onMarkLessonCompleted: (lessonId: string) => void;
}

export const LessonsSection: React.FC<LessonsSectionProps> = ({
  completedLessons,
  onMarkLessonCompleted,
}) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);
  const [playingAudioKey, setPlayingAudioKey] = useState<string | null>(null);

  const currentLesson: Lesson = LESSONS_DATA[currentLessonIndex] || LESSONS_DATA[0];
  const isCurrentCompleted = !!completedLessons[currentLesson.id];

  const totalLessons = LESSONS_DATA.length;
  const completedCount = Object.keys(completedLessons).filter((k) => completedLessons[k]).length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const handleNextLesson = () => {
    if (currentLessonIndex < totalLessons - 1) {
      playUiSound('tap');
      setCurrentLessonIndex((prev) => prev + 1);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      playUiSound('tap');
      setCurrentLessonIndex((prev) => prev - 1);
    }
  };

  const handleSpeakText = async (text: string, key: string, isEnglish: boolean = true) => {
    setPlayingAudioKey(key);
    playUiSound('tap');
    if (isEnglish) {
      await speakEnglish(text);
    } else {
      await speakArabic(text);
    }
    setPlayingAudioKey(null);
  };

  const handleSpeakFullLessonSummary = async () => {
    playUiSound('tap');
    setPlayingAudioKey('lesson-summary');
    await speakEnglish(currentLesson.titleEn);
    await speakArabic(currentLesson.summaryAr);
    setPlayingAudioKey(null);
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Top Interactive Progress Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                {currentLessonIndex + 1}/{totalLessons}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {isAr ? 'منهج وقواعد اللغة الإنجليزية' : 'English Grammar & Curriculum'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr
                ? 'شروحات مبسطة مع أمثلة صوتية بالذكاء الاصطناعي وشريط إنجاز تفاعلي'
                : 'Simplified grammar with pure male voice audio and progress tracking'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
              {completedCount} / {totalLessons} {isAr ? 'دروس مكتملة' : 'Completed'} ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${Math.max(progressPercent, 4)}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Lesson Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {LESSONS_DATA.map((l, idx) => {
            const isSelected = idx === currentLessonIndex;
            const isDone = !!completedLessons[l.id];
            return (
              <button
                key={l.id}
                onClick={() => {
                  playUiSound('tap');
                  setCurrentLessonIndex(idx);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-blue-700 text-white shadow-xs'
                    : isDone
                    ? 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{idx + 1}.</span>
                <span>{isAr ? l.titleAr.slice(0, 18) + '...' : l.titleEn.slice(0, 18) + '...'}</span>
                {isDone && <Check className="w-3 h-3 text-teal-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Active Lesson Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-5 p-5 sm:p-7">
        {/* Lesson Banner & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {currentLesson.level}
              </span>
              <span className="text-xs text-slate-500">
                ⏱️ {currentLesson.durationMin} {isAr ? 'دقائق' : 'minutes'}
              </span>
              {isCurrentCompleted && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تم الإنجاز' : 'Done'}</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              {isAr ? currentLesson.titleAr : currentLesson.titleEn}
            </h1>
            <p className="text-xs sm:text-sm text-blue-700 font-medium">
              {isAr ? currentLesson.titleEn : currentLesson.titleAr}
            </p>
          </div>

          {/* Voice Reading Button */}
          <button
            onClick={handleSpeakFullLessonSummary}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-bold shadow-xs active:scale-95 transition-all self-start sm:self-auto shrink-0"
          >
            <Volume2 className={`w-4 h-4 ${playingAudioKey === 'lesson-summary' ? 'animate-pulse' : ''}`} />
            <span>{isAr ? 'استمع لشرح الدرس' : 'Listen to Lesson'}</span>
          </button>
        </div>

        {/* Simplified Summary Text */}
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 text-xs sm:text-sm text-slate-800 leading-relaxed">
          <p className="font-semibold text-blue-900 mb-1">{isAr ? '💡 ملخص القاعدة:' : '💡 Key Concept:'}</p>
          <p>{currentLesson.summaryAr}</p>
        </div>

        {/* Visual Rule Diagram */}
        <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{isAr ? 'مخطط القاعدة المرئي:' : 'Visual Rule Diagram:'}</span>
          </h3>
          <LessonVisualDiagram lessonId={currentLesson.id} />
        </div>

        {/* Lesson Sections with Audio Pronunciation */}
        {currentLesson.sections && currentLesson.sections.length > 0 && (
          <div className="space-y-4">
            {currentLesson.sections.map((sec, secIdx) => (
              <div
                key={secIdx}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3"
              >
                <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">
                    {secIdx + 1}
                  </span>
                  <span>{sec.headingAr}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {sec.explanationAr}
                </p>

                {sec.englishExamples && sec.englishExamples.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {sec.englishExamples.map((ex, exIdx) => {
                      const audioKey = `sec-${secIdx}-ex-${exIdx}`;
                      const isPlaying = playingAudioKey === audioKey;
                      return (
                        <div
                          key={exIdx}
                          className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 flex items-center justify-between gap-3 transition-colors shadow-2xs"
                        >
                          <div>
                            <p className="font-serif font-bold text-slate-900 text-xs sm:text-sm">
                              {ex.en}
                            </p>
                            <p className="text-teal-800 text-[11px] mt-0.5 font-medium">
                              {ex.ar}
                            </p>
                          </div>
                          <button
                            onClick={() => handleSpeakText(ex.en, audioKey, true)}
                            title={isAr ? 'استمع لنطق الجملة' : 'Listen to sentence'}
                            className={`p-2 rounded-xl transition-all shrink-0 ${
                              isPlaying
                                ? 'bg-blue-700 text-white'
                                : 'bg-teal-50 hover:bg-teal-100 text-teal-800'
                            }`}
                          >
                            <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Golden Tips */}
        {currentLesson.keyTips && currentLesson.keyTips.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-2 text-amber-950">
            <span className="font-bold flex items-center gap-1.5 text-amber-900 text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{isAr ? 'نصائح وقواعد ذهبية للتذكر:' : 'Golden Rules to Remember:'}</span>
            </span>
            <ul className="list-disc list-inside space-y-1 text-amber-900 leading-relaxed">
              {currentLesson.keyTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation & Mark Complete Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Previous Lesson */}
          <button
            onClick={handlePrevLesson}
            disabled={currentLessonIndex === 0}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
              currentLessonIndex === 0
                ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs active:scale-95'
            }`}
          >
            {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            <span>{isAr ? 'الدرس السابق' : 'Previous Lesson'}</span>
          </button>

          {/* Mark Complete Button */}
          <button
            onClick={() => {
              playUiSound('success');
              onMarkLessonCompleted(currentLesson.id);
            }}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
              isCurrentCompleted
                ? 'bg-teal-100 text-teal-900 border border-teal-300'
                : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-xs'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{isCurrentCompleted ? (isAr ? 'تم إكمال هذا الدرس ✓' : 'Lesson Completed ✓') : (isAr ? 'تحديد الدرس كمكتمل' : 'Mark as Completed')}</span>
          </button>

          {/* Next Lesson */}
          <button
            onClick={handleNextLesson}
            disabled={currentLessonIndex >= totalLessons - 1}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
              currentLessonIndex >= totalLessons - 1
                ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-blue-700 hover:bg-blue-800 text-white border-blue-700 shadow-xs active:scale-95'
            }`}
          >
            <span>{isAr ? 'الدرس التالي' : 'Next Lesson'}</span>
            {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
