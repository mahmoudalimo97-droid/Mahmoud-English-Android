import React, { useState, useEffect } from 'react';
import {
  Camera,
  Volume2,
  MessageSquare,
  GraduationCap,
  Gamepad2,
  Lightbulb,
  Sparkles,
  Database,
  Smartphone,
} from 'lucide-react';
import { Header } from './components/Header';
import { CameraTranslator } from './components/CameraTranslator';
import { SpeakingVocab } from './components/SpeakingVocab';
import { AiTutorChat } from './components/AiTutorChat';
import { LessonsAndQuizzes } from './components/LessonsAndQuizzes';
import { EducationalGame } from './components/EducationalGame';
import { ArabicTips } from './components/ArabicTips';
import { MemoryManagerModal } from './components/MemoryManagerModal';
import { AndroidProjectModal } from './components/AndroidProjectModal';
import { AndroidInstallGuideModal } from './components/AndroidInstallGuideModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { usePWAInstall } from './hooks/usePWAInstall';

import {
  ThemeStyle,
  VocabWord,
  ScanResult,
  ChatMessage,
  QuizAttempt,
  UserProgress,
} from './types';
import { StorageService } from './utils/storage';
import { DEFAULT_VOCABULARY } from './data/defaultVocab';
import { playUiSound, speakWordWithExplanation } from './utils/speech';

