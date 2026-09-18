import React from 'react';
import {
  Sparkles,
  BookOpen,
  Volume2,
  Trophy,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  HelpCircle,
  Gamepad2,
  MessageSquare,
  Phone,
  Camera,
  Flame,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { playUiSound, speakArabic, speakEnglish } from '../utils/speech';
import { UserProgress, VocabWord } from '../types';

interface HomeSectionProps {
  onNavigateTab: (tab: 'home' | 'lessons' | 'vocab' | 'quiz' | 'game' | 'chat' | 'contact' | 'camera') => void;
  progress: UserProgress;
  totalWords: number;
  featuredWord?: VocabWord;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  onNavigateTab,
  progress,
  totalWords,
  featuredWord,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const quickFeatures = [
    {
      id: 'lessons',
      tab: 'lessons' as const,
      title: isAr ? 'الدروس والشروحات' : 'Lessons & Grammar',
      desc: isAr ? 'شروحات مبسطة مع شريط تقدم وقراءة صوتية' : 'Simplified grammar with audio & progress',
      icon: BookOpen,
      color: 'from-blue-600 to-indigo-600',
      bgLight: 'bg-blue-50/80 hover:bg-blue-100/60 border-blue-200/80',
      badge: isAr ? 'A1 - B2' : 'Levels',
    },
    {
      id: 'vocab',
      tab: 'vocab' as const,
      title: isAr ? 'الكلمات بالصور' : 'Visual Vocabulary',
      desc: isAr ? 'كروت ملونة لكل كلمة مع النطق الصوتي الذكوري' : 'Visual flashcards with male voice audio',
      icon: Volume2,
      color: 'from-teal-600 to-emerald-600',
      bgLight: 'bg-teal-50/80 hover:bg-teal-100/60 border-teal-200/80',
      badge: `${totalWords} ${isAr ? 'كلمة' : 'Words'}`,
    },
    {
      id: 'quiz',
      tab: 'quiz' as const,
      title: isAr ? 'الاختبارات التفاعلية' : 'Interactive Quizzes',
      desc: isAr ? 'اختبارات خيارات متعددة مع نجوم واحتفال وتصحيح صوتي' : 'MCQ cards with celebration & voice feedback',
      icon: HelpCircle,
      color: 'from-purple-600 to-pink-600',
      bgLight: 'bg-purple-50/80 hover:bg-purple-100/60 border-purple-200/80',
      badge: isAr ? 'تحدي' : 'Test',
    },
    {
      id: 'game',
      tab: 'game' as const,
      title: isAr ? 'اللعبة التفاعلية' : 'Play & Learn Game',
      desc: isAr ? 'لعبة سريعة ملونة بنقاط ومستويات وتحدي زمني' : 'Fast-paced word matching with timer & levels',
      icon: Gamepad2,
      color: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-50/80 hover:bg-amber-100/60 border-amber-200/80',
      badge: `${progress.gameHighScore} ${isAr ? 'نقطة' : 'Pts'}`,
    },
    {
      id: 'chat',
      tab: 'chat' as const,
      title: isAr ? 'الشات الذكي (مستر محمود)' : 'AI Tutor Chat',
      desc: isAr ? 'محادثة وتصحيح أسئلة مع المعلم الذكي صوتياً' : 'Ask questions and practice conversation with AI',
      icon: MessageSquare,
      color: 'from-cyan-600 to-blue-600',
      bgLight: 'bg-cyan-50/80 hover:bg-cyan-100/60 border-cyan-200/80',
      badge: isAr ? 'متصل الآن' : 'Online',
    },
    {
      id: 'camera',
      tab: 'camera' as const,
      title: isAr ? 'ترجمة الكاميرا الحية' : 'Live Camera Vision',
      desc: isAr ? 'التقط أي شيء حولك لترجمته ونطقه فوراً' : 'Snap any real-world object for instant translation',
      icon: Camera,
      color: 'from-rose-500 to-red-600',
      bgLight: 'bg-rose-50/80 hover:bg-rose-100/60 border-rose-200/80',
      badge: 'AI Vision',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Visual Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 border border-indigo-500/20 shadow-xl shadow-indigo-950/20">
        <div className="absolute top-0 end-0 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 start-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'منظومة تعليمية متكاملة' : 'Complete Learning Ecosystem'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-400/20 text-teal-300 border border-teal-400/30">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              <span>{isAr ? 'نطق رجالي صوتي موحد' : 'Pure Male Voice Audio'}</span>
            </span>
          </div>

          <div className="max-w-2xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
              {isAr ? 'مرحباً بك في محمود إنجلش' : 'Welcome to Mahmoud English'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? 'رحلتك الممتعة لإتقان اللغة الإنجليزية: بالصور التوضيحية، والدروس المنظمة، والاختبارات التفاعلية، والشات الذكي مع المعلم مستر محمود.'
                : 'Your joyful path to mastering English: visual vocabulary, structured lessons, interactive quizzes, engaging educational games, and smart AI chat.'}
            </p>
          </div>

          {/* Quick CTA row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                playUiSound('tap');
                onNavigateTab('lessons');
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isAr ? 'ابدأ الدروس الآن' : 'Start Lessons'}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                playUiSound('tap');
                onNavigateTab('vocab');
              }}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs sm:text-sm backdrop-blur-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4 text-teal-300" />
              <span>{isAr ? 'الكلمات بالصور' : 'Visual Vocab'}</span>
            </button>

            <button
              onClick={() => {
                playUiSound('tap');
                onNavigateTab('contact');
              }}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs sm:text-sm backdrop-blur-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-300" />
              <span>{isAr ? 'تواصل مع أ / محمود' : 'Contact Mr. Mahmoud'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
            <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">
              {isAr ? 'أيام الالتزام' : 'Streak Days'}
            </span>
            <span className="text-base sm:text-lg font-bold text-slate-900">
              {progress.streakDays} {isAr ? 'يوم' : 'Days'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200">
            <BookOpen className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">
              {isAr ? 'بنك الكلمات' : 'Vocab Bank'}
            </span>
            <span className="text-base sm:text-lg font-bold text-slate-900">
              {totalWords} {isAr ? 'كلمة' : 'Words'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">
              {isAr ? 'اختبارات مكتملة' : 'Quizzes Done'}
            </span>
            <span className="text-base sm:text-lg font-bold text-slate-900">
              {progress.quizzesCompletedCount}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center shrink-0 border border-orange-200">
            <Trophy className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">
              {isAr ? 'أعلى نقاط باللعبة' : 'Game High Score'}
            </span>
            <span className="text-base sm:text-lg font-bold text-slate-900">
              {progress.gameHighScore}
            </span>
          </div>
        </div>
      </div>

      {/* Featured Word of the Day Card */}
      {featuredWord && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-teal-50 border border-blue-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white border border-blue-200 shadow-xs flex items-center justify-center text-3xl shrink-0">
              {featuredWord.iconEmoji || '🌟'}
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                {isAr ? 'كلمة اليوم المقترحة' : 'Word of the Day'}
              </span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-extrabold text-slate-900 font-serif">
                  {featuredWord.english}
                </h3>
                <span className="text-xs font-mono text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded-md">
                  {featuredWord.phonetic}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-bold">
                {featuredWord.arabic}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playUiSound('tap');
                speakEnglish(featuredWord.english);
              }}
              className="px-4 py-2 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'استمع للكلمة' : 'Listen'}</span>
            </button>

            <button
              onClick={() => {
                playUiSound('tap');
                onNavigateTab('vocab');
              }}
              className="px-3 py-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs transition-all"
            >
              {isAr ? 'كل الكلمات' : 'All Words'}
            </button>
          </div>
        </div>
      )}

      {/* Main Sections Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-600" />
            <span>{isAr ? 'أقسام التطبيق الرئيسية' : 'Main Application Modules'}</span>
          </h2>
          <span className="text-xs text-slate-400">
            {isAr ? 'اختر قسماً للبدء فوراً' : 'Tap any module to explore'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {quickFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => {
                  playUiSound('tap');
                  onNavigateTab(feat.tab);
                }}
                className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between group ${feat.bgLight}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/90 border border-slate-200/80 text-slate-700 shadow-2xs">
                    {feat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-900 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-blue-700">
                  <span>{isAr ? 'دخول القسم' : 'Explore'}</span>
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
