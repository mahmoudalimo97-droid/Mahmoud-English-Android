import React, { useState } from 'react';
import { Volume2, RotateCcw, Sparkles, Check } from 'lucide-react';
import { athkarSpeech } from '../utils/athkarSpeech';

interface TasbeehOption {
  id: string;
  phrase: string;
  transcription?: string;
  virtue: string;
  defaultTarget: number;
}

const TASBEEH_OPTIONS: TasbeehOption[] = [
  {
    id: 'subhanallah',
    phrase: 'سُبْحَانَ اللَّهِ',
    virtue: 'تغرس لك نخلة في الجنة وتُحط الخطايا',
    defaultTarget: 33,
  },
  {
    id: 'alhamdulillah',
    phrase: 'الْحَمْدُ لِلَّهِ',
    virtue: 'تملأ ميزان العبد يوم القيامة بالحسنات',
    defaultTarget: 33,
  },
  {
    id: 'allahuakbar',
    phrase: 'اللَّهُ أَكْبَرُ',
    virtue: 'أحب الكلام إلى الله وخير ما طلعت عليه الشمس',
    defaultTarget: 33,
  },
  {
    id: 'lailahaillallah',
    phrase: 'لَا إِلَهَ إِلَّا اللَّهُ',
    virtue: 'أفضل الذكر وخير كلمة قالها النبيون',
    defaultTarget: 100,
  },
  {
    id: 'astaghfirullah',
    phrase: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    virtue: 'تفريج الهموم وجلب الرزق وغفران الذنوب',
    defaultTarget: 100,
  },
  {
    id: 'lahawla',
    phrase: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    virtue: 'كنز عظيم من كنوز الجنة ودواء للهم',
    defaultTarget: 33,
  },
  {
    id: 'salawat',
    phrase: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    virtue: 'صلاة الله عليك عشراً ورفع الدرجات',
    defaultTarget: 10,
  },
];

export const DigitalTasbeeh: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [totalRounds, setTotalRounds] = useState<number>(0);

  const currentOption = TASBEEH_OPTIONS[selectedIdx];
  const target = currentOption.defaultTarget;
  const isGoalReached = count >= target;

  const handleBeadClick = () => {
    // Vibrate if supported
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      navigator.vibrate(15);
    }

    const nextCount = count + 1;
    if (nextCount === target) {
      if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
        navigator.vibrate([30, 40, 30]);
      }
      setTotalRounds((prev) => prev + 1);
    }
    setCount(nextCount);
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleSpeakPhrase = (e: React.MouseEvent) => {
    e.stopPropagation();
    athkarSpeech.speakDhikr(currentOption.phrase, `tasbeeh-${currentOption.id}`);
  };

  return (
    <div className="bg-[#FCFAF7] border border-stone-200/90 rounded-3xl p-6 sm:p-8 max-w-xl mx-auto shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200/70">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-800" />
            <span>المسبحة الإلكترونية المباركة</span>
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            سبح واذكر الله بقلب حاضر مع عداد تلقائي مريح
          </p>
        </div>

        <button
          onClick={handleReset}
          title="تصفير العداد"
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>تصفير</span>
        </button>
      </div>

      {/* Selectable Phrases Pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {TASBEEH_OPTIONS.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedIdx(idx);
              setCount(0);
            }}
            className={`whitespace-nowrap px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedIdx === idx
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80'
            }`}
          >
            {item.phrase}
          </button>
        ))}
      </div>

      {/* Active Phrase Card */}
      <div className="bg-[#F6F2EA] rounded-2xl p-5 text-center border border-[#E7DFD5] mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <p className="font-amiri text-2xl sm:text-3xl font-bold text-stone-900 leading-relaxed">
            {currentOption.phrase}
          </p>
          <button
            onClick={handleSpeakPhrase}
            title="استماع للنطق بصوت رجل"
            className="p-2 rounded-full bg-emerald-100/80 hover:bg-emerald-200 text-emerald-800 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-emerald-950/80 font-medium">
          {currentOption.virtue}
        </p>
      </div>

      {/* Large Interactive Bead Counter */}
      <div className="flex flex-col items-center justify-center py-4">
        <button
          onClick={handleBeadClick}
          className="group relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-b from-emerald-700 to-emerald-900 text-white shadow-xl shadow-emerald-950/20 flex flex-col items-center justify-center transition-all duration-150 active:scale-90 hover:scale-[1.02] cursor-pointer border-4 border-[#F6F2EA]"
        >
          {/* Subtle concentric rings */}
          <div className="absolute inset-2 rounded-full border border-white/20 pointer-events-none"></div>
          <div className="absolute inset-4 rounded-full border border-white/10 pointer-events-none"></div>

          <span className="text-5xl sm:text-6xl font-extrabold tracking-tight font-sans drop-shadow-sm">
            {count}
          </span>
          <span className="text-xs font-semibold mt-1 text-emerald-100/90">
            الهدف: {target}
          </span>
          <span className="text-[11px] text-emerald-200/70 mt-1">
            اضغط للتسبيح
          </span>
        </button>

        {isGoalReached && (
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-4 py-1.5 rounded-full animate-bounce">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>أحسنت! أتممت الدورة ({target} مرة) بنجاح</span>
          </div>
        )}
      </div>

      {/* Total statistics */}
      <div className="mt-6 pt-4 border-t border-stone-200/70 flex items-center justify-around text-xs text-stone-600">
        <div>
          <span>الدورات المكتملة: </span>
          <strong className="text-stone-900 text-sm">{totalRounds}</strong>
        </div>
        <div>
          <span>العدد الكلي للذكر: </span>
          <strong className="text-stone-900 text-sm">{count + totalRounds * target}</strong>
        </div>
      </div>
    </div>
  );
};
