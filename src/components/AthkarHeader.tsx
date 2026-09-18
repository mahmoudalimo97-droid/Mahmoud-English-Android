import React from 'react';
import { Volume2, VolumeX, Type, ArrowRight } from 'lucide-react';
import { athkarSpeech, SpeechState } from '../utils/athkarSpeech';

interface AthkarHeaderProps {
  currentCategoryTitle: string | null;
  onBackToMain: () => void;
  speechState: SpeechState;
  fontSize: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
}

export const AthkarHeader: React.FC<AthkarHeaderProps> = ({
  currentCategoryTitle,
  onBackToMain,
  speechState,
  fontSize,
  onChangeFontSize,
}) => {
  const handleStopAudio = () => {
    athkarSpeech.stop();
  };

  const handleBack = () => {
    // Announce returning to main menu with male voice
    athkarSpeech.speakNavigation('القائمة الرئيسية');
    onBackToMain();
  };

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return 'صباح مبارك بذكر الله ☀️';
    if (hour >= 12 && hour < 17) return 'يوم طيب بذكر الله 🌤️';
    return 'مساء السكينة والطمأنينة 🌙';
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7DFD5] px-4 py-3 sm:py-4 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Left / Start: App Brand or Back Button */}
        <div className="flex items-center gap-3">
          {currentCategoryTitle ? (
            <button
              onClick={handleBack}
              id="back-to-main-btn"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-stone-300/80 text-stone-800 hover:text-emerald-900 hover:border-emerald-600 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer group"
            >
              <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:-translate-x-0.5 transition-transform" />
              <span>القائمة الرئيسية</span>
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white flex items-center justify-center font-amiri text-xl sm:text-2xl shadow-sm">
                ﷽
              </div>
              <div>
                <h1 className="font-bold text-stone-900 text-base sm:text-lg leading-tight">
                  الأذكار النبوية
                </h1>
                <p className="text-[11px] text-stone-600 hidden sm:block">
                  {getGreeting()}
                </p>
              </div>
            </div>
          )}

          {currentCategoryTitle && (
            <div className="border-r border-stone-300/80 pr-3 hidden xs:block">
              <h2 className="font-bold text-stone-900 text-sm sm:text-base">
                {currentCategoryTitle}
              </h2>
            </div>
          )}
        </div>

        {/* Right / End: Audio status & Font size adjustment */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Stop Button / Indicator */}
          {speechState.isSpeaking ? (
            <button
              onClick={handleStopAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-600 text-white text-xs font-bold animate-pulse shadow-xs cursor-pointer"
              title="إيقاف القراءة الصوتية"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>إيقاف الصوت</span>
            </button>
          ) : (
            <div className="hidden md:flex items-center gap-1 text-[11px] text-emerald-900 bg-emerald-100/70 border border-emerald-200/80 px-2.5 py-1 rounded-full font-medium">
              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>صوت رجل وقور عند الضغط</span>
            </div>
          )}

          {/* Font Size Selector */}
          <div className="flex items-center bg-white border border-stone-300/80 rounded-2xl p-0.5 shadow-2xs">
            <span className="text-[10px] text-stone-600 px-1.5 hidden sm:inline flex items-center">
              <Type className="w-3 h-3" />
            </span>
            <button
              onClick={() => onChangeFontSize('normal')}
              title="خط عادي"
              className={`px-2 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                fontSize === 'normal'
                  ? 'bg-emerald-800 text-white'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              عادي
            </button>
            <button
              onClick={() => onChangeFontSize('large')}
              title="خط كبير"
              className={`px-2 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                fontSize === 'large'
                  ? 'bg-emerald-800 text-white'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              كبير
            </button>
            <button
              onClick={() => onChangeFontSize('xlarge')}
              title="خط كبير جداً"
              className={`px-2 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                fontSize === 'xlarge'
                  ? 'bg-emerald-800 text-white'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              +كبير
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