export default function App() {
  // Navigation tabs
  const [currentTab, setCurrentTab] = useState<
    'camera' | 'vocab' | 'chat' | 'lessons' | 'game' | 'tips'
  >('camera');

  // Themes: Sage Cream (Eye-friendly), Warm Parchment (Book Read), Night Forest (Eye-safe dark)
  const [theme, setTheme] = useState<ThemeStyle>(
    (StorageService.getTheme() as ThemeStyle) || 'sage-cream'
  );

  // Phone frame toggle for desktop view
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);

  // Voice assistance active state (speaking icons and actions)
  const [isVoiceAssistActive, setIsVoiceAssistActive] = useState<boolean>(true);

  // Memory & Backup Modal
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState<boolean>(false);
  // Android Project Native Modal
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState<boolean>(false);
  // Android Install Guide Modal
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState<boolean>(false);

  // PWA WebAPK Install hook
  const { isInstallable, install } = usePWAInstall();

  // Core Persistent State
  const [savedWords, setSavedWords] = useState<VocabWord[]>([]);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [quizResults, setQuizResults] = useState<QuizAttempt[]>([]);
  const [progress, setProgress] = useState<UserProgress>(StorageService.getProgress());
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Load persistent data from storage on mount
  const refreshStorageData = () => {
    const storedCustomWords = StorageService.getSavedWords();
    // Merge default rich vocabulary with user-custom/saved words
    const mergedWords = [...storedCustomWords];
    DEFAULT_VOCABULARY.forEach((defaultWord) => {
      if (!mergedWords.some((w) => w.english.toLowerCase() === defaultWord.english.toLowerCase())) {
        mergedWords.push(defaultWord);
      }
    });

    setSavedWords(mergedWords);
    setScanHistory(StorageService.getScanHistory());
    setChatMessages(StorageService.getChatHistory());
    setQuizResults(StorageService.getQuizResults());
    setProgress(StorageService.getProgress());
  };

  useEffect(() => {
    refreshStorageData();
  }, []);

  const handleThemeChange = (newTheme: ThemeStyle) => {
    setTheme(newTheme);
    StorageService.setTheme(newTheme);
  };

  // Add / Save Word
  const handleSaveWord = (word: VocabWord) => {
    StorageService.saveWord(word);
    refreshStorageData();
  };

  const handleDeleteWord = (id: string) => {
    StorageService.deleteWord(id);
    refreshStorageData();
  };

  // Add Scan Result
  const handleAddScanResult = (scan: ScanResult) => {
    StorageService.addScanResult(scan);
    refreshStorageData();
  };

  const handleDeleteScan = (id: string) => {
    StorageService.deleteScan(id);
    refreshStorageData();
  };

  // Chat message send
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: 'chat-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    StorageService.saveChatHistory(newHistory);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.slice(-6),
          userMessage: text,
        }),
      });

      const data = await res.json();
      const replyContent =
        data.reply ||
        'عفواً، واجهت مشكلة في معالجة طلبك حالياً، هل يمكنك إعادة صياغة السؤال؟';

      const botMsg: ChatMessage = {
        id: 'chat-bot-' + Date.now(),
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };

      const updatedHistory = [...newHistory, botMsg];
      setChatMessages(updatedHistory);
      StorageService.saveChatHistory(updatedHistory);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: 'chat-err-' + Date.now(),
        role: 'assistant',
        content:
          'مرحباً بك يا بطل! يسعدني دائماً مساعدتك في التدرب على الإنجليزية. هل تود أن نراجع نطق كلمات الكاميرا أو نجري محادثة سريعة في المطعم؟',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };
      const updatedHistory = [...newHistory, fallbackMsg];
      setChatMessages(updatedHistory);
      StorageService.saveChatHistory(updatedHistory);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleClearChat = () => {
    StorageService.clearChatHistory();
    setChatMessages([]);
  };

  // Save Quiz Result
  const handleSaveQuizResult = (result: QuizAttempt) => {
    StorageService.saveQuizResult(result);
    refreshStorageData();
  };

  // Update Game High Score
  const handleUpdateHighScore = (score: number) => {
    const updated = StorageService.updateGameHighScore(score);
    setProgress((prev) => ({ ...prev, gameHighScore: updated }));
  };

  // Eye-friendly dynamic background and color tone classes
  const handleSelectTab = (tab: 'camera' | 'vocab' | 'chat' | 'lessons' | 'game' | 'tips') => {
    playUiSound('tap');
    setCurrentTab(tab);
    if (isVoiceAssistActive) {
      const tabVoiceMap: Record<string, { en: string; ar: string }> = {
        camera: { en: 'Camera Translation', ar: 'ترجمة الكاميرا وتحليل الصور' },
        vocab: { en: 'Speaking Vocabulary', ar: 'قاموس الكلمات المصور والناطق' },
        chat: { en: 'AI English Tutor', ar: 'شات المعلم الذكي' },
        lessons: { en: 'Lessons and Quizzes', ar: 'الدروس التفاعلية والاختبارات' },
        game: { en: 'Educational Challenge', ar: 'لعبة التحدي التعليمية' },
        tips: { en: 'Learning Tips', ar: 'نصائح وأسرار التحدث' },
      };
      const info = tabVoiceMap[tab];
      if (info) {
        speakWordWithExplanation(info.en, info.ar);
      }
    }
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'warm-parchment':
        return 'bg-[#F9F7F1] text-[#2C2416]';
      case 'night-forest':
        return 'bg-[#12231A] text-[#E7EFE9]';
      case 'sage-cream':
      default:
        return 'bg-[#F6F7F3] text-[#1E2822]';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClass()} transition-colors duration-300 flex flex-col font-sans`}>
      {/* Header Bar */}
      <Header
        theme={theme}
        onThemeChange={handleThemeChange}
        progress={progress}
        onOpenMemoryModal={() => setIsMemoryModalOpen(true)}
        onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
        onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
        isInstallable={isInstallable}
        onInstallPwa={install}
        isPhoneFrame={isPhoneFrame}
        onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        isVoiceAssistActive={isVoiceAssistActive}
        onToggleVoiceAssist={() => setIsVoiceAssistActive(!isVoiceAssistActive)}
      />

      {/* Main Container / Phone Mockup Wrapper */}
      <main className="flex-1 w-full flex justify-center py-4 px-2 sm:px-4">
        <div
          className={`w-full transition-all duration-300 ${
            isPhoneFrame
              ? 'max-w-[440px] bg-stone-50/50 rounded-[42px] p-4 sm:p-5 border-8 border-stone-800 shadow-2xl relative my-auto'
              : 'max-w-4xl'
          }`}
        >
          {/* Phone Frame Speaker Notch (Visual authenticity when phone frame is active) */}
          {isPhoneFrame && (
            <div className="w-28 h-4 bg-stone-800 rounded-full mx-auto mb-4 flex items-center justify-center gap-2">
              <div className="w-10 h-1.5 bg-stone-700 rounded-full"></div>
              <div className="w-2 h-2 bg-stone-700 rounded-full"></div>
            </div>
          )}

          {/* Desktop & Tablet Top Navigation Tabs */}
          <nav className="mb-5 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-stone-200 shadow-2xs hidden sm:flex items-center justify-between gap-1">
            <button
              onClick={() => handleSelectTab('camera')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'camera'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>ترجمة الكاميرا</span>
            </button>

            <button
              onClick={() => handleSelectTab('vocab')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'vocab'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>كلمات ناطقة</span>
            </button>

            <button
              onClick={() => handleSelectTab('chat')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'chat'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>شات المعلم الذكي</span>
            </button>

            <button
              onClick={() => handleSelectTab('lessons')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'lessons'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>دروس واختبارات</span>
            </button>

            <button
              onClick={() => handleSelectTab('game')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'game'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>لعبة تعليمية</span>
            </button>

            <button
              onClick={() => handleSelectTab('tips')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'tips'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>نصائح بالعربي</span>
            </button>
          </nav>

          {/* Active Tab View */}
          <div className="pb-20 sm:pb-8">
            {currentTab === 'camera' && (
              <CameraTranslator
                onSaveWord={handleSaveWord}
                savedWords={savedWords}
                scanHistory={scanHistory}
                onAddScanResult={handleAddScanResult}
                onDeleteScan={handleDeleteScan}
              />
            )}

            {currentTab === 'vocab' && (
              <SpeakingVocab
                allWords={savedWords}
                onAddCustomWord={handleSaveWord}
                onDeleteWord={handleDeleteWord}
              />
            )}

            {currentTab === 'chat' && (
              <AiTutorChat
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onClearChat={handleClearChat}
                isLoading={isChatLoading}
                onSaveWord={handleSaveWord}
              />
            )}

            {currentTab === 'lessons' && (
              <LessonsAndQuizzes
                onSaveQuizResult={handleSaveQuizResult}
                quizHistory={quizResults}
              />
            )}

            {currentTab === 'game' && (
              <EducationalGame
                highScore={progress.gameHighScore}
                onUpdateHighScore={handleUpdateHighScore}
              />
            )}

            {currentTab === 'tips' && <ArabicTips />}
          </div>
        </div>
      </main>

      {/* Mobile Native Bottom Navigation Bar (Always convenient on phone) */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-stone-200 z-40 py-1 px-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => handleSelectTab('camera')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
            currentTab === 'camera' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <Camera className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">الكاميرا</span>
        </button>

        <button
          onClick={() => handleSelectTab('vocab')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
            currentTab === 'vocab' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">الكلمات</span>
        </button>

        <button
          onClick={() => handleSelectTab('chat')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
            currentTab === 'chat' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">المعلم</span>
        </button>

        <button
          onClick={() => handleSelectTab('lessons')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
            currentTab === 'lessons' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">الاختبار</span>
        </button>

        <button
          onClick={() => handleSelectTab('game')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
            currentTab === 'game' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <Gamepad2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">اللعبة</span>
        </button>

        <button
          onClick={() => handleSelectTab('tips')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
            currentTab === 'tips' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <Lightbulb className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">نصائح</span>
        </button>
      </nav>

      {/* Memory Manager & Data Persistence Modal */}
      <MemoryManagerModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        progress={progress}
        savedWordsCount={savedWords.length}
        scanHistoryCount={scanHistory.length}
        chatCount={chatMessages.length}
        quizzesCount={quizResults.length}
        onDataRestored={() => refreshStorageData()}
      />

      {/* Android Native Project Modal */}
      <AndroidProjectModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />

      {/* Android Install Guide & WebAPK Launcher */}
      <AndroidInstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
        onInstallPwa={install}
        isInstallable={isInstallable}
      />

      {/* Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
