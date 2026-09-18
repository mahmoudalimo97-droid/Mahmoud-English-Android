import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Trophy,
  Flame,
  Volume2,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Timer,
  Play,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GAME_QUESTIONS, GameQuestion } from '../data/gameWords';
import { speakEnglish, speakWordWithExplanation, playUiSound } from '../utils/speech';

interface EducationalGameProps {
  highScore: number;
  onUpdateHighScore: (score: number) => void;
}

export const EducationalGame: React.FC<EducationalGameProps> = ({
  highScore,
  onUpdateHighScore,
}) => {
  const [gameMode, setGameMode] = useState<'match' | 'audio' | 'puzzle'>('match');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const currentQ: GameQuestion = GAME_QUESTIONS[currentQIndex % GAME_QUESTIONS.length];

  // Game timer countdown
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && !isAnswerChecked && !gameOver && timeLeft > 0) {
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
  }, [isPlaying, isAnswerChecked, gameOver, timeLeft]);

  // Audio trigger when question changes in game
  useEffect(() => {
    if (isPlaying && !isAnswerChecked && currentQ) {
      if (gameMode === 'audio') {
        speakEnglish(currentQ.word);
      }
    }
  }, [isPlaying, gameMode, currentQIndex, isAnswerChecked]);

  const startGame = () => {
    playUiSound('chime');
    setIsPlaying(true);
    setScore(0);
    setStreak(0);
    setCurrentQIndex(0);
    setTimeLeft(10);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setGameOver(false);
  };

  const handleTimeUp = () => {
    playUiSound('pop');
    setIsAnswerChecked(true);
    setStreak(0);
    setTimeout(() => {
      moveToNextQuestion();
    }, 1800);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerChecked || gameOver) return;

    setSelectedAnswer(idx);
    setIsAnswerChecked(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      playUiSound('success');
      const bonus = streak >= 3 ? 20 : 10;
      const newScore = score + bonus;
      setScore(newScore);
      setStreak((prev) => prev + 1);
      speakEnglish(currentQ.word);

      if (newScore > highScore) {
        onUpdateHighScore(newScore);
      }
    } else {
      playUiSound('pop');
      setStreak(0);
    }

    setTimeout(() => {
      moveToNextQuestion();
    }, 1600);
  };

  const moveToNextQuestion = () => {
    if (currentQIndex + 1 >= GAME_QUESTIONS.length) {
      // Game ended
      setGameOver(true);
      setIsPlaying(false);
      playUiSound('chime');
      if (score > highScore) {
        try {
          confetti({ particleCount: 70, spread: 60 });
        } catch (e) {}
      }
    } else {
      setCurrentQIndex((prev) => prev + 1);
      setTimeLeft(10);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    }
  };

  const handlePlayWordAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playUiSound('tap');
    if (currentQ) {
      speakEnglish(currentQ.word);
    }
  };

  const handlePlayBilingualAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentQ) {
      speakWordWithExplanation(currentQ.word, currentQ.translation);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & High Score */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span>لعبة التحدي المصورة والناطقة</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            لعبة بصرية تفاعلية بالصور والنطق الصوتي لترسيخ الكلمات
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-2xs">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>أعلى نتيجة: {highScore} نقطة</span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold animate-bounce">
              <Flame className="w-4 h-4 text-rose-600" />
              <span>{streak}x حماس</span>
            </div>
          )}
        </div>
      </div>

      {/* Mode Selector (When not playing) */}
      {!isPlaying && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => {
                playUiSound('tap');
                setGameMode('match');
              }}
              className={`p-4 rounded-3xl border text-right transition-all space-y-1.5 ${
                gameMode === 'match'
                  ? 'bg-emerald-50/80 border-emerald-700 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <span className="text-2xl block">🖼️</span>
              <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                تحدي الصور والمطابقة السريعة
              </h4>
              <p className="text-[11px] text-stone-500">
                شاهد الصورة والكلمة الإنجليزية واختر الترجمة الصحيحة
              </p>
            </button>

            <button
              onClick={() => {
                playUiSound('tap');
                setGameMode('audio');
              }}
              className={`p-4 rounded-3xl border text-right transition-all space-y-1.5 ${
                gameMode === 'audio'
                  ? 'bg-emerald-50/80 border-emerald-700 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <span className="text-2xl block">🎧</span>
              <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                تحدي الاستماع الصوتي
              </h4>
              <p className="text-[11px] text-stone-500">
                استمع للنطق الصوتي الفوري وخمن معنى الكلمة من الصوت
              </p>
            </button>

            <button
              onClick={() => {
                playUiSound('tap');
                setGameMode('puzzle');
              }}
              className={`p-4 rounded-3xl border text-right transition-all space-y-1.5 ${
                gameMode === 'puzzle'
                  ? 'bg-emerald-50/80 border-emerald-700 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <span className="text-2xl block">🧩</span>
              <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                لغز إكمال الحروف المفقودة
              </h4>
              <p className="text-[11px] text-stone-500">
                أكمل الحروف الناقصة في الكلمة مع الاستماع لنطقها
              </p>
            </button>
          </div>

          {/* Game Over Scorecard or Start Screen */}
          {gameOver ? (
            <div className="p-8 rounded-3xl bg-white border border-stone-200 text-center space-y-4 shadow-md max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center text-3xl">
                🏆
              </div>
              <h4 className="text-xl font-bold text-stone-900">انتهت جولة التحدي!</h4>
              <p className="text-sm text-stone-600">
                حققت مجموع <span className="font-bold text-emerald-800 text-lg">{score}</span> نقطة
              </p>

              <button
                onClick={startGame}
                className="w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>العب جولة جديدة الآن</span>
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white text-center space-y-4 shadow-lg">
              <div className="max-w-md mx-auto space-y-2">
                <h4 className="text-lg sm:text-xl font-bold">جاهز لاختبار مهاراتك الإنجليزية؟</h4>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  ستعرض لك اللعبة صوراً وكلمات إنجليزية ناطقة ولديك 10 ثوانٍ لكل سؤال.
                </p>
              </div>

              <button
                onClick={startGame}
                className="px-8 py-3.5 rounded-2xl bg-white text-emerald-950 font-bold text-sm hover:bg-emerald-50 transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>ابدأ التحدي الآن</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ACTIVE GAMEPLAY CARD */}
      {isPlaying && currentQ && (
        <div className="max-w-md mx-auto space-y-4">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-2 text-xs font-semibold">
            <span className="text-stone-500">
              السؤال {currentQIndex + 1} من {GAME_QUESTIONS.length}
            </span>

            <div className="flex items-center gap-3">
              <span className="text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl">
                النقاط: {score}
              </span>

              {/* Timer Pill */}
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-mono ${
                  timeLeft <= 3
                    ? 'bg-rose-100 text-rose-800 animate-pulse font-bold'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>{timeLeft} ث</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-700 h-full transition-all duration-300"
              style={{
                width: `${((currentQIndex + 1) / GAME_QUESTIONS.length) * 100}%`,
              }}
            ></div>
          </div>

          {/* Question Card with Illustrative Picture */}
          <div className="rounded-3xl bg-white border-2 border-stone-200 overflow-hidden shadow-md space-y-3">
            {/* Illustrative Image & Emoji */}
            {gameMode !== 'audio' && currentQ.imageUrl && (
              <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                <img
                  src={currentQ.imageUrl}
                  alt={currentQ.word}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <span className="absolute top-3 right-3 text-2xl bg-white/90 backdrop-blur-md w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs">
                  {currentQ.iconEmoji || '✨'}
                </span>
              </div>
            )}

            <div className="p-5 text-center space-y-3">
              {/* If audio mode, hide text and show big speaker icon */}
              {gameMode === 'audio' ? (
                <div className="py-6 space-y-3">
                  <button
                    onClick={handlePlayWordAudio}
                    className="w-20 h-20 rounded-3xl bg-emerald-800 text-white mx-auto flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    <Volume2 className="w-9 h-9 animate-pulse" />
                  </button>
                  <p className="text-xs text-stone-500">اضغط للاستماع مجدداً للكلمة 🎧</p>
                </div>
              ) : gameMode === 'puzzle' && currentQ.missingWordPuzzle ? (
                <div className="space-y-1">
                  <div className="text-3xl font-mono font-bold tracking-widest text-emerald-950">
                    {currentQ.missingWordPuzzle.template}
                  </div>
                  <p className="text-xs text-stone-500 font-serif">
                    اختر الترجمة الصحيحة لهذه الكلمة
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <h4 className="text-3xl font-bold font-serif text-stone-900 tracking-tight">
                    {currentQ.word}
                  </h4>
                  <p className="text-xs font-mono text-emerald-800">{currentQ.phonetic}</p>
                </div>
              )}

              {/* Audio Pronunciation Pill inside Card */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handlePlayWordAudio}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>نطق بالإنجليزية</span>
                </button>

                <button
                  type="button"
                  onClick={handlePlayBilingualAudio}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <span>نطق وشرح صوتي 🗣️</span>
                </button>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === currentQ.correctIndex;

                  let style =
                    'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100 active:scale-95';

                  if (isAnswerChecked) {
                    if (isCorrect) {
                      style = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold shadow-xs';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-rose-100 border-rose-500 text-rose-950 font-bold';
                    } else {
                      style = 'bg-stone-50 border-stone-200 text-stone-400 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerChecked}
                      className={`p-3.5 rounded-2xl border text-sm font-semibold transition-all ${style}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
