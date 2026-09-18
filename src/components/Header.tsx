import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
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
  Languages,
  Flame,
  ArrowDownToLine,
  Layers,
  Mic,
  Phone,
} from 'lucide-react';
import { ThemeStyle, UserProgress } from '../types';
import { speakEnglish, speakArabic, playUiSound } from '../utils/speech';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  theme: ThemeStyle;
  onThemeChange: (theme: ThemeStyle) => void;
  progress: UserProgress;
  onOpenMemoryModal: () => void;
  onOpenContactModal?: () => void;
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
  onOpenContactModal,
  onOpenAndroidModal,
  onOpenInstallGuide,
  isInstallable,
  onInstallPwa,
  isPhoneFrame,
  onTogglePhoneFrame,
  isVoiceAssistActive,
  onToggleVoiceAssist,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isPlayingWelcome, setIsPlayingWelcome] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  const handleWelcomeSpeech = async () => {
    if (isPlayingWelcome) return;
    setIsPlayingWelcome(true);
    playUiSound('chime');
    if (language === 'ar') {
      await speakArabic(t('welcomeAudioAr'));
      await new Promise((r) => setTimeout(r, 200));
      await speakEnglish(t('welcomeAudioEn'));
    } else {
      await speakEnglish(t('welcomeAudioEn'));
      await new Promise((r) => setTimeout(r, 200));
      await speakArabic(t('welcomeAudioAr'));
    }
    setIsPlayingWelcome(false);
  };

  return (
    <header className="w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30 transition-all shadow-xs safe-area-top">
      <div className="max-w-6xl mx-auto px-3 sm:px-5 py-2 sm:py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        {/* Row 1 on mobile / Left side on desktop: Brand Logo & Title */}
        <div className="flex items-center justify-between gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              onClick={handleWelcomeSpeech}
              title={language === 'ar' ? 'اضغط لسماع الترحيب الصوتي' : 'Click to hear audio greeting'}
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all group relative shrink-0 min-w-[40px]"
            >
              <span>M</span>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-[9px] font-bold shadow-xs">
                <Volume2 className="w-2.5 h-2.5" />
              </span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-serif whitespace-nowrap">
                  {language === 'ar' ? t('appName') : t('appNameEn')}
                </h1>
                <span className="text-[10px] sm:text-[11px] font-semibold bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200/80 flex items-center gap-1 shadow-2xs whitespace-nowrap shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                  <span>{t('appBadge')}</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-[210px] sm:max-w-xs md:max-w-md">
                {t('appSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Row 2 on mobile: Horizontally scrollable strip (no visible scrollbar) holding icon-first compact pills */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full -mx-1 px-1 scroll-smooth">
          {/* Language Switcher Pill */}
          <button
            onClick={() => {
              playUiSound('tap');
              toggleLanguage();
            }}
            title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-[44px] rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 border border-blue-200/90 shadow-2xs active:scale-95 shrink-0"
          >
            <Languages className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Streak Counter Pill */}
          <div
            title={t('streakTooltip')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-[44px] bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold shadow-2xs shrink-0"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
            <span className="whitespace-nowrap">{t('streakDays', { n: progress.streakDays })}</span>
          </div>

          {/* Sound Toggle Pill */}
          <button
            onClick={() => {
              playUiSound('tap');
              onToggleVoiceAssist();
            }}
            title={isVoiceAssistActive ? t('voiceModeOn') : t('voiceModeOff')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 min-h-[44px] rounded-xl text-xs font-semibold transition-all border shrink-0 ${
              isVoiceAssistActive
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-teal-500 shadow-xs'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {isVoiceAssistActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="whitespace-nowrap">{language === 'ar' ? 'صوت' : 'Audio'}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="whitespace-nowrap">{language === 'ar' ? 'صامت' : 'Muted'}</span>
              </>
            )}
          </button>

          {/* Theme Selector Compact Pill */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shrink-0 min-h-[44px]">
            <button
              onClick={() => {
                playUiSound('tap');
                onThemeChange('sage-cream');
              }}
              title={t('themeSage')}
              className={`p-2 rounded-lg text-xs transition-all ${
                theme === 'sage-cream' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                playUiSound('tap');
                onThemeChange('warm-parchment');
              }}
              title={t('themeWarm')}
              className={`p-2 rounded-lg text-xs transition-all ${
                theme === 'warm-parchment' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-500'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                playUiSound('tap');
                onThemeChange('night-forest');
              }}
              title={t('themeNight')}
              className={`p-2 rounded-lg text-xs transition-all ${
                theme === 'night-forest' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Memory Modal Pill */}
          <button
            onClick={() => {
              playUiSound('tap');
              onOpenMemoryModal();
            }}
            title={t('memoryBtn')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-[44px] bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold shrink-0"
          >
            <Database className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="whitespace-nowrap">{t('memoryBtn')}</span>
          </button>

          {/* Contact Us Pill */}
          {onOpenContactModal && (
            <button
              onClick={() => {
                playUiSound('tap');
                onOpenContactModal();
              }}
              title={language === 'ar' ? 'تواصل معنا (أ/ محمود)' : 'Contact Us (Mr. Mahmoud)'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-[44px] bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 border border-teal-200 text-teal-800 rounded-xl text-xs font-bold shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="whitespace-nowrap">{language === 'ar' ? 'تواصل معنا' : 'Contact'}</span>
            </button>
          )}
        </div>

        {/* Right side controls (Desktop md: and up) */}
        <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
          {/* Language Switcher Pill (Bilingual AR / EN) */}
          <button
            onClick={() => {
              playUiSound('tap');
              toggleLanguage();
            }}
            title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-900 border border-blue-200/90 shadow-2xs active:scale-95"
          >
            <Languages className="w-3.5 h-3.5 text-blue-600" />
            <span className="tracking-wide">
              {language === 'ar' ? 'English' : 'العربية'}
            </span>
            <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded-md font-semibold">
              {language.toUpperCase()}
            </span>
          </button>

          {/* Audio Vocalizer Toggle Button */}
          <button
            onClick={() => {
              playUiSound('tap');
              onToggleVoiceAssist();
            }}
            title={isVoiceAssistActive ? t('voiceModeOn') : t('voiceModeOff')}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isVoiceAssistActive
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-teal-500 shadow-xs'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isVoiceAssistActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                <span className="hidden lg:inline">{t('voiceModeOn')}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden lg:inline">{t('voiceModeOff')}</span>
              </>
            )}
          </button>

          {/* Streak indicator */}
          <div
            title={t('streakTooltip')}
            className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full text-amber-900 text-xs font-bold shadow-2xs"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>{t('streakDays', { n: progress.streakDays })}</span>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                playUiSound('tap');
                onThemeChange('sage-cream');
              }}
              title={t('themeSage')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                theme === 'sage-cream'
                  ? 'bg-white text-teal-700 shadow-xs font-medium'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                playUiSound('tap');
                onThemeChange('warm-parchment');
              }}
              title={t('themeWarm')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                theme === 'warm-parchment'
                  ? 'bg-white text-amber-800 shadow-xs font-medium'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                playUiSound('tap');
                onThemeChange('night-forest');
              }}
              title={t('themeNight')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                theme === 'night-forest'
                  ? 'bg-white text-slate-900 shadow-xs font-medium'
                  : 'text-slate-500 hover:text-slate-800'
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
            title={isPhoneFrame ? t('viewWide') : t('viewPhone')}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
          >
            {isPhoneFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('viewWide')}</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t('viewPhone')}</span>
              </>
            )}
          </button>

          {/* Contact Us Button */}
          {onOpenContactModal && (
            <button
              onClick={() => {
                playUiSound('tap');
                onOpenContactModal();
              }}
              title={language === 'ar' ? 'تواصل معنا (أ/ محمود)' : 'Contact Us (Mr. Mahmoud)'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 border border-teal-200/90 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{language === 'ar' ? 'تواصل معنا' : 'Contact'}</span>
            </button>
          )}

          {/* Memory & Backup Button */}
          <button
            onClick={() => {
              playUiSound('tap');
              onOpenMemoryModal();
            }}
            title={t('memoryBtn')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">{t('memoryBtn')}</span>
          </button>

          {/* Android Kotlin Modal Trigger */}
          {onOpenAndroidModal && (
            <button
              onClick={() => {
                playUiSound('tap');
                onOpenAndroidModal();
              }}
              title={t('androidBtn')}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white shadow-xs rounded-xl text-xs font-bold transition-all"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('androidBtn')}</span>
            </button>
          )}

          {/* Android Install APK Direct Button - Hidden on mobile screens and inside Capacitor */}
          {!isNative && onOpenInstallGuide && (
            <button
              onClick={() => {
                playUiSound('tap');
                if (isInstallable && onInstallPwa) {
                  onInstallPwa();
                } else {
                  onOpenInstallGuide();
                }
              }}
              title={t('installBtn')}
              className="hidden md:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold shadow-xs rounded-xl text-xs transition-all active:scale-95"
            >
              <ArrowDownToLine className="w-3.5 h-3.5 text-slate-950" />
              <span>{t('installBtn')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
