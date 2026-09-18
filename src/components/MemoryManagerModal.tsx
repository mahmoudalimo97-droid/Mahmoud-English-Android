import React, { useRef, useState } from 'react';
import {
  Database,
  Download,
  Upload,
  CheckCircle2,
  Trash2,
  X,
  ShieldCheck,
  HardDrive,
  RefreshCw,
  Copy,
  Check,
  Share2,
} from 'lucide-react';
import { StorageService } from '../utils/storage';
import { UserProgress, VocabWord, ScanResult, ChatMessage, QuizAttempt } from '../types';

interface MemoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  savedWordsCount: number;
  scanHistoryCount: number;
  chatCount: number;
  quizzesCount: number;
  onDataRestored: () => void;
}

export const MemoryManagerModal: React.FC<MemoryManagerModalProps> = ({
  isOpen,
  onClose,
  progress,
  savedWordsCount,
  scanHistoryCount,
  chatCount,
  quizzesCount,
  onDataRestored,
}) => {
  const [importStatus, setImportStatus] = useState<{ success?: boolean; text?: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [pastedJson, setPastedJson] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Export data as JSON file with fallback
  const handleExport = async () => {
    try {
      const jsonStr = StorageService.exportAllDataAsJSON();
      
      // Try Web Share API first if supported
      if (navigator.share && navigator.canShare && navigator.canShare({ title: 'Mahmoud English Backup' })) {
        try {
          await navigator.share({
            title: 'Mahmoud English Backup',
            text: jsonStr,
          });
          setImportStatus({ success: true, text: 'تمت مشاركة النسخة الاحتياطية بنجاح!' });
          return;
        } catch (shareErr) {
          // Fall through to download/copy if cancelled or unsupported
        }
      }

      // Standard download fallback
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Mahmoud_English_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setImportStatus({ success: true, text: 'تم بدء تنزيل النسخة الاحتياطية، ويمكنك أيضاً نسخها كبيانات نصية.' });
    } catch (err) {
      handleCopyBackup();
    }
  };

  const handleCopyBackup = () => {
    try {
      const jsonStr = StorageService.exportAllDataAsJSON();
      navigator.clipboard.writeText(jsonStr);
      setIsCopied(true);
      setImportStatus({ success: true, text: 'تم نسخ بيانات النسخة الاحتياطية إلى الحافظة بنجاح!' });
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      setImportStatus({ success: false, text: 'تعذر النسخ التلقائي، يمكنك تحميل الملف.' });
    }
  };

  const handleRestoreFromText = () => {
    if (!pastedJson.trim()) return;
    const res = StorageService.importDataFromJSON(pastedJson.trim());
    if (res.success) {
      setImportStatus({ success: true, text: res.message });
      setPastedJson('');
      setShowPasteBox(false);
      onDataRestored();
    } else {
      setImportStatus({ success: false, text: res.message });
    }
  };

  // Import data from JSON file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = StorageService.importDataFromJSON(content);
      if (res.success) {
        setImportStatus({ success: true, text: res.message });
        onDataRestored();
      } else {
        setImportStatus({ success: false, text: res.message });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                ذاكرة التطبيق والحفظ الدائم (Storage)
              </h3>
              <p className="text-xs text-stone-500">
                بياناتك محفوظة محلياً على جهازك ولن تُمسح عند إغلاق التطبيق
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1.5 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reassurance Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-950">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>نظام الذاكرة الآمن:</strong> كل صورة تترجمها، كلمة تحفظها، نتيجة اختبار، ومحادثة مع أستاذ محمود يتم تخزينها فوراً داخل ذاكرة المتصفح والهاتف المحلية المشفرة.
          </p>
        </div>

        {/* Data summary stats */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-stone-700 block">
            إحصائيات ما هو محفوظ في ذاكرة Mahmoud English:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-lg font-bold text-stone-900 block font-serif">
                {savedWordsCount}
              </span>
              <span className="text-[11px] text-stone-500">كلمات محفوظة</span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-lg font-bold text-stone-900 block font-serif">
                {scanHistoryCount}
              </span>
              <span className="text-[11px] text-stone-500">ترجمات بالكاميرا</span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-lg font-bold text-stone-900 block font-serif">
                {progress.streakDays}
              </span>
              <span className="text-[11px] text-stone-500">أيام التزام مستمر</span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-lg font-bold text-stone-900 block font-serif">
                {quizzesCount}
              </span>
              <span className="text-[11px] text-stone-500">اختبارات منجزة</span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-lg font-bold text-stone-900 block font-serif">
                {chatCount}
              </span>
              <span className="text-[11px] text-stone-500">رسائل محادثة</span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-lg font-bold text-amber-700 block font-serif">
                {progress.gameHighScore}
              </span>
              <span className="text-[11px] text-stone-500">أعلى نتيجة لعبة</span>
            </div>
          </div>
        </div>

        {/* Backup and Restore Controls */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-stone-700 block">
            النسخ الاحتياطي ونقل البيانات:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>تنزيل أو مشاركة نسخة (JSON)</span>
            </button>

            <button
              onClick={handleCopyBackup}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold transition-all active:scale-95"
            >
              {isCopied ? <Check className="w-4 h-4 text-teal-600" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'تم نسخ البيانات!' : 'نسخ كود النسخة الاحتياطية'}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all border border-stone-300"
            >
              <Upload className="w-4 h-4" />
              <span>استعادة من ملف</span>
            </button>

            <button
              onClick={() => setShowPasteBox(!showPasteBox)}
              className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium transition-all border border-stone-200"
            >
              <span>{showPasteBox ? 'إخفاء مربع اللصق' : 'أو استعادة بلصق الكود النصي'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Paste JSON text box */}
          {showPasteBox && (
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <textarea
                value={pastedJson}
                onChange={(e) => setPastedJson(e.target.value)}
                placeholder="الصق كود النسخة الاحتياطية (JSON) هنا..."
                rows={3}
                className="w-full text-xs font-mono p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-emerald-600"
              />
              <button
                onClick={handleRestoreFromText}
                disabled={!pastedJson.trim()}
                className="w-full py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white text-xs font-bold transition-all"
              >
                تطبيق واستعادة البيانات من النص
              </button>
            </div>
          )}
        </div>

        {/* Status notification */}
        {importStatus && (
          <div
            className={`p-3 rounded-2xl text-xs font-medium ${
              importStatus.success
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-rose-100 text-rose-900 border border-rose-300'
            }`}
          >
            {importStatus.text}
          </div>
        )}

        <div className="flex items-center justify-end pt-2 border-t border-stone-100">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
