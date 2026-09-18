import React, { useState, useMemo } from 'react';
import {
  Volume2,
  Search,
  Plus,
  Bookmark,
  Trash2,
  Layers,
  X,
  Sparkles,
  CheckCircle2,
  Headphones,
  Image as ImageIcon,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Clock,
  Zap,
} from 'lucide-react';
import { VocabWord } from '../types';
import { VOCAB_CATEGORIES } from '../data/defaultVocab';
import { speakEnglish, speakWordWithExplanation, playUiSound } from '../utils/speech';
import { useLanguage } from '../context/LanguageContext';

interface SpeakingVocabProps {
  allWords: VocabWord[];
  onAddCustomWord: (word: VocabWord) => void;
  onDeleteWord: (wordId: string) => void;
}

const CATEGORY_MAP: Record<string, { ar: string; en: string }> = {
  'الكل': { ar: 'الكل', en: 'All' },
  'كلماتي المحفوظة': { ar: 'كلماتي المحفوظة', en: 'My Saved Words' },
  'المنزل والأشياء': { ar: 'المنزل والأشياء', en: 'Home & Objects' },
  'الطعام والشراب': { ar: 'الطعام والشراب', en: 'Food & Drinks' },
  'المحادثة والتحيات': { ar: 'المحادثة والتحيات', en: 'Greetings & Chat' },
  'السفر والاتجاهات': { ar: 'السفر والاتجاهات', en: 'Travel & Directions' },
  'العمل والتقنية': { ar: 'العمل والتقنية', en: 'Work & Technology' },
};

