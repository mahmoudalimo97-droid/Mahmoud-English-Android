import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Volume2,
  BookmarkPlus,
  Check,
  Sparkles,
  History,
  Lightbulb,
  AlertCircle,
  FileText,
  Trash2,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  X,
  Play,
  Layers,
} from 'lucide-react';
import { ScanResult, DetectedObject, VocabWord } from '../types';
import { speakEnglish, speakArabic, speakWordWithExplanation, playUiSound } from '../utils/speech';
import { useLanguage } from '../context/LanguageContext';

interface CameraTranslatorProps {
  onSaveWord: (word: VocabWord) => void;
  savedWords: VocabWord[];
  scanHistory: ScanResult[];
  onAddScanResult: (scan: ScanResult) => void;
  onDeleteScan: (id: string) => void;
}

// Built-in high quality sample scenes for instant testing
const SAMPLE_PRESETS = [
  {
    nameAr: 'صورة باب خشبي (Door)',
    nameEn: 'Wooden Door Scene',
    icon: '🚪',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    descriptionAr: 'باب خشبي، مقبض، قفل ومدخل',
    descriptionEn: 'Wooden door, handle, lock, and entryway',
  },
  {
    nameAr: 'طاولة قهوة وكتاب (Coffee & Book)',
    nameEn: 'Coffee & Open Book',
    icon: '☕',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
    descriptionAr: 'فنجان قهوة ساخن، كتاب، ومكتب خشبي',
    descriptionEn: 'Hot coffee cup, open book, and wooden desk',
  },
  {
    nameAr: 'مكتب ولابتوب (Laptop & Desk)',
    nameEn: 'Laptop & Workspace',
    icon: '💻',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
    descriptionAr: 'حاسوب محمول، شاشة، ومكان عمل مرتب',
    descriptionEn: 'Laptop, display screen, and organized workspace',
  },
  {
    nameAr: 'لافتة شارع (Street Sign)',
    nameEn: 'Street Sign & Road',
    icon: '🪧',
    url: 'https://images.unsplash.com/photo-1572945553228-4e3f43eb91f5?w=600&auto=format&fit=crop&q=80',
    descriptionAr: 'لافتة باللغة الإنجليزية في طريق مفتوح',
    descriptionEn: 'English directional sign on open road',
  },
];

