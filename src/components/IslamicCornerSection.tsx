import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  CheckCircle2,
  Award,
  ChevronRight,
  RotateCcw,
  Moon,
  HeartHandshake,
  Compass,
} from 'lucide-react';
import {
  ISLAMIC_DUAS,
  ISLAMIC_TERMS,
  PROPHETIC_WISDOMS,
  ISLAMIC_QUIZ_ITEMS,
  IslamicDua,
  IslamicTerm,
  PropheticWisdom,
} from '../data/islamicData';
import {
  speakEnglish,
  speakArabic,
  speakIslamicItem,
  playUiSound,
} from '../utils/speech';

type IslamicSubTab = 'duas' | 'terms' | 'wisdom' | 'quiz';

export const IslamicCornerSection: React.FC = () => {
  const [subTab, setSubTab] = useState<IslamicSubTab>('duas');
  const [activeDuaCategory, setActiveDuaCategory] = useState<string>('الكل');
  const [activeTermCategory, setActiveTermCategory] = useState<string>('الكل');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    playUiSound('pop');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePlayDua = async (dua: IslamicDua) => {
    setPlayingId(dua.id);
    await speakIslamicItem(dua.englishText, dua.arabicText);
    setPlayingId(null);
  };

  const handlePlayTerm = async (term: IslamicTerm) => {
    setPlayingId(term.id);
    playUiSound('tap');
    await speakEnglish(term.termEn, 0.88);
    await new Promise((r) => setTimeout(r, 260));
    await speakArabic(term.termAr, 0.95);
    setPlayingId(null);
  };

  const handlePlayWisdom = async (wisdom: PropheticWisdom) => {
    setPlayingId(wisdom.id);
    await speakIslamicItem(wisdom.englishText, wisdom.arabicText);
    setPlayingId(null);
  };

  const handleAnswerSelect = (optionIdx: number) => {
    if (isAnswerRevealed) return;
    setSelectedAnswer(optionIdx);
    setIsAnswerRevealed(true);

    const isCorrect = optionIdx === ISLAMIC_QUIZ_ITEMS[currentQuizIndex].correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      playUiSound('success');
    } else {
      playUiSound('pop');
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizIndex < ISLAMIC_QUIZ_ITEMS.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
      playUiSound('tap');
    } else {
      setIsQuizCompleted(true);
      playUiSound('chime');
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setScore(0);
    setIsQuizCompleted(false);
    playUiSound('tap');
  };

  // Filtered lists
  const filteredDuas = activeDuaCategory === 'الكل'
    ? ISLAMIC_DUAS
    : ISLAMIC_DUAS.filter((d) => d.category === activeDuaCategory);

  const filteredTerms = activeTermCategory === 'الكل'
    ? ISLAMIC_TERMS
    : ISLAMIC_TERMS.filter((t) => t.category === activeTermCategory);

  return (
    <div className="space-y-6 pb-8">
      {/* Top Islamic Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 p-6 md:p-8 text-white shadow-xl shadow-emerald-950/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-emerald-500/30">
              <Moon className="w-3.5 h-3.5" />
              <span>الركن الإسلامي الإنجليزي • Islamic Corner</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>اللغة الإنجليزية في رحاب الإسلام</span>
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            </h1>
            <p className="text-emerald-100/80 text-sm max-w-xl leading-relaxed">
              تعلم مصطلحات ديننا الحنيف، والأذكار والأدعية اليومية، ومكارم الأخلاق النبوية باللغة الإنجليزية، مع النطق الصوتي المريح والواضح.
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center gap-4 self-stretch sm:self-auto justify-around">
            <div className="text-center px-2">
              <div className="text-xl font-bold text-amber-300">{ISLAMIC_DUAS.length}</div>
              <div className="text-[11px] text-emerald-100">أدعية مأثورة</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <div className="text-xl font-bold text-emerald-300">{ISLAMIC_TERMS.length}</div>
              <div className="text-[11px] text-emerald-100">مصطلح إسلامي</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <div className="text-xl font-bold text-sky-300">{PROPHETIC_WISDOMS.length}</div>
              <div className="text-[11px] text-emerald-100">أحاديث وأخلاق</div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-white/10">
          <button
            onClick={() => {
              setSubTab('duas');
              playUiSound('tap');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'duas'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>الأدعية والأذكار المترجمة</span>
          </button>
          <button
            onClick={() => {
              setSubTab('terms');
              playUiSound('tap');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'terms'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>المصطلحات الإسلامية الهامة</span>
          </button>
          <button
            onClick={() => {
              setSubTab('wisdom');
              playUiSound('tap');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'wisdom'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>الأخلاق والوصايا النبوية</span>
          </button>
          <button
            onClick={() => {
              setSubTab('quiz');
              playUiSound('tap');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'quiz'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>مسابقة الركن الإسلامي</span>
          </button>
        </div>
      </div>

      {/* 1. DUAS TAB */}
      {subTab === 'duas' && (
        <div className="space-y-5">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {['الكل', 'طلب العلم والسكينة', 'أدعية يومية', 'أذكار الصباح والمساء'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveDuaCategory(cat);
                  playUiSound('tap');
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeDuaCategory === cat
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDuas.map((dua) => (
              <div
                key={dua.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      {dua.category}
                    </span>
                    <h3 className="text-xs font-semibold text-slate-500">{dua.titleEn}</h3>
                  </div>

                  {/* Arabic Text in Calligraphic style */}
                  <div className="bg-emerald-50/40 rounded-xl p-3.5 border border-emerald-100 text-center">
                    <p className="text-lg font-bold text-emerald-950 font-serif leading-loose">
                      {dua.arabicText}
                    </p>
                    <p className="text-[11px] text-emerald-700/80 italic mt-1 font-mono">
                      {dua.transliteration}
                    </p>
                  </div>

                  {/* English Translation */}
                  <div className="space-y-1">
                    <div className="text-xs text-slate-400 font-medium">الترجمة بالإنجليزية:</div>
                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                      "{dua.englishText}"
                    </p>
                  </div>

                  {/* Virtue */}
                  <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg leading-relaxed">
                    💡 <span className="font-semibold text-slate-700">الفضل والأثر:</span> {dua.virtueAr}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleCopyText(dua.id, `${dua.arabicText}\n${dua.englishText}`)}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 font-medium py-1 px-2.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    {copiedId === dua.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ الدعاء</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handlePlayDua(dua)}
                    disabled={playingId === dua.id}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${playingId === dua.id ? 'animate-bounce' : ''}`} />
                    <span>{playingId === dua.id ? 'جارٍ الاستماع...' : 'استمع للدعاء'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ISLAMIC TERMS TAB */}
      {subTab === 'terms' && (
        <div className="space-y-5">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {['الكل', 'عبادات', 'عقيدة وأخلاق', 'مصطلحات شائعة'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveTermCategory(cat);
                  playUiSound('tap');
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTermCategory === cat
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTerms.map((term) => (
              <div
                key={term.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{term.termEn}</h3>
                      <p className="text-xs font-semibold text-emerald-700 font-serif">{term.termAr}</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {term.phonetic}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {term.definitionEn}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {term.definitionAr}
                  </p>

                  <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800">مثال في جملة مفيدة:</span>
                    <p className="text-xs font-semibold text-slate-800">"{term.exampleEn}"</p>
                    <p className="text-[11px] text-slate-600">{term.exampleAr}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">{term.category}</span>
                  <button
                    onClick={() => handlePlayTerm(term)}
                    disabled={playingId === term.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold transition-all"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>نطق الكلمة</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. PROPHETIC WISDOM TAB */}
      {subTab === 'wisdom' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROPHETIC_WISDOMS.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                      {item.topicAr} • {item.topicEn}
                    </span>
                    <span className="text-[11px] text-slate-400">{item.source}</span>
                  </div>

                  <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-center">
                    <p className="text-lg font-bold text-emerald-950 font-serif leading-relaxed">
                      "{item.arabicText}"
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-semibold">المعنى بالإنجليزية:</span>
                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                      "{item.englishText}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleCopyText(item.id, `"${item.arabicText}"\n"${item.englishText}"`)}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 py-1 px-2.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ الحديث</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handlePlayWisdom(item)}
                    disabled={playingId === item.id}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold transition-all"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>استمع للحديث</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ISLAMIC QUIZ TAB */}
      {subTab === 'quiz' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md">
          {!isQuizCompleted ? (
            <div className="space-y-6">
              {/* Progress Header */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  السؤال {currentQuizIndex + 1} من {ISLAMIC_QUIZ_ITEMS.length}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  النقاط الحالية: {score}
                </span>
              </div>

              {/* Question */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {ISLAMIC_QUIZ_ITEMS[currentQuizIndex].questionAr}
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  {ISLAMIC_QUIZ_ITEMS[currentQuizIndex].questionEn}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {ISLAMIC_QUIZ_ITEMS[currentQuizIndex].options.map((opt, idx) => {
                  const isCorrect = idx === ISLAMIC_QUIZ_ITEMS[currentQuizIndex].correctIndex;
                  const isSelected = selectedAnswer === idx;

                  let btnStyle = 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-slate-800';
                  if (isAnswerRevealed) {
                    if (isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'border-rose-400 bg-rose-50 text-rose-900 font-bold';
                    } else {
                      btnStyle = 'border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(idx)}
                      disabled={isAnswerRevealed}
                      className={`w-full p-4 rounded-xl border-2 text-right transition-all flex items-center justify-between text-sm ${btnStyle}`}
                    >
                      <span dir="ltr" className="font-medium text-left">{opt}</span>
                      {isAnswerRevealed && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mr-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next */}
              {isAnswerRevealed && (
                <div className="space-y-4 pt-2 animate-fadeIn">
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed">
                    💡 <span className="font-bold">توضيح:</span> {ISLAMIC_QUIZ_ITEMS[currentQuizIndex].explanationAr}
                  </div>

                  <button
                    onClick={handleNextQuizQuestion}
                    className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>{currentQuizIndex < ISLAMIC_QUIZ_ITEMS.length - 1 ? 'السؤال التالي' : 'عرض النتيجة النهائية'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Completed Screen */
            <div className="text-center py-6 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">بارك الله فيك وجزاك خيراً!</h3>
                <p className="text-sm text-slate-600">
                  لقد حصلت على <span className="font-bold text-emerald-700">{score}</span> من أصل <span className="font-bold">{ISLAMIC_QUIZ_ITEMS.length}</span>
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 max-w-sm mx-auto leading-relaxed">
                قال رسول الله ﷺ: «مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ».
              </div>

              <button
                onClick={handleResetQuiz}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs shadow-md transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة المسابقة</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