export const SpeakingVocab: React.FC<SpeakingVocabProps> = ({
  allWords,
  onAddCustomWord,
  onDeleteWord,
}) => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSlowAudio, setIsSlowAudio] = useState<boolean>(false);
  const [currentlySpeaking, setCurrentlySpeaking] = useState<string | null>(null);

  // Flashcards mode state
  const [isFlashcardMode, setIsFlashcardMode] = useState<boolean>(false);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // New Word Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newEnglish, setNewEnglish] = useState('');
  const [newArabic, setNewArabic] = useState('');
  const [newCategory, setNewCategory] = useState('المنزل والأشياء');
  const [newPhonetic, setNewPhonetic] = useState('');
  const [newEmoji, setNewEmoji] = useState('✨');
  const [newExampleEn, setNewExampleEn] = useState('');
  const [newExampleAr, setNewExampleAr] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Filtered words
  const filteredWords = useMemo(() => {
    return allWords.filter((word) => {
      const matchesCat =
        selectedCategory === 'الكل' ||
        (selectedCategory === 'كلماتي المحفوظة' && word.isCustom) ||
        word.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        word.english.toLowerCase().includes(q) ||
        word.arabic.toLowerCase().includes(q) ||
        (word.exampleEn && word.exampleEn.toLowerCase().includes(q));

      return matchesCat && matchesQuery;
    });
  }, [allWords, selectedCategory, searchQuery]);

  const handleSpeakWord = async (word: VocabWord) => {
    setCurrentlySpeaking(word.id);
    playUiSound('tap');
    await speakEnglish(word.english, isSlowAudio ? 0.72 : 0.92);
    setCurrentlySpeaking(null);
  };

  const handleSpeakWithTranslation = async (word: VocabWord, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentlySpeaking(word.id + '-full');
    playUiSound('tap');
    await speakWordWithExplanation(word.english, word.arabic, isSlowAudio ? 0.72 : 0.92);
    setCurrentlySpeaking(null);
  };

  const handleSpeakSentence = async (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentlySpeaking(id);
    playUiSound('tap');
    await speakEnglish(text, isSlowAudio ? 0.75 : 0.9);
    setCurrentlySpeaking(null);
  };

  const handleCreateWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnglish.trim() || !newArabic.trim()) return;

    const customWord: VocabWord = {
      id: 'custom-' + Date.now(),
      english: newEnglish.trim(),
      arabic: newArabic.trim(),
      phonetic: newPhonetic.trim() || `/${newEnglish.trim().toLowerCase()}/`,
      category: newCategory,
      iconEmoji: newEmoji.trim() || '📝',
      imageUrl:
        newImageUrl.trim() ||
        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=80',
      exampleEn: newExampleEn.trim() || undefined,
      exampleAr: newExampleAr.trim() || undefined,
      isCustom: true,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onAddCustomWord(customWord);
    playUiSound('success');
    setIsModalOpen(false);
    setNewEnglish('');
    setNewArabic('');
    setNewPhonetic('');
    setNewEmoji('✨');
    setNewExampleEn('');
    setNewExampleAr('');
    setNewImageUrl('');
  };

  // Flashcards navigation
  const currentCard = filteredWords[currentCardIndex] || filteredWords[0];

  const handleNextCard = () => {
    playUiSound('pop');
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % (filteredWords.length || 1));
  };

  const handlePrevCard = () => {
    playUiSound('pop');
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + (filteredWords.length || 1)) % (filteredWords.length || 1));
  };

  return (
    <div className="space-y-5">
      {/* Top Header Controls with Graphic Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <Headphones className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>{t('vocabHeroTitle')}</span>
              <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                {allWords.length} {language === 'ar' ? 'كلمة' : 'words'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 max-w-md">
              {t('vocabHeroSubtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Slow audio toggle */}
          <button
            onClick={() => {
              playUiSound('tap');
              setIsSlowAudio(!isSlowAudio);
            }}
            title={isSlowAudio ? t('speedNormal') : t('speedSlow')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
              isSlowAudio
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isSlowAudio ? (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>{t('speedSlow')}</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('speedNormal')}</span>
              </>
            )}
          </button>

          {/* Flashcard Mode Toggle */}
          <button
            onClick={() => {
              playUiSound('tap');
              setIsFlashcardMode(!isFlashcardMode);
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
              isFlashcardMode
                ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white border-blue-600 shadow-xs'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isFlashcardMode ? t('viewList') : t('viewFlashcards')}</span>
          </button>

          {/* Add Word Button */}
          <button
            onClick={() => {
              playUiSound('tap');
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('addNewWordBtn')}</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter (List Mode) */}
      {!isFlashcardMode && (
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute start-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full ps-11 pe-10 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 shadow-2xs transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Chips Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {VOCAB_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              const catLabel =
                language === 'ar'
                  ? CATEGORY_MAP[cat]?.ar || cat
                  : CATEGORY_MAP[cat]?.en || cat;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    playUiSound('tap');
                    setSelectedCategory(cat);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300'
                  }`}
                >
                  <span>{catLabel}</span>
                  {cat === 'الكل' && (
                    <span className="text-[10px] opacity-80 bg-black/10 px-1.5 py-0.2 rounded-full">
                      {allWords.length}
                    </span>
                  )}
                  {cat === 'كلماتي المحفوظة' && (
                    <span className="text-[10px] bg-teal-900/30 px-1.5 py-0.2 rounded-full">
                      {allWords.filter((w) => w.isCustom).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* FLASHCARD PRACTICE MODE */}
      {isFlashcardMode ? (
        <div className="max-w-md mx-auto py-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <span className="font-semibold">
              {t('cardCount', {
                current: currentCardIndex + 1,
                total: filteredWords.length || 1,
              })}
            </span>
            <span className="text-blue-700 font-medium flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('flipHint')}</span>
            </span>
          </div>

          {currentCard ? (
            <div
              onClick={() => {
                playUiSound('pop');
                setIsFlipped(!isFlipped);
              }}
              className="relative min-h-[350px] rounded-3xl overflow-hidden bg-white border-2 border-slate-200 hover:border-blue-500 shadow-md hover:shadow-lg cursor-pointer transition-all flex flex-col group select-none"
            >
              {/* Card Image Banner */}
              {currentCard.imageUrl && (
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={currentCard.imageUrl}
                    alt={currentCard.english}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

                  <span className="absolute top-3 end-3 text-lg bg-white/90 backdrop-blur-md w-9 h-9 rounded-xl flex items-center justify-center shadow-xs">
                    {currentCard.iconEmoji || '✨'}
                  </span>

                  <span className="absolute bottom-3 start-3 text-[11px] font-semibold bg-blue-700/90 text-white px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                    {language === 'ar'
                      ? CATEGORY_MAP[currentCard.category]?.ar || currentCard.category
                      : CATEGORY_MAP[currentCard.category]?.en || currentCard.category}
                  </span>
                </div>
              )}

              {/* Front or Back Content */}
              <div className="p-5 flex-1 flex flex-col justify-center items-center text-center space-y-2">
                {!isFlipped ? (
                  /* Front: English */
                  <>
                    <h4 className="text-3xl font-bold text-slate-900 font-serif tracking-tight flex items-center gap-2">
                      <span>{currentCard.english}</span>
                    </h4>
                    <p className="text-sm font-mono text-teal-800 bg-teal-50 border border-teal-200 px-3 py-0.5 rounded-lg">
                      {currentCard.phonetic}
                    </p>
                    <p className="text-xs text-slate-400 pt-1">
                      {language === 'ar'
                        ? 'اضغط لرؤية الترجمة العربية والأمثلة'
                        : 'Tap card to reveal translation & example'}
                    </p>
                  </>
                ) : (
                  /* Back: Arabic & Sentence */
                  <>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      {language === 'ar' ? 'المعنى والترجمة' : 'Arabic Translation'}
                    </span>
                    <h4 className="text-2xl font-bold text-teal-950">
                      {currentCard.arabic}
                    </h4>
                    {currentCard.exampleEn && (
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 text-start w-full mt-1">
                        <p className="font-serif font-semibold text-slate-800">
                          {currentCard.exampleEn}
                        </p>
                        <p className="text-slate-500">{currentCard.exampleAr}</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Floating Audio Action Inside Card */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeakWord(currentCard);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-semibold shadow-xs"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{t('listenWord')}</span>
                </button>

                <button
                  onClick={(e) => handleSpeakWithTranslation(currentCard, e)}
                  className="text-xs text-slate-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{t('listenWithMeaning')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-3xl border border-slate-200">
              <p className="text-sm font-bold text-slate-700">{t('noWordsFound')}</p>
            </div>
          )}

          {/* Flashcard Next/Prev Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrevCard}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold shadow-xs flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('prevCard')}</span>
            </button>

            <button
              onClick={handleNextCard}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2"
            >
              <span>{t('nextCard')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredWords.map((word) => {
              const isSpeakingThis = currentlySpeaking === word.id;
              const catLabel =
                language === 'ar'
                  ? CATEGORY_MAP[word.category]?.ar || word.category
                  : CATEGORY_MAP[word.category]?.en || word.category;

              return (
                <div
                  key={word.id}
                  onClick={() => handleSpeakWord(word)}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all flex flex-col overflow-hidden group cursor-pointer"
                >
                  {/* Image or Visual Top Header */}
                  <div className="relative h-28 w-full bg-slate-100 overflow-hidden">
                    {word.imageUrl ? (
                      <img
                        src={word.imageUrl}
                        alt={word.english}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-blue-50 to-teal-50 flex items-center justify-center text-4xl">
                        {word.iconEmoji || '✨'}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    {/* Word English and Phonetic on Image */}
                    <div className="absolute bottom-2.5 start-3 end-3 flex items-end justify-between text-white">
                      <div>
                        <h4 className="text-lg font-bold font-serif leading-tight text-white drop-shadow-sm">
                          {word.english}
                        </h4>
                        {word.phonetic && (
                          <span className="text-[11px] font-mono text-teal-200">
                            {word.phonetic}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-semibold bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full">
                        {catLabel}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-slate-900">
                          {word.arabic}
                        </span>

                        {/* Speaking animation indicator */}
                        {isSpeakingThis && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-ping"></span>
                            <span>{language === 'ar' ? 'ينطق الآن...' : 'Speaking...'}</span>
                          </span>
                        )}
                      </div>

                      {/* Example Sentence */}
                      {word.exampleEn && (
                        <div className="mt-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs space-y-1">
                          <div className="flex items-center justify-between font-serif font-medium text-slate-800">
                            <span>"{word.exampleEn}"</span>
                            <button
                              onClick={(e) =>
                                handleSpeakSentence(word.exampleEn!, word.id + '-ex', e)
                              }
                              title={t('listenWord')}
                              className="text-slate-400 hover:text-blue-700 p-1"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {word.exampleAr && (
                            <p className="text-slate-500 text-[11px]">{word.exampleAr}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                      {/* Speak button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeakWord(word);
                        }}
                        className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          isSpeakingThis
                            ? 'bg-blue-700 text-white'
                            : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{t('listenWord')}</span>
                      </button>

                      {/* Bilingual Explanation */}
                      <button
                        onClick={(e) => handleSpeakWithTranslation(word, e)}
                        title={t('listenWithMeaning')}
                        className="py-1.5 px-2.5 rounded-xl text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
                      >
                        <Volume2 className="w-3 h-3 text-teal-600" />
                        <span>{language === 'ar' ? 'نطق + ترجمة' : 'Both'}</span>
                      </button>

                      {/* Delete Custom Word */}
                      {word.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteWord(word.id);
                          }}
                          title={language === 'ar' ? 'حذف الكلمة' : 'Delete word'}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredWords.length === 0 && (
            <div className="text-center py-12 p-6 rounded-3xl bg-white border border-slate-200 text-slate-500 space-y-2 shadow-xs">
              <Search className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-sm font-bold text-slate-700">{t('noWordsFound')}</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('الكل');
                }}
                className="mt-2 px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-800"
              >
                {language === 'ar' ? 'عرض كافة الكلمات' : 'Show All Words'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add New Word Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-700" />
                <span>{t('addWordModalTitle')}</span>
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWord} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('wordEnglishInput')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Garden, Mirror, Bicycle"
                    value={newEnglish}
                    onChange={(e) => setNewEnglish(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-sm font-serif"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {language === 'ar' ? 'رمز / إيموجي' : 'Emoji'}
                  </label>
                  <input
                    type="text"
                    value={newEmoji}
                    onChange={(e) => setNewEmoji(e.target.value)}
                    placeholder="🏡"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-center text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('wordArabicInput')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حديقة، مرآة، دراجة"
                  value={newArabic}
                  onChange={(e) => setNewArabic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('wordPhoneticInput')}
                  </label>
                  <input
                    type="text"
                    placeholder="/ˈɡɑːrdn/"
                    value={newPhonetic}
                    onChange={(e) => setNewPhonetic(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('wordCategorySelect')}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    {VOCAB_CATEGORIES.filter((c) => c !== 'الكل' && c !== 'كلماتي المحفوظة').map(
                      (cat) => (
                        <option key={cat} value={cat}>
                          {language === 'ar'
                            ? CATEGORY_MAP[cat]?.ar || cat
                            : CATEGORY_MAP[cat]?.en || cat}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('wordExampleEn')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. The flowers bloom in the garden."
                  value={newExampleEn}
                  onChange={(e) => setNewExampleEn(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-serif"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('wordExampleAr')}
                </label>
                <input
                  type="text"
                  placeholder="مثال: تتفتح الأزهار في الحديقة."
                  value={newExampleAr}
                  onChange={(e) => setNewExampleAr(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'ar' ? 'رابط صورة توضيحية (اختياري)' : 'Illustration Image URL (Optional)'}
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  {t('cancelAction')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold shadow-xs active:scale-95 transition-all"
                >
                  {t('saveWordAction')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
