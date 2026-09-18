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
} from 'lucide-react';
import { VocabWord } from '../types';
import { VOCAB_CATEGORIES } from '../data/defaultVocab';
import { speakEnglish, speakWordWithExplanation, playUiSound } from '../utils/speech';

interface SpeakingVocabProps {
  allWords: VocabWord[];
  onAddCustomWord: (word: VocabWord) => void;
  onDeleteWord: (wordId: string) => void;
}

export const SpeakingVocab: React.FC<SpeakingVocabProps> = ({
  allWords,
  onAddCustomWord,
  onDeleteWord,
}) => {
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
    await speakWordWithExplanation(word.english, word.arabic, isSlowAudio ? 0.72 : 0.92);
    setCurrentlySpeaking(null);
  };

  const handleSpeakSentence = async (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentlySpeaking(id);
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

  // Flashcards helpers
  const currentCard = filteredWords[currentCardIndex] || filteredWords[0];

  const handleNextCard = () => {
    playUiSound('pop');
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePrevCard = () => {
    playUiSound('pop');
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  return (
    <div className="space-y-5">
      {/* Top Header Controls with Graphic Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-stone-200/90 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-900/15">
            <Headphones className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>قاموس الكلمات المصور والناطق</span>
              <span className="text-xs font-normal text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full font-sans">
                {allWords.length} كلمة ناطقة
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              اضغط على أي صورة أو أيقونة لسماع النطق الصوتي الفوري مع الترجمة
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
            title="تبديل سرعة النطق للمبتدئين"
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isSlowAudio
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <span>{isSlowAudio ? '🐢 نطق بطيء (0.75x)' : '⚡ سرعة عادية'}</span>
          </button>

          {/* Flashcard Toggle */}
          <button
            onClick={() => {
              playUiSound('tap');
              setIsFlashcardMode(!isFlashcardMode);
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              isFlashcardMode
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>وضع البطاقات المصورة</span>
          </button>

          {/* Add Word Button */}
          <button
            onClick={() => {
              playUiSound('tap');
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة كلمة مصورة</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter */}
      {!isFlashcardMode && (
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute right-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالإنجليزية أو بالعربية أو باسم العنصر..."
              className="w-full pl-4 pr-11 py-3 rounded-2xl bg-white border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-700 shadow-2xs transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3.5 top-3.5 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Chips Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {VOCAB_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    playUiSound('tap');
                    setSelectedCategory(cat);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:border-emerald-600'
                  }`}
                >
                  <span>{cat}</span>
                  {cat === 'الكل' && (
                    <span className="text-[10px] opacity-80 bg-black/10 px-1.5 py-0.2 rounded-full">
                      {allWords.length}
                    </span>
                  )}
                  {cat === 'كلماتي المحفوظة' && (
                    <span className="text-[10px] bg-emerald-900/30 px-1.5 py-0.2 rounded-full">
                      {allWords.filter((w) => w.isCustom).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* FLASHCARD MODE WITH ILLUSTRATIVE PICTURES */}
      {isFlashcardMode ? (
        <div className="max-w-md mx-auto py-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 px-2">
            <span className="font-semibold">
              البطاقة {currentCardIndex + 1} من {filteredWords.length}
            </span>
            <span className="text-emerald-800 font-medium">اضغط على البطاقة لقلبها وسماع الشرح 🔄</span>
          </div>

          {currentCard ? (
            <div
              onClick={() => {
                playUiSound('pop');
                setIsFlipped(!isFlipped);
              }}
              className="relative min-h-[340px] rounded-3xl overflow-hidden bg-white border-2 border-stone-200 hover:border-emerald-600 shadow-lg cursor-pointer transition-all flex flex-col group select-none"
            >
              {/* Card Image Banner */}
              {currentCard.imageUrl && (
                <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={currentCard.imageUrl}
                    alt={currentCard.english}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

                  <span className="absolute top-3 right-3 text-lg bg-white/90 backdrop-blur-md w-9 h-9 rounded-xl flex items-center justify-center shadow-xs">
                    {currentCard.iconEmoji || '✨'}
                  </span>

                  <span className="absolute bottom-3 right-3 text-[11px] font-semibold bg-emerald-800/90 text-white px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                    {currentCard.category}
                  </span>
                </div>
              )}

              {/* Front or Back Content */}
              <div className="p-5 flex-1 flex flex-col justify-center items-center text-center space-y-2">
                {!isFlipped ? (
                  /* Front: English */
                  <>
                    <h4 className="text-3xl font-bold text-stone-900 font-serif tracking-tight flex items-center gap-2">
                      <span>{currentCard.english}</span>
                    </h4>
                    <p className="text-sm font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-lg">
                      {currentCard.phonetic}
                    </p>
                    <p className="text-xs text-stone-400 pt-1">
                      اضغط لرؤية الترجمة العربية والأمثلة
                    </p>
                  </>
                ) : (
                  /* Back: Arabic & Sentence */
                  <>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      المعنى والترجمة
                    </span>
                    <h4 className="text-2xl font-bold text-emerald-950">
                      {currentCard.arabic}
                    </h4>
                    {currentCard.exampleEn && (
                      <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1 text-right w-full mt-1">
                        <p className="font-serif font-semibold text-stone-800">
                          {currentCard.exampleEn}
                        </p>
                        <p className="text-stone-500">{currentCard.exampleAr}</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Floating Audio Action Inside Card */}
              <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeakWord(currentCard);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>استمع للكلمة</span>
                </button>

                <button
                  onClick={(e) => handleSpeakWithTranslation(currentCard, e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium"
                >
                  <span>نطق وترجمة صوتية 🗣️</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-stone-500">لا توجد كلمات في هذا القسم</div>
          )}

          {/* Flashcard Navigation */}
          <div className="flex items-center justify-between gap-3 px-2">
            <button
              onClick={handlePrevCard}
              disabled={filteredWords.length <= 1}
              className="flex-1 py-3 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold transition-all shadow-2xs disabled:opacity-50"
            >
              السابق
            </button>
            <button
              onClick={() => handleSpeakWord(currentCard)}
              className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors shadow-2xs"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextCard}
              disabled={filteredWords.length <= 1}
              className="flex-1 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
            >
              التالي ➔
            </button>
          </div>
        </div>
      ) : (
        /* GRID LIST MODE WITH PICTURES AND TALKING ICONS */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>عدد الكلمات المعروضة: {filteredWords.length} كلمة مصورة</span>
            <span className="flex items-center gap-1 text-emerald-800 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>انقر على أي صورة أو زر استماع لتشغيل النطق</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredWords.map((word) => {
              const isSpeakingThis = currentlySpeaking === word.id;
              const isSpeakingFull = currentlySpeaking === word.id + '-full';

              return (
                <div
                  key={word.id}
                  onClick={() => handleSpeakWord(word)}
                  className="rounded-3xl bg-white border border-stone-200/90 hover:border-emerald-600 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group cursor-pointer"
                >
                  {/* Word Illustrative Picture */}
                  <div className="relative h-36 w-full bg-stone-100 overflow-hidden">
                    {word.imageUrl ? (
                      <img
                        src={word.imageUrl}
                        alt={word.english}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-4xl">
                        {word.iconEmoji || '📷'}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                    {/* Emoji Tag */}
                    <span className="absolute top-2.5 right-2.5 text-base bg-white/90 backdrop-blur-md w-8 h-8 rounded-xl flex items-center justify-center shadow-xs">
                      {word.iconEmoji || '✨'}
                    </span>

                    {/* Category Pill */}
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {word.category}
                    </span>

                    {/* Bottom overlay text on photo */}
                    <div className="absolute bottom-2 right-3 left-3 flex items-baseline justify-between text-white">
                      <div className="flex items-baseline gap-2">
                        <h4 className="text-xl font-bold font-serif drop-shadow-sm">
                          {word.english}
                        </h4>
                        <span className="text-[11px] font-mono text-emerald-300 drop-shadow-xs">
                          {word.phonetic}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-stone-900">
                          {word.arabic}
                        </span>

                        {/* Sound Wave Animation / Speaking state */}
                        {isSpeakingThis && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                            <span>ينطق الآن...</span>
                          </span>
                        )}
                      </div>

                      {/* Example Sentence */}
                      {word.exampleEn && (
                        <div className="mt-2 p-2.5 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs space-y-1">
                          <div className="flex items-center justify-between font-serif font-medium text-stone-800">
                            <span>"{word.exampleEn}"</span>
                            <button
                              onClick={(e) =>
                                handleSpeakSentence(word.exampleEn!, word.id + '-ex', e)
                              }
                              title="استمع للجملة"
                              className="text-stone-400 hover:text-emerald-800 p-1"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {word.exampleAr && (
                            <p className="text-stone-500 text-[11px]">{word.exampleAr}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1">
                      {/* Primary Speak Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeakWord(word);
                        }}
                        className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          isSpeakingThis
                            ? 'bg-emerald-700 text-white'
                            : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>نطق الكلمة</span>
                      </button>

                      {/* Bilingual Explanation */}
                      <button
                        onClick={(e) => handleSpeakWithTranslation(word, e)}
                        title="نطق الكلمة ثم قراءة الترجمة بالعربية"
                        className="py-1.5 px-2 rounded-xl text-[11px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                      >
                        <span>نطق + ترجمة 🗣️</span>
                      </button>

                      {/* Delete Custom Word */}
                      {word.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteWord(word.id);
                          }}
                          title="حذف من كلماتي"
                          className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
            <div className="text-center py-12 p-6 rounded-3xl bg-white border border-stone-200 text-stone-500 space-y-2">
              <Search className="w-8 h-8 mx-auto text-stone-400" />
              <p className="text-sm font-semibold text-stone-700">
                لم نجد أي كلمة مطابقة لبحثك
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('الكل');
                }}
                className="mt-2 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                عرض كافة الكلمات
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add New Word Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-800" />
                <span>إضافة كلمة مصورة وناطقة جديدة</span>
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWord} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    الكلمة بالإنجليزية (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Garden, Mirror, Bicycle"
                    value={newEnglish}
                    onChange={(e) => setNewEnglish(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700 text-sm font-serif"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    أيقونة / رمز
                  </label>
                  <input
                    type="text"
                    value={newEmoji}
                    onChange={(e) => setNewEmoji(e.target.value)}
                    placeholder="🏡"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-center text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  الترجمة باللغة العربية *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حديقة، مرآة، دراجة هوائية"
                  value={newArabic}
                  onChange={(e) => setNewArabic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1 flex items-center justify-between">
                  <span>رابط صورة توضيحية (Image URL اختياري)</span>
                  <ImageIcon className="w-3.5 h-3.5 text-stone-400" />
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-700 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    النطق التقريبي
                  </label>
                  <input
                    type="text"
                    placeholder="/ˈɡɑːrdn/"
                    value={newPhonetic}
                    onChange={(e) => setNewPhonetic(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    القسم
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    {VOCAB_CATEGORIES.filter((c) => c !== 'الكل' && c !== 'كلماتي المحفوظة').map(
                      (c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  جملة مثال بالإنجليزية (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="e.g. The garden is full of red flowers."
                  value={newExampleEn}
                  onChange={(e) => setNewExampleEn(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-serif"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  ترجمة جملة المثال بالعربية
                </label>
                <input
                  type="text"
                  placeholder="الحديقة مليئة بالأزهار الحمراء."
                  value={newExampleAr}
                  onChange={(e) => setNewExampleAr(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold shadow-xs"
                >
                  حفظ الكلمة في الذاكرة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
