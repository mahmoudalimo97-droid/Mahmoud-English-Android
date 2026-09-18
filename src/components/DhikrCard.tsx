import React, { useState, useMemo } from 'react';
import { Volume2, Square, Check, RotateCcw, BookOpen, Sparkles } from 'lucide-react';
import { DhikrItem } from '../data/athkarData';
import { athkarSpeech, SpeechState } from '../utils/athkarSpeech';

interface DhikrCardProps {
  item: DhikrItem;
  speechState: SpeechState;
  fontSize: 'normal' | 'large' | 'xlarge';
  currentCount: number;
  onIncrementCount: (id: string, max: number) => void;
  onResetCount: (id: string) => void;
}

export const DhikrCard: React.FC<DhikrCardProps> = ({
  item,
  speechState,
  fontSize,
  currentCount,
  onIncrementCount,
  onResetCount,
}) => {
  const [showBenefit, setShowBenefit] = useState(true);

  const isCompleted = currentCount >= item.count;
  const isThisCardSpeaking = speechState.isSpeaking && speechState.activeId === item.id;

  // Split text into readable tokens while preserving punctuation
  const words = useMemo(() => {
    // Regex splits by whitespace
    return item.text.split(/(\s+)/);
  }, [item.text]);

  const handleWordClick = (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    const cleanWord = word.replace(/[۝۞۩]/g, '').trim();
    if (!cleanWord) return;
    athkarSpeech.speakWord(cleanWord, item.id);
  };

  const handleTogglePlayFull = () => {
    if (isThisCardSpeaking) {
      athkarSpeech.stop();
    } else {
      athkarSpeech.speakDhikr(item.text, item.id);
    }
  };

  const fontSizeClass = {
    normal: 'text-xl sm:text-2xl leading-relaxed sm:leading-[2.2]',
    large: 'text-2xl sm:text-3xl leading-loose sm:leading-[2.4]',
    xlarge: 'text-3xl sm:text-4xl leading-loose sm:leading-[2.6]',
  }[fontSize];

  return (
    <article
      id={`dhikr-${item.id}`}
      className={`relative rounded-3xl p-5 sm:p-7 transition-all duration-300 border shadow-xs ${
        isCompleted
          ? 'bg-emerald-50/70 border-emerald-300/80 shadow-emerald-100/50'
          : isThisCardSpeaking
          ? 'bg-white border-amber-400 shadow-md ring-2 ring-amber-300/30'
          : 'bg-[#FCFAF7] border-stone-200/90 hover:border-emerald-300/80 hover:bg-white'
      }`}
    >
      {/* Top Header of the Card */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-200/70">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span>
          <h3 className="font-bold text-stone-900 text-base sm:text-lg">
            {item.title}
          </h3>
        </div>

        {/* Action badges: Repeat count & Listen full */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlayFull}
            title={isThisCardSpeaking ? 'إيقاف القراءة' : 'استماع للذكر كاملاً بصوت رجل'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              isThisCardSpeaking
                ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/40 animate-pulse'
                : 'bg-emerald-100/90 text-emerald-900 hover:bg-emerald-200/90 border border-emerald-200/80'
            }`}
          >
            {isThisCardSpeaking ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>إيقاف القراءة</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>استماع للذكر</span>
              </>
            )}
          </button>

          {item.count > 1 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
              التكرار: {item.count} مرات
            </span>
          )}
        </div>
      </div>

      {/* Main Dhikr Text with Clickable Words */}
      <div className="my-3 py-2 px-1">
        <p
          className={`font-amiri text-stone-900 select-text tracking-wide ${fontSizeClass}`}
          dir="rtl"
        >
          {words.map((token, idx) => {
            if (/^\s+$/.test(token)) {
              return <span key={idx}>{token}</span>;
            }

            const cleanToken = token.replace(/[.,;!?،:()"۝۞۩]/g, '').trim();
            const isCurrentlySpoken =
              isThisCardSpeaking &&
              speechState.activeWord &&
              cleanToken &&
              speechState.activeWord.includes(cleanToken);

            return (
              <span
                key={idx}
                onClick={(e) => handleWordClick(e, token)}
                title="اضغط لنطق هذه الكلمة بصوت رجل"
                className={`inline-block cursor-pointer px-1 py-0.5 rounded-lg transition-all duration-150 active:scale-95 ${
                  isCurrentlySpoken
                    ? 'bg-amber-300 text-stone-950 font-bold shadow-xs scale-105 ring-2 ring-amber-400'
                    : 'hover:bg-emerald-100/80 hover:text-emerald-950 active:bg-emerald-200'
                }`}
              >
                {token}
              </span>
            );
          })}
        </p>
      </div>

      {/* Hint for word clicking */}
      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-stone-700 mb-4 bg-stone-100/70 py-1.5 px-3 rounded-xl w-fit">
        <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
        <span>انقر على أي كلمة أو جملة لسماع نطقها فوراً بصوت رجل وقور</span>
      </div>

      {/* Benefit / Hadith Reference (Collapsible or visible) */}
      {(item.benefit || item.reference) && (
        <div className="mt-3 p-3.5 rounded-2xl bg-[#F4EFE6]/80 border border-[#E7DFD5] text-xs sm:text-sm text-stone-700">
          <div
            className="flex items-center justify-between cursor-pointer font-bold text-emerald-900 mb-1"
            onClick={() => setShowBenefit(!showBenefit)}
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>فضل الذكر ومصدره:</span>
            </span>
            <span className="text-[11px] font-normal text-stone-700">
              {showBenefit ? 'إخفاء ▲' : 'إظهار ▼'}
            </span>
          </div>

          {showBenefit && (
            <div className="mt-1.5 space-y-1">
              {item.benefit && <p className="leading-relaxed">{item.benefit}</p>}
              {item.reference && (
                <p className="text-[11px] font-semibold text-emerald-800">
                  المصدر: {item.reference}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Interactive Repetition Counter */}
      <div className="mt-5 pt-4 border-t border-stone-200/80 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-600">الإنجاز:</span>
          <span
            className={`text-sm font-bold px-3 py-1 rounded-xl ${
              isCompleted
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-100/90 text-emerald-950 border border-emerald-200'
            }`}
          >
            {currentCount} / {item.count}
          </span>
          {isCompleted && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-800">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>تم بحمد الله</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentCount > 0 && (
            <button
              onClick={() => onResetCount(item.id)}
              title="إعادة ضبط العداد لهذا الذكر"
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/80 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onIncrementCount(item.id, item.count)}
            disabled={isCompleted}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-xs active:scale-95 ${
              isCompleted
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-emerald-900/10'
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-4 h-4" />
                <span>مكتمل</span>
              </>
            ) : (
              <>
                <span>تكرار الذكر</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">
                  +{currentCount + 1}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
