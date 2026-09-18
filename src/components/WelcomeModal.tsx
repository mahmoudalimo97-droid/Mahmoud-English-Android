import React from 'react';
import { Sparkles, BookOpen, Volume2, ArrowRight, ArrowLeft, Phone, Moon } from 'lucide-react';
import { playUiSound, speakArabic } from '../utils/speech';
import { useLanguage } from '../context/LanguageContext';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  if (!isOpen) return null;

  const handleStart = () => {
    playUiSound('success');
    speakArabic('أهلاً بك في تطبيق محمود إنجلش، نتمنى لك تجربة تعليمية ممتعة ومفيدة!');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Visual Graphic Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 end-0 w-48 h-48 bg-teal-500/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center mx-auto text-3xl shadow-lg mb-3">
              🎓
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-white/10 text-teal-300 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAr ? 'أكاديمية تعليمية متكاملة' : 'Integrated Learning App'}</span>
            </span>
            <h2 className="text-2xl font-bold font-serif text-white">
              {isAr ? 'مرحباً بك في محمود إنجلش' : 'Welcome to Mahmoud English'}
            </h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              {isAr
                ? 'تطبيقك التفاعلي المرح لتعلم الإنجليزية بالكاميرا والقاموس المصور والدروس والشات الذكي.'
                : 'Your smart, engaging companion for learning English with AI Vision, audio vocab, and interactive tests.'}
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="p-6 space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 block">{isAr ? 'الركن الإسلامي الإنجليزي' : 'Islamic English Corner'}</strong>
                <span className="text-slate-600">{isAr ? 'أدعية وأذكار ومصطلحات وأخلاق نبوية مترجمة وناطقة بوضوح' : 'Duas, vocabulary & prophetic morals with clear audio'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-teal-50/70 border border-teal-200/70 text-xs">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 block">{isAr ? 'نظام ناطق تفاعلي متكامل' : 'Interactive Speech Audio'}</strong>
                <span className="text-slate-600">{isAr ? 'استماع مباشر عند الضغط على أي كلمة أو درس أو اختبار' : 'Clear speech synthesis for all words and lessons'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-xs">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 block">{isAr ? 'دروس واختبارات ولعبة تفاعلية' : 'Lessons, Quizzes & Game'}</strong>
                <span className="text-slate-600">{isAr ? 'شروحات مبسطة واختبارات بنجوم وعداد زمني ونقاط' : 'Structured grammar with celebration effects and timer'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 block">{isAr ? 'تواصل مباشر مع أ / محمود' : 'Contact Mr. Mahmoud'}</strong>
                <span className="text-slate-600">{isAr ? 'اتصال وواتساب على الرقم: 01287073964' : 'Call & WhatsApp at 01287073964'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isAr ? 'ابدأ تجربة التعلم الآن' : 'Start Learning Now'}</span>
            {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
