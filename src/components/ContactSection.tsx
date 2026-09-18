import React, { useState } from 'react';
import {
  Phone,
  Copy,
  Check,
  MessageCircle,
  User,
  ShieldCheck,
  ExternalLink,
  Mail,
  Clock,
  Sparkles,
  Award,
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
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Visual Top Header Card */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 border border-indigo-500/20 shadow-xl shadow-indigo-950/20 relative overflow-hidden">
        <div className="absolute top-0 end-0 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 start-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/20 border-2 border-white/20">
              <User className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <span className="absolute -bottom-1 -end-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white text-[10px]">
              ✓
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAr ? 'المسؤول والمطور التعليمي' : 'Lead Educator & Developer'}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? 'متاح للاستفسارات' : 'Available for Inquiries'}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              {isAr ? 'أ / محمود' : 'Mr. Mahmoud'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isAr
                ? 'مطور تطبيق "محمود إنجلش" والمسؤول التعليمي. نرحب دائماً بأسئلتكم، اقتراحاتكم للتطوير، واستفساراتكم حول الدروس.'
                : 'Creator and academic supervisor of Mahmoud English. Questions, suggestions, and feedback are warmly welcomed.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Direct Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
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
          <span className="w-full py-2 px-3 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center gap-1.5 mt-auto">
            <span>{isAr ? 'اتصل الآن' : 'Call Now'}</span>
            <ExternalLink className="w-3 h-3" />
          </span>
        </a>

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
            <p className="text-xs text-slate-500 mt-1">
              {isAr ? 'تواصل فوري عبر الواتساب' : 'Fast instant messaging'}
            </p>
          </div>
          <span className="w-full py-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center gap-1.5 mt-auto">
            <span>{isAr ? 'فتح واتساب' : 'Open WhatsApp'}</span>
            <ExternalLink className="w-3 h-3" />
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
          <span className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 mt-auto ${
            copied ? 'bg-emerald-600 text-white' : 'bg-indigo-50 text-indigo-800 group-hover:bg-indigo-600 group-hover:text-white'
          }`}>
            <span>{copied ? (isAr ? 'تم الحفظ في الحافظة' : 'Copied to Clipboard') : (isAr ? 'اضغط للنسخ' : 'Tap to Copy')}</span>
          </span>
        </button>
      </div>

      {/* Trust & Support Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-teal-600" />
          <span>{isAr ? 'عن مبادرة تطبيق محمود إنجلش' : 'About Mahmoud English'}</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isAr
            ? 'تطبيق تعليمي تفاعلي صُمم خصيصاً لتمكين الطلاب والناطقين بالعربية من اكتساب اللغة الإنجليزية بأسلوب عصري ممتع وبصري، يجمع بين قوة الذكاء الاصطناعي والكاميرا الحية والدروس الممنهجة وقواعد النطق المتقنة.'
            : 'An integrated interactive learning platform crafted to empower Arabic speakers with modern English fluency through AI camera vision, structured lessons, and gamified practice.'}
        </p>

        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <Clock className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{isAr ? 'متاح للرد والاستفسارات اليومية' : 'Available for daily support'}</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{isAr ? 'رقم معتمد ومباشر: 01287073964' : 'Verified Direct: 01287073964'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
