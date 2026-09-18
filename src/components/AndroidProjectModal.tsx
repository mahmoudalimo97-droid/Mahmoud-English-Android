import React, { useState } from 'react';
import { X, Smartphone, Copy, Check, FileCode, Terminal, Download, ShieldCheck } from 'lucide-react';

interface AndroidProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidProjectModal: React.FC<AndroidProjectModalProps> = ({ isOpen, onClose }) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'main' | 'gradle'>('overview');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(id);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-emerald-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 flex items-center justify-center text-amber-300">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">تطبيق أندرويد الأصلي (Kotlin & Jetpack Compose)</h3>
                <span className="bg-emerald-700/80 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Android Native
                </span>
              </div>
              <p className="text-emerald-200/90 text-xs">
                تم تحويل وبرمجة التطبيق بالكامل ليطابق التصميم والميزات 100% بلغة Kotlin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-emerald-800/80 text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              selectedTab === 'overview'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            نظرة عامة والهندسة
          </button>
          <button
            onClick={() => setSelectedTab('main')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              selectedTab === 'main'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            MainActivity.kt & Screens
          </button>
          <button
            onClick={() => setSelectedTab('gradle')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              selectedTab === 'gradle'
                ? 'border-emerald-800 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            إعداد Gradle والتشغيل
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-stone-800 text-sm">
          {selectedTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-emerald-950">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>جاهز للفتح في Android Studio وتثبيته على هاتفك المحمول</span>
                </div>
                <p className="text-xs text-emerald-900/90 leading-relaxed">
                  تم إنشاء مجلد <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono text-emerald-800 font-bold">/android</code>{' '}
                  الذي يحتوي على مشروع أندرويد أصلي متكامل (Native Android Project) بمواصفات Google Jetpack Compose الحديثة، مع المحافظة على نفس الألوان والمظهر والوظائف.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                  <span className="font-bold text-emerald-900 block mb-1">🎯 الشاشات والميزات المحولة:</span>
                  <ul className="space-y-1 text-stone-600">
                    <li>• ترجمة الكاميرا مع CameraX وتحليل العناصر بالصوت.</li>
                    <li>• قاموس الكلمات الناطق مع وضع البطاقات المقلوبة.</li>
                    <li>• شات المعلم الذكي مع نطق صوتي فوري بالإنجليزية.</li>
                    <li>• مخططات القواعد البصرية والاختبارات التفاعلية.</li>
                    <li>• لعبة التحدي التعليمية (صور، استماع، حروف ناقصة).</li>
                    <li>• نصائح التحدث وإرشادات النطق السليم.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                  <span className="font-bold text-emerald-900 block mb-1">⚙️ التقنيات والمكتبات المستخدمة:</span>
                  <ul className="space-y-1 text-stone-600">
                    <li>• <strong>Kotlin 2.0+</strong> مع <strong>Jetpack Compose</strong>.</li>
                    <li>• <strong>Material 3</strong> مع دعم كامل للاتجاه العربي (RTL).</li>
                    <li>• <strong>Android TextToSpeech</strong> ثنائي اللغة (US + AR).</li>
                    <li>• <strong>Coil</strong> لعرض صور الكلمات التوضيحية بسلاسة.</li>
                    <li>• <strong>StateFlow & Coroutines</strong> لإدارة الحالة الفائقة.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'main' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-emerald-700" />
                  android/app/src/main/java/com/mahmoudenglish/app/MainActivity.kt
                </span>
                <button
                  onClick={() => copyToClipboard('android/app/src/main/java/com/mahmoudenglish/app/MainActivity.kt', 'main')}
                  className="flex items-center gap-1 text-xs text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                >
                  {copiedFile === 'main' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedFile === 'main' ? 'تم النسخ!' : 'نسخ المسار'}
                </button>
              </div>

              <div className="bg-stone-900 text-stone-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-72 leading-relaxed">
                <pre>{`class MainActivity : ComponentActivity() {
    private val viewModel: MahmoudEnglishViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            // RTL Layout for natural Arabic interface
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                MahmoudEnglishTheme(themeStyle = theme) {
                    Scaffold(
                        topBar = { AppHeader(...) },
                        bottomBar = { BottomNavBar(...) }
                    ) { padding ->
                        AnimatedContent(targetState = currentTab) { tab ->
                            when(tab) {
                                "camera" -> CameraTranslatorScreen(...)
                                "vocab" -> SpeakingVocabScreen(...)
                                "chat" -> ChatTutorScreen(...)
                                "lessons" -> LessonsAndQuizzesScreen(...)
                                "game" -> EducationalGameScreen(...)
                                "tips" -> ArabicTipsScreen(...)
                            }
                        }
                    }
                }
            }
        }
    }
}`}</pre>
              </div>
            </div>
          )}

          {selectedTab === 'gradle' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-700" />
                  خطوات البناء والتشغيل:
                </span>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-stone-700">
                  <li>افتح مجلد <code className="bg-stone-200 px-1 py-0.5 rounded font-bold">android/</code> في برنامج <strong>Android Studio</strong>.</li>
                  <li>انتظر انتهاء المزامنة التلقائية لـ Gradle.</li>
                  <li>وصل هاتفك الأندرويد أو شغّل المحاكي (Emulator).</li>
                  <li>اضغط على زر <strong>Run ▶</strong> لتثبيت التطبيق وتشغيله فوراً.</li>
                  <li>أو عبر الطرفية (Terminal):</li>
                </ol>
                <div className="bg-stone-900 text-emerald-400 p-2.5 rounded-xl font-mono text-xs">
                  cd android && ./gradlew assembleDebug
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            ملفات المشروع موجودة داخل مجلد <code className="font-mono text-stone-700 font-bold">/android</code>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
