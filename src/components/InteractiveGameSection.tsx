import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Trophy,
  Timer,
  Volume2,
  Play,
  RotateCcw,
  Sparkles,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playUiSound, speakEnglish, speakArabic } from '../utils/speech';
import { useLanguage } from '../context/LanguageContext';

interface DragGameQuestion {
  id: string;
  word: string;
  arabic: string;
  iconEmoji: string;
  phonetic: string;
  level: number;
}

const GAME_WORDS_BANK: DragGameQuestion[] = [
  { id: 'gw-1', word: 'Door', arabic: 'باب', iconEmoji: '🚪', phonetic: '/dɔːr/', level: 1 },
  { id: 'gw-2', word: 'Key', arabic: 'مفتاح', iconEmoji: '🔑', phonetic: '/kiː/', level: 1 },
  { id: 'gw-3', word: 'Book', arabic: 'كتاب', iconEmoji: '📖', phonetic: '/bʊk/', level: 1 },
  { id: 'gw-4', word: 'Clock', arabic: 'ساعة حائط', iconEmoji: '⏰', phonetic: '/klɒk/', level: 1 },
  { id: 'gw-5', word: 'Coffee', arabic: 'قهوة', iconEmoji: '☕', phonetic: '/ˈkɒfi/', level: 1 },
  { id: 'gw-6', word: 'Car', arabic: 'سيارة', iconEmoji: '🚗', phonetic: '/kɑːr/', level: 2 },
  { id: 'gw-7', word: 'Apple', arabic: 'تفاحة', iconEmoji: '🍎', phonetic: '/ˈæpəl/', level: 2 },
  { id: 'gw-8', word: 'Water', arabic: 'ماء', iconEmoji: '💧', phonetic: '/ˈwɔːtər/', level: 2 },
  { id: 'gw-9', word: 'Chair', arabic: 'كرسي', iconEmoji: '🪑', phonetic: '/tʃeər/', level: 2 },
  { id: 'gw-10', word: 'Tree', arabic: 'شجرة', iconEmoji: '🌳', phonetic: '/triː/', level: 3 },
  { id: 'gw-11', word: 'School', arabic: 'مدرسة', iconEmoji: '🏫', phonetic: '/skuːl/', level: 3 },
  { id: 'gw-12', word: 'House', arabic: 'منزل', iconEmoji: '🏠', phonetic: '/haʊs/', level: 3 },
];

interface InteractiveGameSectionProps {
  highScore: number;
  onUpdateHighScore: (score: number) => void;
}

