import React, { useState } from 'react';
import {
  Sparkles,
  Database,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  BookOpen,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ThemeStyle, UserProgress } from '../types';
import { speakEnglish, speakArabic, playUiSound } from '../utils/speech';

interface HeaderProps {
  theme: ThemeStyle;
  onThemeChange: (theme: ThemeStyle) => void;
  progress: UserProgress;
  onOpenMemoryModal: () => void;
  onOpenAndroidModal?: () => void;
  onOpenInstallGuide?: () => void;
  isInstallable?: boolean;
  onInstallPwa?: () => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  isVoiceAssistActive: boolean;
  onToggleVoiceAssist: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  progress,
  onOpenMemoryModal,
  onOpenAndroidModal,
  onOpenInstallGuide,
  isInstallable,
  onInstallPwa,
  isPhoneFrame,
  onTogglePhoneFrame,
  isVoiceAssistActive,
  onToggleVoiceAssist,
}) => {
  const [isPlayingWelcome, setIsPlayingWelcome] = useState(false);

  const handleWelcomeSpeech = async () => {
    if (isPlayingWelcome) return;
    setIsPlayingWelcome(true);
    playUiSound('chime');
    await speakEnglish('Welcome to Mahmoud English! Tap any icon or picture to listen and learn.');
    await new Promise((r) => setTimeout(r, 250));
    await speakArabic('مرحباً بك في تطبيق محمود إنجلش! التطبيق الآن ناطق بالكامل بالصور والأيقونات.');
    setIsPlayingWelcome(false);
  };

  return (
    <header className="w-full border-b border-emerald-900/10 bg-white/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleWelcomeSpeech}
            title="اضغط لسماع ترحيب محمود إنجلش بالصوت"
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-sm shadow-emerald-900/20 hover:scale-105 active:scale-95 transition-all group relative"
          >
            <span>M</span>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center text-[9px] font-bold shadow-xs">
              🔊
            </span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-emerald-950 font-serif">
                Mahmoud English
              </h1>
              <span className="text-[10px] sm:text-[11px] font-medium bg-emerald-100/90 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                <span>ناطق ومصور</span>
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              الترجمة بالكاميرا • قاموس مصور ناطق • دروس واختبارات • شات ذكي
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Audio Vocalizer Toggle Button */}
          <button
            onClick={() => {
              playUiSound('tap');
              onToggleVoiceAssist();
            }}
            title={
              isVoiceAssistActive
                ? 'تعطيل النطق التلقائي لأسماء الأيقونات'
                : 'تفعيل النطق التلقائي الصوتي عند الضغط على الأيقونات'
            }
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isVoiceAssistActive
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {isVoiceAssistActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                <span className="hidden md:inline">الوضع الناطق: مفعّل</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                <span className="hidden md:inline">الوضع الناطق</span>
              </>
            )}
          </button>

          {/* Streak indicator */}
          <div
            title="أيام الالتزام المتتالية"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-amber-900 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{progress.streakDays} يوم</span>
          </div>

          {/* Theme Selector (Eye-Friendly Modes) */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200">
            <button
              onClick={() => {
                playUiSound('tap');
                onThemeChange('sage-cream');
              }}
              title="مظهر المريمية والورق الهادئ المريح للعين"
              className={`p-1.5 rounded-lg text-xs transition-all ${
                theme === 'sage-cream'
                  ? 'bg-white text-emerald-800 shadow-xs font-medium'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                playUiSound('tap');
                onThemeChange('warm-parchment');
              }}
              title="وضع قراءة الورق الدافئ (كتاب كلاسيكي)"
              className={`p-1.5 rounded-lg text-xs transition-all ${
                theme === 'warm-parchment'
                  ? 'bg-white text-amber-900 shadow-xs font-medium'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                playUiSound('tap');
                onThemeChange('night-forest');
              }}
              title="وضع الغابة الليلية المريح للعينين في الظلام"
              className={`p-1.5 rounded-lg text-xs transition-all ${
                theme === 'night-forest'
                  ? 'bg-white text-emerald-950 shadow-xs font-medium'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Phone / Desktop View Mode Toggle */}
          <button
            onClick={() => {
              playUiSound('tap');
              onTogglePhoneFrame();
            }}
            title={isPhoneFrame ? 'التبديل إلى العرض الكامل' : 'التبديل إلى إطار هاتف مخصص'}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl border border-stone-200 transition-colors"
          >
            {isPhoneFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>عرض واسع</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>إطار هاتف</span>
              </>
            )}
          </button>

          {/* Memory & Backup Button */}
          <button
            onClick={() => {
              playUiSound('tap');
              onOpenMemoryModal();
            }}
            title="إدارة الذاكرة والحفظ الدائم للبيانات"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-medium transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">الذاكرة</span>
          </button>

          {/* Android Native App Modal Trigger */}
          {onOpenAndroidModal && (
            <button
              onClick={() => {
                playUiSound('tap');
                onOpenAndroidModal();
              }}
              title="عرض وتصدير مشروع أندرويد الأصلي بلغة Kotlin"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs rounded-xl text-xs font-bold transition-all"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">أندرويد Kotlin</span>
            </button>
          )}

          {/* Android Install APK / App Direct Button */}
          {onOpenInstallGuide && (
            <button
              onClick={() => {
                playUiSound('tap');
                if (isInstallable && onInstallPwa) {
                  onInstallPwa();
                } else {
                  onOpenInstallGuide();
                }
              }}
              title="تثبيت التطبيق على الأندرويد كملف وتطبيق أصلي (APK / App)"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold shadow-xs rounded-xl text-xs transition-all active:scale-95 animate-pulse hover:animate-none"
            >
              <Smartphone className="w-3.5 h-3.5 text-stone-950" />
              <span>تثبيت APK على الهاتف</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