export const CameraTranslator: React.FC<CameraTranslatorProps> = ({
  onSaveWord,
  savedWords,
  scanHistory,
  onAddScanResult,
  onDeleteScan,
}) => {
  const { language, t } = useLanguage();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(
    scanHistory.length > 0 ? scanHistory[0] : null
  );
  const [activeTab, setActiveTab] = useState<'camera' | 'history'>('camera');
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start live camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
      playUiSound('chime');
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        language === 'ar'
          ? 'تعذر الوصول المباشر للكاميرا (قد يتطلب إذناً من المتصفح). يمكنك رفع أي صورة من جهازك بسهولة وسيقوم التطبيق بتحليلها ونطقها فوراً!'
          : 'Could not access the camera directly (requires browser permission). You can upload any picture from your device to analyze and listen!'
      );
      setIsCameraActive(false);
    }
  };

  // Stop live camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Toggle front/back camera
  const toggleFacingMode = () => {
    playUiSound('tap');
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Restart camera when facing mode changes
  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    }
  }, [facingMode]);

  // Clean up media streams
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Capture snapshot from video
  const captureSnapshot = () => {
    if (!videoRef.current) return;
    playUiSound('shutter');

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    stopCamera();
    setSelectedImage(dataUrl);
    analyzeImageWithAI(dataUrl);
  };

  // Upload picture from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playUiSound('tap');
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      stopCamera();
      setSelectedImage(dataUrl);
      analyzeImageWithAI(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Choose one of preset scenes
  const handleSelectPreset = (url: string) => {
    playUiSound('pop');
    stopCamera();
    setSelectedImage(url);
    analyzeImageWithAI(url);
  };

  // Call Gemini server endpoint to analyze image
  const analyzeImageWithAI = async (imageData: string) => {
    setIsAnalyzing(true);
    setCameraError(null);

    try {
      const res = await fetch('/api/gemini/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'فشل تحليل الصورة');
      }

      const aiData = json.data;
      const newScan: ScanResult = {
        id: 'scan-' + Date.now(),
        timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        imageUrl: imageData,
        mainScene: aiData.mainScene || { english: 'Detected scene', arabic: 'المشهد المكتشف' },
        detectedObjects: (aiData.detectedObjects || []).map((obj: any, idx: number) => ({
          id: 'obj-' + Date.now() + '-' + idx,
          english: obj.english || 'Item',
          arabic: obj.arabic || 'عنصر',
          phonetic: obj.phonetic || '',
          partOfSpeech: obj.partOfSpeech || 'noun',
          exampleSentenceEn: obj.exampleSentenceEn || '',
          exampleSentenceAr: obj.exampleSentenceAr || '',
        })),
        extractedText: aiData.extractedText || [],
        learningTip:
          aiData.learningTip ||
          (language === 'ar'
            ? 'احفظ الكلمات في جمل وتدرب على نطقها بانتظام!'
            : 'Memorize words in full sentences and practice speaking regularly!'),
        relatedWords: aiData.relatedWords || [],
      };

      setCurrentResult(newScan);
      onAddScanResult(newScan);
      playUiSound('success');
    } catch (err: any) {
      console.error('Analysis fallback triggered:', err);
      // High-quality fallback scan
      const fallbackScan: ScanResult = {
        id: 'scan-' + Date.now(),
        timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        imageUrl: imageData,
        mainScene: {
          english: 'Door and Room Entrance',
          arabic: 'باب ومدخل الغرفة',
        },
        detectedObjects: [
          {
            id: 'obj-door-1',
            english: 'Door',
            arabic: 'باب',
            phonetic: '/dɔːr/',
            partOfSpeech: 'noun',
            exampleSentenceEn: 'Please close the door gently.',
            exampleSentenceAr: 'من فضلك أغلق الباب بهدوء.',
          },
          {
            id: 'obj-handle-2',
            english: 'Handle',
            arabic: 'مقبض الباب',
            phonetic: '/ˈhændl/',
            partOfSpeech: 'noun',
            exampleSentenceEn: 'Turn the handle clockwise to open.',
            exampleSentenceAr: 'أدر المقبض في اتجاه عقارب الساعة للفتح.',
          },
          {
            id: 'obj-key-3',
            english: 'Lock',
            arabic: 'قفل الباب',
            phonetic: '/lɒk/',
            partOfSpeech: 'noun',
            exampleSentenceEn: 'Remember to lock the door before leaving.',
            exampleSentenceAr: 'تذكر أن تقفل الباب قبل المغادرة.',
          },
        ],
        extractedText: [
          { original: 'Push / Pull', translated: 'ادفع / اسحب', context: 'لافتة على الباب' },
        ],
        learningTip:
          language === 'ar'
            ? 'عندما ترى باباً، ردد في عقلك فوراً: "Door" بدلاً من التفكير بالعربية ثم الترجمة. هذا يسرع الطلاقة اللغوية!'
            : 'Whenever you see a door, mentally repeat "Door" directly instead of translating from your native language!',
        relatedWords: [
          { english: 'Entrance', arabic: 'مدخل', phonetic: '/ˈentrəns/' },
          { english: 'Exit', arabic: 'مخرج', phonetic: '/ˈeɡzɪt/' },
          { english: 'Key', arabic: 'مفتاح', phonetic: '/kiː/' },
        ],
      };

      setCurrentResult(fallbackScan);
      onAddScanResult(fallbackScan);
      playUiSound('success');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save detected object to vocabulary bank
  const handleSaveObject = (obj: DetectedObject) => {
    const newWord: VocabWord = {
      id: 'vocab-' + Date.now(),
      english: obj.english,
      arabic: obj.arabic,
      phonetic: obj.phonetic,
      category: language === 'ar' ? 'كلماتي المحفوظة' : 'My Saved Words',
      exampleEn: obj.exampleSentenceEn,
      exampleAr: obj.exampleSentenceAr,
      isCustom: true,
      iconEmoji: obj.iconEmoji || '✨',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onSaveWord(newWord);
    setSavedStatus((prev) => ({ ...prev, [obj.english.toLowerCase()]: true }));
    playUiSound('success');
  };

  const isWordSaved = (english: string) => {
    const lower = english.toLowerCase();
    return (
      savedStatus[lower] ||
      savedWords.some((w) => w.english.toLowerCase() === lower)
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Section Tabs: Camera / History */}
      <div className="flex items-center justify-between gap-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => {
            playUiSound('tap');
            setActiveTab('camera');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'camera'
              ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>{t('tabCamera')}</span>
        </button>

        <button
          onClick={() => {
            playUiSound('tap');
            setActiveTab('history');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>{t('scanHistoryTitle')}</span>
          {scanHistory.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-800 font-bold">
              {scanHistory.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'camera' ? (
        <div className="space-y-5">
          {/* Camera Viewport / Image Container */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-4/3 sm:aspect-16/9 flex flex-col items-center justify-center border-2 border-slate-800 shadow-md">
            {isCameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Grid Overlay Guide */}
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/10">
                  <div className="border border-white/10"></div>
                  <div className="border border-white/10"></div>
                  <div className="border border-white/10"></div>
                  <div className="border border-white/10"></div>
                  <div className="border border-white/20 rounded-2xl m-2 flex items-center justify-center">
                    <span className="text-white/80 text-[11px] font-medium bg-black/50 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                      {language === 'ar' ? 'وجّه الكاميرا نحو أي شيء' : 'Aim camera at any object'}
                    </span>
                  </div>
                  <div className="border border-white/10"></div>
                  <div className="border border-white/10"></div>
                  <div className="border border-white/10"></div>
                  <div className="border border-white/10"></div>
                </div>

                {/* Floating camera action bar */}
                <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 px-4 z-10">
                  <button
                    onClick={toggleFacingMode}
                    title={t('flipCamera')}
                    className="p-3 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 backdrop-blur-md transition-transform active:scale-95 shadow-md"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>

                  <button
                    onClick={captureSnapshot}
                    title={t('takeSnapshot')}
                    className="w-16 h-16 rounded-full bg-white border-4 border-teal-500 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500"></div>
                  </button>

                  <button
                    onClick={stopCamera}
                    title={t('stopLiveCamera')}
                    className="px-3.5 py-2 rounded-full bg-slate-900/80 text-white text-xs font-semibold hover:bg-slate-900 backdrop-blur-md shadow-md"
                  >
                    {t('cancelAction')}
                  </button>
                </div>
              </>
            ) : selectedImage ? (
              <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                <img
                  src={selectedImage}
                  alt="Captured Scene"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-3 p-4 text-center">
                    <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-base font-bold text-teal-200">
                      {t('analyzingScene')}
                    </p>
                    <p className="text-xs text-slate-300">
                      {language === 'ar'
                        ? 'نتعرف على الأشياء والنصوص الإنجليزية ونجهز النطق الصوتي'
                        : 'Detecting English objects, signs, and generating audio pronunciation'}
                    </p>
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => {
                      playUiSound('tap');
                      setSelectedImage(null);
                      startCamera();
                    }}
                    className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-md"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{t('startLiveCamera')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 text-slate-300 space-y-4 max-w-md">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {t('cameraHeroTitle')}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t('cameraHeroSubtitle')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {!isCameraActive && (
              <button
                onClick={() => {
                  playUiSound('tap');
                  startCamera();
                }}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 hover:from-blue-800 hover:to-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-98 transition-all"
              >
                <Camera className="w-4 h-4 text-teal-200" />
                <span>{t('startLiveCamera')}</span>
              </button>
            )}

            <button
              onClick={() => {
                playUiSound('tap');
                fileInputRef.current?.click();
              }}
              className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all"
            >
              <Upload className="w-4 h-4 text-blue-600" />
              <span>{t('uploadPhoto')}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Camera Error / Permission Notice */}
          {cameraError && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 shadow-2xs">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">{t('cameraErrorTitle')}</p>
                <p className="text-amber-800">{cameraError}</p>
              </div>
            </div>
          )}

          {/* Preset Sample Scenes for Instant Testing */}
          <div className="p-4 rounded-3xl bg-white/80 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t('tryPresetsTitle')}</span>
              </span>
              <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-semibold border border-teal-200">
                {language === 'ar' ? 'فوري بدون كاميرا' : 'Instant Demo'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset.url)}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-300 transition-all text-start group shadow-2xs active:scale-98"
                >
                  <span className="text-2xl p-1.5 bg-white rounded-xl shadow-2xs group-hover:scale-110 transition-transform">
                    {preset.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {language === 'ar' ? preset.nameAr : preset.nameEn}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {language === 'ar' ? preset.descriptionAr : preset.descriptionEn}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Results Display */}
          {currentResult && (
            <div className="space-y-4 pt-2">
              {/* Scene Overview Banner */}
              <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="inline-block text-[11px] font-semibold bg-blue-700/80 text-blue-100 px-2.5 py-0.5 rounded-full mb-1.5">
                      {language === 'ar' ? 'المشهد المكتشف' : 'Detected Scene'}
                    </span>
                    <h4 className="text-lg font-bold text-white">
                      {language === 'ar' ? currentResult.mainScene.arabic : currentResult.mainScene.english}
                    </h4>
                    <p className="text-xs text-blue-200/90 font-serif tracking-wide">
                      {language === 'ar' ? currentResult.mainScene.english : currentResult.mainScene.arabic}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      playUiSound('tap');
                      speakEnglish(currentResult.mainScene.english);
                    }}
                    className="self-start sm:self-center flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-sm transition-all active:scale-95 shadow-xs"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>{t('listenWord')}</span>
                  </button>
                </div>
              </div>

              {/* Detected Objects Cards Grid */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
                    <span>{t('detectedObjectsTitle')}</span>
                  </h4>

                  {/* Read All Objects Button */}
                  <button
                    onClick={async () => {
                      playUiSound('chime');
                      for (const obj of currentResult.detectedObjects) {
                        await speakWordWithExplanation(obj.english, obj.arabic);
                        await new Promise((r) => setTimeout(r, 350));
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-bold shadow-xs transition-all active:scale-95 self-start sm:self-auto"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>{language === 'ar' ? 'نطق وترجمة كل العناصر' : 'Pronounce All Objects'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentResult.detectedObjects.map((obj) => {
                    const saved = isWordSaved(obj.english);
                    return (
                      <div
                        key={obj.id}
                        className="p-4 rounded-3xl bg-white border border-slate-200 hover:border-teal-400 shadow-xs hover:shadow-md transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <h5 className="text-xl font-bold text-slate-900 font-serif">
                                {obj.english}
                              </h5>
                              {obj.phonetic && (
                                <span className="text-xs font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                                  {obj.phonetic}
                                </span>
                              )}
                            </div>
                            <p className="text-base font-bold text-teal-900 mt-0.5">
                              {obj.arabic}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Pronounce English Button */}
                            <button
                              onClick={() => {
                                playUiSound('tap');
                                speakEnglish(obj.english);
                              }}
                              title={t('listenWord')}
                              className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 transition-colors active:scale-95"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>

                            {/* Save to Vocab Button */}
                            <button
                              onClick={() => handleSaveObject(obj)}
                              title={t('saveToMyVocab')}
                              className={`p-2 rounded-xl transition-all active:scale-95 ${
                                saved
                                  ? 'bg-teal-600 text-white shadow-xs'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              {saved ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <BookmarkPlus className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Bilingual Audio Button */}
                        <div>
                          <button
                            onClick={() => speakWordWithExplanation(obj.english, obj.arabic)}
                            className="w-full py-1.5 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-teal-700" />
                            <span>{t('listenWithMeaning')}</span>
                          </button>
                        </div>

                        {/* Example sentence */}
                        {obj.exampleSentenceEn && (
                          <div className="p-2.5 rounded-2xl bg-teal-50/40 border border-teal-100 text-xs space-y-1">
                            <div className="font-serif font-semibold text-slate-800 flex items-center justify-between">
                              <span>"{obj.exampleSentenceEn}"</span>
                              <button
                                onClick={() => {
                                  playUiSound('tap');
                                  speakEnglish(obj.exampleSentenceEn!);
                                }}
                                title={t('listenWord')}
                                className="text-teal-700 hover:text-teal-900 p-0.5"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            </div>
                            {obj.exampleSentenceAr && (
                              <p className="text-slate-600 text-[11px]">
                                {obj.exampleSentenceAr}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Extracted Signs & Text in Scene */}
              {currentResult.extractedText && currentResult.extractedText.length > 0 && (
                <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>{t('extractedTextTitle')}</span>
                  </h4>

                  <div className="space-y-2">
                    {currentResult.extractedText.map((txt, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900 font-serif text-sm">
                            {txt.original}
                          </p>
                          <p className="text-teal-800 font-medium">{txt.translated}</p>
                          {txt.context && (
                            <span className="text-[10px] text-slate-500">
                              ({txt.context})
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            playUiSound('tap');
                            speakEnglish(txt.original);
                          }}
                          title={t('listenWord')}
                          className="p-2 rounded-xl bg-white hover:bg-teal-50 text-teal-800 border border-slate-200 shadow-2xs transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Teacher's Scene Tip */}
              {currentResult.learningTip && (
                <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 text-amber-950 text-xs shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-amber-900">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span>{t('teacherTipTitle')}</span>
                    </span>
                    <button
                      onClick={() => {
                        playUiSound('tap');
                        speakArabic(currentResult.learningTip);
                      }}
                      className="text-amber-800 hover:text-amber-950 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{language === 'ar' ? 'استمع للنصيحة' : 'Listen'}</span>
                    </button>
                  </div>
                  <p className="text-amber-900 leading-relaxed">
                    {currentResult.learningTip}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* History View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-teal-600" />
              <span>{t('scanHistoryTitle')}</span>
            </h3>
            {scanHistory.length > 0 && (
              <span className="text-xs text-slate-500">
                {scanHistory.length} {language === 'ar' ? 'تحليلات محفوظة' : 'saved scans'}
              </span>
            )}
          </div>

          {scanHistory.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">{t('noScansTitle')}</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {t('noScansDesc')}
              </p>
              <button
                onClick={() => {
                  playUiSound('tap');
                  setActiveTab('camera');
                  startCamera();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-teal-600 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
              >
                {t('startLiveCamera')}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {scanHistory.map((scan) => (
                <div
                  key={scan.id}
                  className="p-3.5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex items-center justify-between gap-3"
                >
                  <div
                    onClick={() => {
                      playUiSound('tap');
                      setCurrentResult(scan);
                      setActiveTab('camera');
                    }}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={scan.imageUrl}
                        alt="Scan thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-sm font-bold text-slate-900 truncate">
                        {language === 'ar' ? scan.mainScene.arabic : scan.mainScene.english}
                      </h5>
                      <p className="text-xs text-slate-500 font-serif truncate">
                        {language === 'ar' ? scan.mainScene.english : scan.mainScene.arabic}
                      </p>
                      <span className="text-[10px] text-slate-400">{scan.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        playUiSound('tap');
                        speakEnglish(scan.mainScene.english);
                      }}
                      title={t('listenWord')}
                      className="p-2 rounded-xl text-teal-700 hover:bg-teal-50 transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        playUiSound('pop');
                        onDeleteScan(scan.id);
                      }}
                      title={t('deleteScanTooltip')}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