export const InteractiveGameSection: React.FC<InteractiveGameSectionProps> = ({
  highScore,
  onUpdateHighScore,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(12);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [shaking, setShaking] = useState<boolean>(false);

  const activeQuestions = GAME_WORDS_BANK.filter((q) => q.level <= currentLevel);
  const currentTarget = activeQuestions[currentIndex % activeQuestions.length];

  // Prepare shuffled options for current target
  const setupQuestion = (index: number) => {
    const target = activeQuestions[index % activeQuestions.length];
    if (!target) return;

    const others = GAME_WORDS_BANK.filter((w) => w.word !== target.word);
    // Shuffle others and take 3
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
    const all = [target.arabic, ...shuffledOthers.map((o) => o.arabic)].sort(
      () => Math.random() - 0.5
    );

    setOptions(all);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setTimeLeft(12);
  };

  const handleStartGame = () => {
    playUiSound('chime');
    setIsPlaying(true);
    setScore(0);
    setStreak(0);
    setCurrentLevel(1);
    setCurrentIndex(0);
    setGameOver(false);
    setupQuestion(0);
  };

  // Timer countdown
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && !gameOver && !isAnswerChecked) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, gameOver, isAnswerChecked]);

  const handleTimeUp = () => {
    playUiSound('pop');
    setIsAnswerChecked(true);
    setStreak(0);
    speakArabic('انتهى الوقت!');
    setTimeout(() => {
      advanceNextQuestion();
    }, 1600);
  };

  const handleSelectOption = (chosenArabic: string) => {
    if (isAnswerChecked || gameOver || !currentTarget) return;

    setSelectedAnswer(chosenArabic);
    setIsAnswerChecked(true);

    const isCorrect = chosenArabic === currentTarget.arabic;

    if (isCorrect) {
      playUiSound('success');
      const bonus = streak >= 2 ? 25 : 15;
      const newScore = score + bonus;
      setScore(newScore);
      setStreak((prev) => prev + 1);

      // Level up every 60 points
      if (newScore >= currentLevel * 60 && currentLevel < 3) {
        setCurrentLevel((prev) => prev + 1);
        try {
          confetti({ particleCount: 60, spread: 60 });
        } catch (e) {}
      }

      if (newScore > highScore) {
        onUpdateHighScore(newScore);
      }

      // Male pronunciation of the word
      speakEnglish(currentTarget.word);
    } else {
      playUiSound('pop');
      setStreak(0);
      setShaking(true);
      setTimeout(() => setShaking(false), 800);
      speakArabic(`غير صحيح. الإجابة هي ${currentTarget.arabic}`);
    }

    setTimeout(() => {
      advanceNextQuestion();
    }, 1600);
  };

  const advanceNextQuestion = () => {
    if (currentIndex + 1 >= activeQuestions.length * 2) {
      // Game session complete
      setGameOver(true);
      setIsPlaying(false);
      playUiSound('chime');
      if (score >= highScore) {
        try {
          confetti({ particleCount: 100, spread: 80 });
        } catch (e) {}
      }
      speakArabic(`انتهت اللعبة! مجموع نقاطك ${score}. أحسنت!`);
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setupQuestion(nextIdx);
    }
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-md text-white">
              {isAr ? `المستوى ${currentLevel}` : `Level ${currentLevel}`}
            </span>
            <span className="text-xs text-amber-100">
              {isAr ? 'لعبة تفاعلية مرحة وسريعة' : 'Fast-paced word challenge'}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-serif">
            {isAr ? 'لعبة مطابقة الكلمات بالصور' : 'Visual Word Match Game'}
          </h2>
          <p className="text-xs text-amber-100/90 mt-0.5">
            {isAr
              ? 'اختر المعنى الصحيح للصورة قبل انتهاء العداد الزمني واكسب أعلى النقاط!'
              : 'Match the image with the correct translation before time runs out!'}
          </p>
        </div>

        {/* Score and High Score Badges */}
        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-1.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/25 text-xs font-bold flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-200" />
            <span>{isAr ? 'أعلى رقم:' : 'Best:'} {highScore}</span>
          </div>

          {streak > 1 && (
            <div className="px-3 py-1.5 rounded-2xl bg-rose-600 text-white text-xs font-bold flex items-center gap-1 animate-bounce">
              <Flame className="w-4 h-4 text-yellow-300" />
              <span>{streak}x</span>
            </div>
          )}
        </div>
      </div>

      {/* Start Screen */}
      {!isPlaying && !gameOver && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 text-center space-y-5 shadow-xs">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto text-4xl shadow-md">
            🎮
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-xl font-bold text-slate-900 font-serif">
              {isAr ? 'جاهز للتحدي؟' : 'Ready to Play?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {isAr
                ? 'ستظهر لك صور وكلمات إنجليزية ناطقة بصوت رجل وقور، ولديك 12 ثانية لاختيار الترجمة العربية الصحيحة.'
                : 'Images and words will appear with male voice audio. You have 12 seconds to pick the right match!'}
            </p>
          </div>

          <button
            onClick={handleStartGame}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 mx-auto"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isAr ? 'ابدأ اللعبة الآن' : 'Start Game'}</span>
          </button>
        </div>
      )}

      {/* Playing Board */}
      {isPlaying && currentTarget && (
        <div className="space-y-4">
          {/* Stats bar */}
          <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 text-xs font-bold shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-500">
                {isAr ? `المستوى ${currentLevel}` : `Level ${currentLevel}`}
              </span>
              <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                {score} {isAr ? 'نقطة' : 'pts'}
              </span>
            </div>

            <div className="flex items-center gap-1 text-rose-700 bg-rose-50 px-3 py-1 rounded-xl border border-rose-200 font-mono">
              <Timer className="w-3.5 h-3.5 text-rose-600 animate-spin" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Active Question Board */}
          <div
            className={`p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm text-center space-y-5 transition-all ${
              shaking ? 'animate-shake border-rose-400' : ''
            }`}
          >
            {/* Visual Icon and English Word */}
            <div className="space-y-2">
              <span className="text-6xl sm:text-7xl block transition-transform hover:scale-110 duration-200 select-none">
                {currentTarget.iconEmoji}
              </span>
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                  {currentTarget.word}
                </h3>
                <button
                  onClick={() => {
                    playUiSound('tap');
                    speakEnglish(currentTarget.word);
                  }}
                  title={isAr ? 'استمع لنطق الكلمة' : 'Listen to word'}
                  className="p-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs font-mono text-teal-700 bg-teal-50 px-3 py-0.5 rounded-lg border border-teal-100">
                {currentTarget.phonetic}
              </span>
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {options.map((opt, idx) => {
                let btnColor =
                  'bg-slate-50 hover:bg-amber-50/70 border-slate-200 text-slate-800 hover:border-amber-300';

                if (isAnswerChecked) {
                  if (opt === currentTarget.arabic) {
                    btnColor = 'bg-teal-100 border-teal-500 text-teal-950 font-bold ring-2 ring-teal-500/20';
                  } else if (selectedAnswer === opt) {
                    btnColor = 'bg-rose-100 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-500/20';
                  } else {
                    btnColor = 'bg-slate-50 border-slate-200 opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerChecked}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-4 rounded-2xl border text-sm font-bold transition-all shadow-2xs active:scale-98 cursor-pointer ${btnColor}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 text-center space-y-5 shadow-md">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto text-4xl shadow-md">
            🏆
          </div>

          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              {isAr ? 'رائع جداً! انتهت جولة اللعبة' : 'Awesome! Game Finished'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {isAr ? 'تم تسجيل نقاطك وحفظ تقدمك بنجاح' : 'Your score has been registered'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-around">
            <div>
              <span className="text-xs text-amber-700 block">{isAr ? 'النقاط الحالية' : 'Score'}</span>
              <span className="text-2xl font-extrabold text-amber-900">{score}</span>
            </div>
            <div className="w-px h-8 bg-amber-200"></div>
            <div>
              <span className="text-xs text-amber-700 block">{isAr ? 'أعلى رقم قياسي' : 'High Score'}</span>
              <span className="text-2xl font-extrabold text-amber-900">{Math.max(score, highScore)}</span>
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isAr ? 'العب مرة أخرى' : 'Play Again'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
