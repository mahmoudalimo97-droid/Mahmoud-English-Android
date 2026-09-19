import React, { useState } from 'react';
import {
  Phone,
  Copy,
  Check,
  MessageCircle,
  User,
  ShieldCheck,
  ExternalLink,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  GraduationCap,
  Laptop,
  HelpCircle,
} from 'lucide-react';
import { playUiSound } from '../utils/speech';
import { useLanguage } from '../context/LanguageContext';

export const ContactSection: React.FC = () => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const isAr = language === 'ar';

  const phoneNumber = '01287073964';
  const telLink = `tel:${phoneNumber}`;
  const waLink = 'https://wa.me/201287073964';

  const handleCopyNumber = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(phoneNumber);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = phoneNumber;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      playUiSound('success');
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch (e) {
      playUiSound('pop');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-tajawal">
      {/* Teacher Profile Card with High Graphic Polish */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 border border-indigo-500/20 shadow-xl shadow-indigo-950/20 relative overflow-hidden">
        <div className="absolute top-0 end-0 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 start-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 border-2 border-white/20">
              <User className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <span className="absolute -bottom-1 -end-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white text-[10px]">
              ✓
            </span>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAr ? 'مستر محمود علي - خبير ومطور تعليمي' : 'Mr. Mahmoud Ali - Lead Educator'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? 'متاح للرد والاستفسارات' : 'Active for Inquiries'}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-tajawal text-white tracking-wide">
              {isAr ? 'مستر محمود علي' : 'Mr. Mahmoud Ali'}
            </h2>
            <p className="text-sm sm:text-base text-emerald-200/90 font-medium leading-relaxed max-w-2xl">
              {isAr
                ? 'يسعدني دائماً تواصلكم للاستفسارات التعليمية وتصميم كتب ومذكرات ومناهج تعليمية واونلاين'
                : 'Warmly welcoming your inquiries for educational consultation, curriculum development, books & booklets design, and interactive online classes.'}
            </p>
          </div>
        </div>
      </div>

      {/* Educational Services Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{isAr ? 'خدماتنا التعليمية التخصصية' : 'Specialized Educational Services'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Service 1: Inquiries */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-400 shadow-2xs hover:shadow-md transition-all flex flex-col gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                {isAr ? 'استفسارات تعليمية' : 'Educational Inquiries'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {isAr
                  ? 'إجابة عن أسئلة القواعد، تحديد المستوى، وتوجيه النطق الصحيح للطلاب.'
                  : 'Grammar Q&A, level assessment, and dedicated pronunciation guidance.'}
              </p>
            </div>
          </div>

          {/* Service 2: Books & Booklets Design */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-400 shadow-2xs hover:shadow-md transition-all flex flex-col gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors">
                {isAr ? 'تصميم كتب ومذكرات' : 'Books & Booklets Design'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {isAr
                  ? 'إعداد وتنسيق مذكرات شروحات متطورة، ملازم مراجعة، وكتب تأسيس باحترافية.'
                  : 'Professional typesetting and layout for study guides and review booklets.'}
              </p>
            </div>
          </div>

          {/* Service 3: Curriculum Design */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all flex flex-col gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                {isAr ? 'تصميم مناهج تعليمية' : 'Curriculum Development'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {isAr
                  ? 'بناء وتأليف مناهج لغة إنجليزية تفاعلية للمدارس والمراكز الأكاديمية.'
                  : 'Modern curriculum authoring for schools and language centers.'}
              </p>
            </div>
          </div>

          {/* Service 4: Online Teaching */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-400 shadow-2xs hover:shadow-md transition-all flex flex-col gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                {isAr ? 'دروس ومحاضرات أونلاين' : 'Interactive Online Classes'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {isAr
                  ? 'حصص مباشرة تفاعلية عبر الإنترنت لتأسيس الطلاب ومتابعة المناهج الدراسية.'
                  : 'Live online classes for foundational mastery and syllabus progress.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Direct Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* WhatsApp Direct Chat */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playUiSound('tap')}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-400 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group active:scale-98"
        >
          <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-2xs">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
              {isAr ? 'محادثة واتساب سريعة' : 'WhatsApp Chat'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-mono font-semibold">
              {phoneNumber}
            </p>
          </div>
          <span className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center gap-1.5 mt-auto">
            <span>{isAr ? 'تواصل عبر واتساب الآن' : 'Open WhatsApp'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </a>

        {/* Direct Phone Call Button */}
        <a
          href={telLink}
          onClick={() => playUiSound('tap')}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group active:scale-98"
        >
          <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-2xs">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
              {isAr ? 'اتصال هاتفي مباشر' : 'Direct Phone Call'}
            </h3>
            <p className="text-xs font-mono font-bold text-slate-500 mt-1">
              {phoneNumber}
            </p>
          </div>
          <span className="w-full py-2.5 px-3 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center gap-1.5 mt-auto">
            <span>{isAr ? 'اتصل الآن بمستر محمود' : 'Call Now'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </a>

        {/* Copy Phone Number */}
        <button
          onClick={handleCopyNumber}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-indigo-400 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group active:scale-98"
        >
          <div className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-colors shadow-2xs ${
            copied ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white'
          }`}>
            {copied ? <Check className="w-6 h-6 animate-bounce" /> : <Copy className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors">
              {copied ? (isAr ? 'تم النسخ بنجاح!' : 'Copied!') : (isAr ? 'نسخ رقم الهاتف' : 'Copy Number')}
            </h3>
            <p className="text-xs font-mono font-bold text-slate-500 mt-1">
              {phoneNumber}
            </p>
          </div>
          <span className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 mt-auto ${
            copied ? 'bg-emerald-600 text-white' : 'bg-indigo-50 text-indigo-800 group-hover:bg-indigo-600 group-hover:text-white'
          }`}>
            <span>{copied ? (isAr ? 'تم الحفظ في الحافظة' : 'Copied') : (isAr ? 'اضغط لنسخ الرقم' : 'Tap to Copy')}</span>
          </span>
        </button>
      </div>

      {/* Trust & Support Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600" />
          <span>{isAr ? 'تطبيق محمود إنجلش - شريكك للتميز التعليمي' : 'Mahmoud English - Educational Partner'}</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isAr
            ? 'تطبيق تعليمي تفاعلي صُمم خصيصاً لتمكين الطلاب والناطقين بالعربية من اكتساب اللغة الإنجليزية بأسلوب عصري ممتع وبصري، يجمع بين قوة الذكاء الاصطناعي والكاميرا الحية والدروس الممنهجة وقواعد النطق المتقنة بصوت رجل تعليمي هادئ وفصيح.'
            : 'An integrated interactive learning platform crafted to empower Arabic speakers with modern English fluency through AI camera vision, structured lessons, and gamified practice.'}
        </p>

        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{isAr ? 'متاح للرد والاستفسارات وتنسيق الدروس' : 'Available for daily support & lesson planning'}</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{isAr ? 'رقم معتمد ومباشر: 01287073964' : 'Verified Direct: 01287073964'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
