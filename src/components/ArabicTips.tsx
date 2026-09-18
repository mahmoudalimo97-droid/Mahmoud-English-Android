import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  Volume2,
  CheckCircle2,
  HelpCircle,
  Search,
} from 'lucide-react';
import { EducationalTip } from '../types';
import { ARABIC_TIPS_DATA } from '../data/tipsData';
import { speakEnglish, speakArabic, playUiSound } from '../utils/speech';

export const ArabicTips: React.FC = () => {
  const [tips, setTips] = useState<EducationalTip[]>(ARABIC_TIPS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [isAskingAi, setIsAskingAi] = useState<boolean>(false);
  const [aiCustomTip, setAiCustomTip] = useState<EducationalTip | null>(null);

  const categories = ['الكل', 'محادثة', 'نطق', 'قواعد', 'حفظ الكلمات'];

  const filteredTips = tips.filter(
    (t) => selectedCategory === 'الكل' || t.category === selectedCategory
  );

  const handleAskCustomAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || isAskingAi) return;

    playUiSound('tap');
    setIsAskingAi(true);
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: `قدم لي نصيحة ذهبية ومجربة باللغة العربية حول هذا الموضوع في تعلم الإنجليزية: "${customQuestion}". اجعل النصيحة مركزة وسهلة التطبيق جداً مع مثال إنجليزي مترجم.`,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        playUiSound('success');
        const newTip: EducationalTip = {
          id: 'custom-tip-' + Date.now(),
          titleAr: `نصيحة مخصصة: ${customQuestion.slice(0, 30)}...`,
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
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Lightbulb className="w-5 h-5" />
            </div>
            <span>نصائح وأسرار ناطقة لتعلم الإنجليزية</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            توجيهات لغوية مسموعة تبسط لك القواعد وسرعة النطق وبناء الثقة
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playUiSound('tap');
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ask AI for custom advice */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200/80 space-y-2.5 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
          <Sparkles className="w-4 h-4 text-emerald-800" />
          <span>اسأل الذكاء الاصطناعي عن نصيحة مخصصة لمشكلتك في الإنجليزية:</span>
        </div>
        <form onSubmit={handleAskCustomAdvice} className="flex gap-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="مثال: كيف أحفظ الأفعال الشاذة بسرعة؟ أو كيف أتخلص من التردد؟"
            className="flex-1 px-4 py-3 rounded-2xl bg-white border border-emerald-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-700 shadow-2xs"
          />
          <button
            type="submit"
            disabled={isAskingAi || !customQuestion.trim()}
            className="px-5 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-bold shadow-xs whitespace-nowrap active:scale-95 transition-all"
          >
            {isAskingAi ? 'جاري التحضير...' : 'اطلب النصيحة'}
          </button>
        </form>
      </div>

      {/* AI Custom Tip Result if generated */}
      {aiCustomTip && (
        <div className="p-5 rounded-3xl bg-amber-50/90 border border-amber-300 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full inline-block">
              ✨ نصيحة ذكية خاصة بك
            </span>
            <button
              onClick={() => {
                playUiSound('tap');
                speakArabic(aiCustomTip.tipAr);
              }}
              className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-xl transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>استمع للنصيحة</span>
            </button>
          </div>
          <h4 className="font-bold text-stone-900 text-sm">{aiCustomTip.titleAr}</h4>
          <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
            {aiCustomTip.tipAr}
          </p>
        </div>
      )}

      {/* Tips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredTips.map((tip) => (
          <div
            key={tip.id}
            className="p-5 rounded-3xl bg-white border border-stone-200/90 hover:border-emerald-600 shadow-2xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-100">
                  {tip.category}
                </span>

                {/* Read Tip Aloud Button */}
                <button
                  onClick={() => {
                    playUiSound('tap');
                    speakArabic(tip.tipAr);
                  }}
                  title="استمع للنصيحة بالعربية"
                  className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-xl transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>قراءة النصيحة</span>
                </button>
              </div>

              <h4 className="font-bold text-stone-900 text-sm sm:text-base">{tip.titleAr}</h4>
              <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                {tip.tipAr}
              </p>
            </div>

            {tip.englishExample && (
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs space-y-1 mt-2">
                <div className="flex items-center justify-between text-emerald-950 font-serif font-semibold">
                  <span>"{tip.englishExample.en}"</span>
                  <button
                    onClick={() => {
                      playUiSound('tap');
                      speakEnglish(tip.englishExample!.en);
                    }}
                    title="استمع للنطق الإنجليزي"
                    className="p-1 text-emerald-800 hover:text-emerald-950 bg-white rounded-lg shadow-2xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-stone-500 text-[11px]">{tip.englishExample.ar}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
