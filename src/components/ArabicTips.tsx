import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  Volume2,
  CheckCircle2,
  HelpCircle,
  Search,
  Send,
  MessageSquare,
} from 'lucide-react';
import { EducationalTip } from '../types';
import { ARABIC_TIPS_DATA } from '../data/tipsData';
import { speakEnglish, speakArabic, playUiSound } from '../utils/speech';
import { useLanguage } from '../context/LanguageContext';

const TIP_CATEGORIES_MAP: Record<string, { ar: string; en: string }> = {
  'الكل': { ar: 'الكل', en: 'All' },
  'محادثة': { ar: 'محادثة', en: 'Conversation' },
  'نطق': { ar: 'نطق', en: 'Pronunciation' },
  'قواعد': { ar: 'قواعد', en: 'Grammar' },
  'حفظ الكلمات': { ar: 'حفظ الكلمات', en: 'Vocabulary' },
};

export const ArabicTips: React.FC = () => {
  const { language, t } = useLanguage();
  const [tips, setTips] = useState<EducationalTip[]>(ARABIC_TIPS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [isAskingAi, setIsAskingAi] = useState<boolean>(false);
  const [aiCustomTip, setAiCustomTip] = useState<EducationalTip | null>(null);

  const categories = ['الكل', 'محادثة', 'نطق', 'قواعد', 'حفظ الكلمات'];

  const filteredTips = tips.filter(
    (item) => selectedCategory === 'الكل' || item.category === selectedCategory
  );

  const handleAskCustomAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || isAskingAi) return;

    playUiSound('tap');
    setIsAskingAi(true);
    try {
      const prompt =
        language === 'ar'
          ? `قدم لي نصيحة ذهبية ومجربة باللغة العربية حول هذا الموضوع في تعلم الإنجليزية: "${customQuestion}". اجعل النصيحة مركزة وسهلة التطبيق جداً مع مثال إنجليزي مترجم.`
          : `Provide practical, proven golden advice for learning English regarding this topic: "${customQuestion}". Keep it concise, actionable, and provide an English example sentence with translation.`;

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: prompt }),
      });
      const data = await res.json();
      if (data.reply) {
        playUiSound('success');
        const newTip: EducationalTip = {
          id: 'custom-tip-' + Date.now(),
          titleAr:
            language === 'ar'
              ? `نصيحة مخصصة: ${customQuestion.slice(0, 30)}...`
              : `Custom Advice: ${customQuestion.slice(0, 30)}...`,
          category: 'محادثة',
          tipAr: data.reply,
        };
        setAiCustomTip(newTip);
        setCustomQuestion('');
      }
    } catch (e) {
      console.error('Error getting advice:', e);
    } finally {
      setIsAskingAi(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {t('tipsHeroTitle')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('tipsHeroSubtitle')}
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const catLabel =
              language === 'ar'
                ? TIP_CATEGORIES_MAP[cat]?.ar || cat
                : TIP_CATEGORIES_MAP[cat]?.en || cat;

            return (
              <button
                key={cat}
                onClick={() => {
                  playUiSound('tap');
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-100 text-slate-600 border-slate-200/60 hover:bg-slate-200'
                }`}
              >
                {catLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ask AI for custom advice */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-teal-50/40 border border-blue-200/80 space-y-2.5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
          <Sparkles className="w-4 h-4 text-blue-700" />
          <span>{t('askAiTipPrompt')}</span>
        </div>
        <form onSubmit={handleAskCustomAdvice} className="flex gap-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder={t('askAiTipPlaceholder')}
            className="flex-1 px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={isAskingAi || !customQuestion.trim()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 hover:from-blue-800 hover:to-teal-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs whitespace-nowrap active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isAskingAi ? t('askAiLoading') : t('askAiSubmitBtn')}</span>
          </button>
        </form>
      </div>

      {/* AI Custom Tip Result if generated */}
      {aiCustomTip && (
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/80 border border-amber-300 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold bg-amber-200/80 text-amber-950 px-2.5 py-0.5 rounded-full inline-block border border-amber-300">
              ✨ {language === 'ar' ? 'نصيحة ذكية خاصة بك' : 'Your Custom AI Tip'}
            </span>
            <button
              onClick={() => {
                playUiSound('tap');
                speakArabic(aiCustomTip.tipAr);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-xl transition-colors border border-amber-200 shadow-2xs"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-800" />
              <span>{t('listenTipBtn')}</span>
            </button>
          </div>
          <h4 className="font-bold text-slate-900 text-sm">{aiCustomTip.titleAr}</h4>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {aiCustomTip.tipAr}
          </p>
        </div>
      )}

      {/* Tips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredTips.map((tip) => {
          const catLabel =
            language === 'ar'
              ? TIP_CATEGORIES_MAP[tip.category]?.ar || tip.category
              : TIP_CATEGORIES_MAP[tip.category]?.en || tip.category;

          return (
            <div
              key={tip.id}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-sm transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-100">
                    {catLabel}
                  </span>

                  {/* Read Tip Aloud Button */}
                  <button
                    onClick={() => {
                      playUiSound('tap');
                      speakArabic(tip.tipAr);
                    }}
                    title={t('listenTipBtn')}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-xl transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{t('listenTipBtn')}</span>
                  </button>
                </div>

                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  {tip.titleAr}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {tip.tipAr}
                </p>
              </div>

              {tip.englishExample && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1 mt-2">
                  <div className="flex items-center justify-between text-slate-900 font-serif font-semibold">
                    <span>"{tip.englishExample.en}"</span>
                    <button
                      onClick={() => {
                        playUiSound('tap');
                        speakEnglish(tip.englishExample!.en);
                      }}
                      title={t('listenWord')}
                      className="p-1 text-teal-800 hover:text-teal-950 bg-white rounded-lg shadow-2xs border border-slate-200/60"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-slate-500 text-[11px]">{tip.englishExample.ar}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
