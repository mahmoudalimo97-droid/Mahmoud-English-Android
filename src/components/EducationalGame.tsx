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
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GAME_QUESTIONS, GameQuestion } from '../data/gameWords';
import { speakEnglish, speakWordWithExplanation, playUiSound } from '../utils/speech';
import { useLanguage } from '../context/LanguageContext';

interface EducationalGameProps {
  highScore: number;
  onUpdateHighScore: (score: number) => void;
}

export const EducationalGame: React.FC<EducationalGameProps> = ({
  highScore,
  onUpdateHighScore,
}) => {
  const { language, t } = useLanguage();
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

  // Countdown timer
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

  // Audio trigger on question change in audio mode
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
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
              <Gamepad2 className="w-5 h-5 text-amber-300" />
            </div>
            <span>{t('gameHeroTitle')}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('gameHeroSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-950 text-xs font-bold shadow-2xs">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>{t('highScoreBadge', { highScore })}</span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold animate-bounce">
              <Flame className="w-4 h-4 text-rose-600" />
              <span>{streak}x {language === 'ar' ? 'حماس' : 'Combo'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Mode Selector (When not playing) */}
      {!isPlaying && !gameOver && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                playUiSound('tap');
                setGameMode('match');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                gameMode === 'match'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('modeMatch')}
            </button>
            <button
              onClick={() => {
                playUiSound('tap');
                setGameMode('audio');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                gameMode === 'audio'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('modeAudio')}
            </button>
            <button
              onClick={() => {
                playUiSound('tap');
                setGameMode('puzzle');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                gameMode === 'puzzle'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('modePuzzle')}
            </button>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-teal-600 text-white text-center space-y-4 shadow-lg shadow-indigo-500/20">
            <div className="w-16 h-16 rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto text-3xl shadow-inner">
              🎮
            </div>
            <div className="max-w-sm mx-auto space-y-1">
              <h4 className="text-xl font-bold">{t('gameHeroTitle')}</h4>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                {t('gameHeroSubtitle')}
              </p>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 mx-auto"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{t('startGameBtn')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Game Playing Screen */}
      {isPlaying && currentQ && (
        <div className="space-y-4 max-w-lg mx-auto">
          {/* Header Stats Bar */}
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 text-xs font-bold shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">
                {currentQIndex + 1} / {GAME_QUESTIONS.length}
              </span>
              <span className="text-blue-700">
                {t('scoreBadge', { score })}
              </span>
            </div>

            <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
              <Timer className="w-3.5 h-3.5" />
              <span>{t('timeLeftLabel', { seconds: timeLeft })}</span>
            </div>
          </div>

          {/* Question Card */}
          <div className="p-6 rounded-3xl bg-white border-2 border-slate-200/90 shadow-md text-center space-y-4">
            {/* Visual Word Card */}
            {gameMode !== 'audio' ? (
              <div className="space-y-2">
                <span className="text-4xl">{currentQ.iconEmoji || '✨'}</span>
                <h4 className="text-3xl font-bold text-slate-900 font-serif">
                  {currentQ.word}
                </h4>
                {currentQ.phonetic && (
                  <p className="text-xs font-mono text-teal-700 bg-teal-50 inline-block px-3 py-0.5 rounded-lg border border-teal-100">
                    {currentQ.phonetic}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3 py-4">
                <button
                  onClick={() => handlePlayWordAudio()}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-700 to-teal-600 text-white flex items-center justify-center mx-auto shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <Volume2 className="w-8 h-8 animate-pulse" />
                </button>
                <p className="text-xs text-slate-500">
                  {language === 'ar'
                    ? 'استمع جيداً للصوت ثم اختر المعنى الصحيح'
                    : 'Listen carefully and select the correct translation'}
                </p>
              </div>
            )}

            {/* Answer Options Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {currentQ.options.map((opt, idx) => {
                let btnColor =
                  'bg-slate-50 hover:bg-blue-50/70 border-slate-200 text-slate-800';

                if (isAnswerChecked) {
                  if (idx === currentQ.correctIndex) {
                    btnColor = 'bg-teal-100 border-teal-500 text-teal-950 font-bold';
                  } else if (selectedAnswer === idx) {
                    btnColor = 'bg-rose-100 border-rose-500 text-rose-950 font-bold';
                  } else {
                    btnColor = 'bg-slate-50 border-slate-200 opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerChecked}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3.5 rounded-2xl border text-sm font-bold transition-all shadow-2xs active:scale-98 ${btnColor}`}
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
        <div className="p-8 sm:p-12 rounded-3xl bg-white border-2 border-slate-200 text-center space-y-4 max-w-md mx-auto shadow-md">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-400 text-white flex items-center justify-center mx-auto text-3xl shadow-md">
            🏆
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-900">
              {t('gameOverTitle')}
            </h4>
            <p className="text-sm text-slate-500 mt-1">
              {t('finalScoreLabel')} <span className="font-bold text-blue-700 text-lg">{score}</span>
            </p>
            {score >= highScore && score > 0 && (
              <p className="text-xs font-bold text-amber-600 mt-1">
                {t('newRecordBadge')}
              </p>
            )}
          </div>

          <button
            onClick={startGame}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 hover:from-blue-800 hover:to-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('playAgainBtn')}</span>
          </button>
        </div>
      )}
    </div>
  );
};
