import React from 'react';
import { Volume2, CheckCircle, XCircle, ArrowLeft, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { speakEnglish, speakArabic, playUiSound } from '../utils/speech';

interface LessonVisualDiagramProps {
  diagramType?: 'sentence-structure' | 'present-simple' | 'prepositions' | 'questions' | 'common-mistakes';
}

export const LessonVisualDiagram: React.FC<LessonVisualDiagramProps> = ({ diagramType }) => {
  if (!diagramType) return null;

  const handleSpeakItem = async (en: string, ar?: string) => {
    playUiSound('tap');
    await speakEnglish(en);
    if (ar) {
      await new Promise((r) => setTimeout(r, 200));
      await speakArabic(ar);
    }
  };

  if (diagramType === 'sentence-structure') {
    return (
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 text-white shadow-md border border-emerald-900/50 space-y-3.5 my-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📐</span>
            <h5 className="text-sm font-bold text-emerald-300">
              المخطط البصري لمعادلة الجملة الإنجليزية (S + V + O)
            </h5>
          </div>
          <span className="text-[10px] text-emerald-200/70 bg-white/10 px-2 py-0.5 rounded-full">
            اضغط على أي عنصر لسماع نطقه 🔊
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* 1. Subject */}
          <button
            type="button"
            onClick={() => handleSpeakItem('Subject', 'الفاعل')}
            className="p-3.5 rounded-2xl bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-700/60 text-right transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-bold text-emerald-300 bg-black/30 px-2 py-0.5 rounded-md">
                1. الفاعل
              </span>
              <Volume2 className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2">
              <div className="text-base font-bold font-serif text-white">Subject</div>
              <div className="text-xs text-emerald-200 font-sans">I, Mahmoud, The doctor</div>
            </div>
          </button>

          {/* 2. Verb */}
          <button
            type="button"
            onClick={() => handleSpeakItem('Verb', 'الفعل')}
            className="p-3.5 rounded-2xl bg-teal-900/60 hover:bg-teal-800/80 border border-teal-700/60 text-right transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-bold text-teal-300 bg-black/30 px-2 py-0.5 rounded-md">
                2. الفعل
              </span>
              <Volume2 className="w-4 h-4 text-teal-300 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2">
              <div className="text-base font-bold font-serif text-white">Verb</div>
              <div className="text-xs text-teal-200 font-sans">drinks, reads, learns</div>
            </div>
          </button>

          {/* 3. Object */}
          <button
            type="button"
            onClick={() => handleSpeakItem('Object', 'المفعول به والتكملة')}
            className="p-3.5 rounded-2xl bg-cyan-900/60 hover:bg-cyan-800/80 border border-cyan-700/60 text-right transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-bold text-cyan-300 bg-black/30 px-2 py-0.5 rounded-md">
                3. المفعول به
              </span>
              <Volume2 className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2">
              <div className="text-base font-bold font-serif text-white">Object / Rest</div>
              <div className="text-xs text-cyan-200 font-sans">coffee, English, a book</div>
            </div>
          </button>
        </div>

        {/* Live Example Banner */}
        <div
          onClick={() => handleSpeakItem('Mahmoud drinks coffee every day.', 'محمود يشرب القهوة كل يوم')}
          className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-between cursor-pointer transition-colors"
        >
          <div className="text-xs space-y-0.5">
            <span className="font-serif font-bold text-emerald-300 text-sm">
              "Mahmoud drinks coffee every day."
            </span>
            <p className="text-stone-300 text-[11px]">محمود (فاعل) + يشرب (فعل) + قهوة (مفعول)</p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-2.5 py-1.5 rounded-xl border border-emerald-800/50">
            <Volume2 className="w-3.5 h-3.5" />
            <span>نطق المثال</span>
          </div>
        </div>
      </div>
    );
  }

  if (diagramType === 'present-simple') {
    return (
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 text-white shadow-md border border-stone-700 space-y-3.5 my-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⏱️</span>
            <h5 className="text-sm font-bold text-amber-300">
              مقارنة بصرية ناطقة: قاعدة الـ (S) في المضارع البسيط
            </h5>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Singular Side */}
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">مع المفرد (نضيف S للإلزام)</span>
              <span className="text-lg">👑</span>
            </div>
            <div className="p-2 rounded-xl bg-black/40 text-xs font-mono text-stone-200">
              He / She / It / Mahmoud ➔ Verb + <span className="text-amber-400 font-bold">s</span>
            </div>
            <button
              onClick={() => handleSpeakItem('He works hard.', 'هو يعمل بجد')}
              className="w-full text-right p-2 rounded-xl bg-amber-900/30 hover:bg-amber-900/50 flex items-center justify-between text-xs transition-colors"
            >
              <div>
                <span className="font-serif font-bold text-amber-200">He works hard.</span>
                <span className="text-stone-300 text-[10px] block">أضفنا S للفعل لأن الفاعل مفرد</span>
              </div>
              <Volume2 className="w-4 h-4 text-amber-300" />
            </button>
          </div>

          {/* Plural Side */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300">مع الجمع و I (الفعل في المصدر)</span>
              <span className="text-lg">👥</span>
            </div>
            <div className="p-2 rounded-xl bg-black/40 text-xs font-mono text-stone-200">
              I / You / We / They ➔ Base Verb (بدون أي إضافات)
            </div>
            <button
              onClick={() => handleSpeakItem('They work hard.', 'هم يعملون بجد')}
              className="w-full text-right p-2 rounded-xl bg-emerald-900/30 hover:bg-emerald-900/50 flex items-center justify-between text-xs transition-colors"
            >
              <div>
                <span className="font-serif font-bold text-emerald-200">They work hard.</span>
                <span className="text-stone-300 text-[10px] block">الفعل نزل مجرد تماماً من غير S</span>
              </div>
              <Volume2 className="w-4 h-4 text-emerald-300" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (diagramType === 'prepositions') {
    return (
      <div className="p-4 sm:p-5 rounded-3xl bg-stone-900 text-white shadow-md border border-stone-800 space-y-3 my-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔺</span>
            <h5 className="text-sm font-bold text-teal-300">
              هرم حروف الجر البصري والناطق (In, On, At)
            </h5>
          </div>
        </div>

        {/* Pyramid layers */}
        <div className="space-y-2 pt-1 max-w-lg mx-auto">
          {/* Layer 1: IN (Wide) */}
          <button
            onClick={() => handleSpeakItem('In 2026, in Egypt, in the morning', 'في فترات وأماكن واسعة')}
            className="w-full p-3 rounded-2xl bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-700/60 flex items-center justify-between text-right transition-colors"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-serif text-emerald-300 bg-black/40 px-2 py-0.5 rounded-md">
                  IN (الأكبر والأشمل)
                </span>
                <span className="text-xs text-stone-300">سنوات، شهور، دول، مدن</span>
              </div>
              <p className="text-[11px] text-emerald-200 mt-1">In 2026 • In June • In Egypt • In the car</p>
            </div>
            <Volume2 className="w-4 h-4 text-emerald-300" />
          </button>

          {/* Layer 2: ON (Medium) */}
          <button
            onClick={() => handleSpeakItem('On Monday, on the street, on the table', 'على الأيام والأسطح')}
            className="w-[90%] mx-auto p-3 rounded-2xl bg-teal-900/60 hover:bg-teal-800/80 border border-teal-700/60 flex items-center justify-between text-right transition-colors"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-serif text-teal-300 bg-black/40 px-2 py-0.5 rounded-md">
                  ON (المحدد والمتوسط)
                </span>
                <span className="text-xs text-stone-300">أيام، تواريخ، شوارع، أسطح</span>
              </div>
              <p className="text-[11px] text-teal-200 mt-1">On Friday • On 5th Avenue • On the bus</p>
            </div>
            <Volume2 className="w-4 h-4 text-teal-300" />
          </button>

          {/* Layer 3: AT (Specific point) */}
          <button
            onClick={() => handleSpeakItem('At 5 PM, at home, at the door', 'في نقطة أو ساعة محددة بدقة')}
            className="w-[80%] mx-auto p-3 rounded-2xl bg-cyan-900/70 hover:bg-cyan-800/90 border border-cyan-600/70 flex items-center justify-between text-right transition-colors"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-serif text-cyan-300 bg-black/40 px-2 py-0.5 rounded-md">
                  AT (النقطة الدقيقة)
                </span>
                <span className="text-xs text-stone-300">الساعة، العنوان الدقيق، الباب</span>
              </div>
              <p className="text-[11px] text-cyan-200 mt-1">At 7:30 PM • At the door • At school</p>
            </div>
            <Volume2 className="w-4 h-4 text-cyan-300" />
          </button>
        </div>
      </div>
    );
  }

  if (diagramType === 'questions') {
    return (
      <div className="p-4 sm:p-5 rounded-3xl bg-stone-900 text-white shadow-md border border-stone-800 space-y-3 my-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">❓</span>
            <h5 className="text-sm font-bold text-amber-300">
              معادلة تركيب السؤال (WH Question Formula)
            </h5>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
          <div className="p-2.5 rounded-2xl bg-amber-950/60 border border-amber-700/50">
            <div className="text-[10px] text-amber-300 font-bold">1. أداة الاستفهام</div>
            <div className="text-sm font-serif font-bold text-white mt-1">What / Where</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-emerald-950/60 border border-emerald-700/50">
            <div className="text-[10px] text-emerald-300 font-bold">2. الفعل المساعد</div>
            <div className="text-sm font-serif font-bold text-white mt-1">do / does / is</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-teal-950/60 border border-teal-700/50">
            <div className="text-[10px] text-teal-300 font-bold">3. الفاعل</div>
            <div className="text-sm font-serif font-bold text-white mt-1">you / Mahmoud</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-cyan-950/60 border border-cyan-700/50">
            <div className="text-[10px] text-cyan-300 font-bold">4. الفعل الأساسي</div>
            <div className="text-sm font-serif font-bold text-white mt-1">study / live ?</div>
          </div>
        </div>

        <button
          onClick={() => handleSpeakItem('Where do you study English?', 'أين تدرس الإنجليزية؟')}
          className="w-full p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 flex items-center justify-between text-xs transition-colors"
        >
          <span className="font-serif font-bold text-amber-300">
            "Where do you study English?"
          </span>
          <div className="flex items-center gap-1 text-stone-300">
            <span>استمع لنطق السؤال</span>
            <Volume2 className="w-3.5 h-3.5 text-amber-300" />
          </div>
        </button>
      </div>
    );
  }

  if (diagramType === 'common-mistakes') {
    return (
      <div className="p-4 sm:p-5 rounded-3xl bg-stone-900 text-white shadow-md border border-stone-800 space-y-3 my-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <h5 className="text-sm font-bold text-rose-300">
              مقارنة سريعة: الصح والخطأ بالصوت
            </h5>
          </div>
        </div>

        <div className="space-y-2">
          {/* Comparison 1 */}
          <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="line-through text-stone-400 font-serif text-xs">
                I am agree with you
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <button
                onClick={() => handleSpeakItem('I agree with you.', 'أنا متفق معك')}
                className="flex items-center gap-1.5 text-emerald-300 font-serif font-bold text-xs bg-emerald-950/60 hover:bg-emerald-900 px-2.5 py-1 rounded-xl transition-colors"
              >
                <span>I agree with you</span>
                <Volume2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Comparison 2 */}
          <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="line-through text-stone-400 font-serif text-xs">
                I have 25 years
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <button
                onClick={() => handleSpeakItem('I am 25 years old.', 'عمري 25 سنة')}
                className="flex items-center gap-1.5 text-emerald-300 font-serif font-bold text-xs bg-emerald-950/60 hover:bg-emerald-900 px-2.5 py-1 rounded-xl transition-colors"
              >
                <span>I am 25 years old</span>
                <Volume2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
