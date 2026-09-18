import React from 'react';
import { X, Smartphone, Download, CheckCircle2, Zap, Shield, ExternalLink } from 'lucide-react';

interface AndroidInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallPwa?: () => void;
  isInstallable?: boolean;
}

export const AndroidInstallGuideModal: React.FC<AndroidInstallGuideModalProps> = ({
  isOpen,
  onClose,
  onInstallPwa,
  isInstallable,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base">تثبيت Mahmoud English على الأندرويد</h3>
              <p className="text-emerald-200/90 text-xs">طريقة تشغيل وتثبيت التطبيق على هاتفك فوراً</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Method 1: Instant 1-Click Install on Android */}
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-700" />
                <span className="font-bold text-emerald-950 text-sm">الطريقة الأولى: تثبيت فوري (WebAPK)</span>
              </div>
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                الأسرع والموصى بها
              </span>
            </div>

            <p className="text-xs text-emerald-900/90 leading-relaxed">
              عند فتح هذا الرابط في متصفح <strong>Google Chrome</strong> على أي هاتف أندرويد، يقوم النظام ببناء حزمة <strong>WebAPK</strong> أصلية وتثبيتها فوراً على جهازك، لتفتح كأي تطبيق أصلي بشاشة كاملة وبدون متصفح!
            </p>

            <div className="bg-white/80 p-3 rounded-xl space-y-2 text-xs text-stone-800">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>يظهر في قائمة تطبيقات هاتفك (App Drawer) بأيقونة التطبيق الرسمية.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>يعمل بدون شريط المتصفح وبشاشة كاملة، ويدعم الكاميرا والميكروفون بالكامل.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>يدعم العمل دون اتصال بالإنترنت (Offline) بفضل Service Worker.</span>
              </div>
            </div>

            {isInstallable && onInstallPwa ? (
              <button
                onClick={() => {
                  onInstallPwa();
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>اضغط هنا لتثبيت التطبيق على جهازك الآن 📲</span>
              </button>
            ) : (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                💡 <strong>من هاتفك الأندرويد:</strong> افتح الرابط في Chrome، ثم اضغط على زر القائمة (<strong>⋮</strong>) أعلى المتصفح، ثم اختر <strong>"تثبيت التطبيق"</strong> أو <strong>"الإضافة إلى الشاشة الرئيسية"</strong>.
              </div>
            )}
          </div>

          {/* Method 2: Native Kotlin Android Project (APK Build) */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-stone-700" />
                <span className="font-bold text-stone-900 text-sm">الطريقة الثانية: بناء ملف APK الأصلي (Kotlin)</span>
              </div>
              <span className="bg-stone-200 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Native Code
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              مشروع الأندرويد الأصلي الكامل (Kotlin + Jetpack Compose) تم بناؤه وحفظه داخل مجلد <code className="bg-stone-200 px-1 py-0.5 rounded font-mono text-stone-800">android/</code>.
            </p>

            <div className="bg-stone-900 text-stone-200 p-3 rounded-xl font-mono text-xs space-y-1">
              <p className="text-stone-400">// لبناء ملف APK في Android Studio:</p>
              <p className="text-emerald-400 font-bold">1. افتح مجلد android/ في Android Studio</p>
              <p className="text-emerald-400 font-bold">2. اضغط Run ▶ أو نفذ أمر البناء:</p>
              <p className="text-amber-300">./gradlew assembleDebug</p>
              <p className="text-stone-400 text-[10px] mt-1">// ينتج ملف APK في: app/build/outputs/apk/debug/</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            تطبيق Mahmoud English جاهز للاستخدام الفوري
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors"
          >
            حسناً، فهمت
          </button>
        </div>
      </div>
    </div>
  );
};
