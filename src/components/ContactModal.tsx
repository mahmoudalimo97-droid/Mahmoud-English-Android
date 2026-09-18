import React, { useState } from 'react';
import {
  Phone,
  Copy,
  Check,
  MessageCircle,
  X,
  User,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { playUiSound } from '../utils/speech';
import { useLanguage } from '../context/LanguageContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-5 sm:p-6 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 end-0 w-36 h-36 bg-teal-500/15 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-500 text-slate-950 flex items-center justify-center shadow-lg font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-serif">
                  {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                </h3>
                <p className="text-xs text-slate-300">
                  {language === 'ar' ? 'الدعم والاستفسارات المباشرة' : 'Direct Support & Inquiries'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playUiSound('tap');
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title={language === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Responsible Person Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                  {language === 'ar' ? 'المسؤول المباشر' : 'Representative'}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  {language === 'ar' ? 'أ / محمود' : 'Mr. Mahmoud'}
                </h4>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'متاح للرد' : 'Available'}</span>
            </span>
          </div>

          {/* Phone Number Display Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-teal-50/40 dark:from-slate-800/80 dark:to-slate-800/40 border border-blue-200/80 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {language === 'ar' ? 'رقم الهاتف المباشر:' : 'Direct Phone Number:'}
              </span>
              <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400 tracking-wider">
                EGY (+20)
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="text-lg font-bold font-mono tracking-widest text-slate-900 dark:text-white px-2">
                {phoneNumber}
              </span>

              <button
                onClick={handleCopyNumber}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
                title={language === 'ar' ? 'نسخ الرقم للحافظة' : 'Copy number to clipboard'}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>{language === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'نسخ الرقم' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons: Direct Call & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* Direct Call Link */}
            <a
              href={telLink}
              onClick={() => playUiSound('tap')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 hover:from-blue-800 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-700/20 active:scale-98 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>{language === 'ar' ? 'اتصال مباشر' : 'Call Directly'}</span>
            </a>

            {/* Direct WhatsApp Link */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playUiSound('tap')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-98 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{language === 'ar' ? 'محادثة واتساب' : 'WhatsApp Chat'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
