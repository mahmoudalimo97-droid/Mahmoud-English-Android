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
import { useLanguage } from './context/LanguageContext';

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
  const { language, t } = useLanguage();

  // Navigation tabs
  const [currentTab, setCurrentTab] = useState<
    'camera' | 'vocab' | 'chat' | 'lessons' | 'game' | 'tips'
  >('camera');

  // Themes: Light modern (Eye-friendly), Warm Parchment (Book Read), Night Forest (Eye-safe dark)
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
      timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
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
        (language === 'ar'
          ? 'عفواً، واجهت مشكلة في معالجة طلبك حالياً، هل يمكنك إعادة صياغة السؤال؟'
          : 'Sorry, I encountered an issue processing your request. Could you rephrase your question?');

      const botMsg: ChatMessage = {
        id: 'chat-bot-' + Date.now(),
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
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
          language === 'ar'
            ? 'مرحباً بك يا بطل! يسعدني دائماً مساعدتك في التدرب على الإنجليزية. هل تود أن نراجع نطق كلمات الكاميرا أو نجري محادثة سريعة في المطعم؟'
            : 'Welcome champion! I am always glad to assist you in practicing English. Would you like to review camera words or have a quick dialogue?',
        timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
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

  // Dynamic voice assistance on tab switch
  const handleSelectTab = (tab: 'camera' | 'vocab' | 'chat' | 'lessons' | 'game' | 'tips') => {
    playUiSound('tap');
    setCurrentTab(tab);
    if (isVoiceAssistActive) {
      const tabVoiceMap: Record<string, { en: string; ar: string }> = {
        camera: { en: 'Camera Translation', ar: 'ترجمة الكاميرا' },
        vocab: { en: 'Speaking Vocabulary', ar: 'قاموس الكلمات الناطقة' },
        chat: { en: 'AI English Tutor', ar: 'شات المعلم الذكي' },
        lessons: { en: 'Lessons and Quizzes', ar: 'الدروس والاختبارات' },
        game: { en: 'Educational Game', ar: 'اللعبة التعليمية' },
        tips: { en: 'Learning Tips', ar: 'نصائح باللغة العربية' },
      };
      const info = tabVoiceMap[tab];
      if (info) {
        if (language === 'ar') {
          speakWordWithExplanation(info.en, info.ar);
        } else {
          speakWordWithExplanation(info.ar, info.en);
        }
      }
    }
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'warm-parchment':
        return 'bg-[#FAF8F5] text-slate-900';
      case 'night-forest':
        return 'bg-[#0f172a] text-slate-100';
      case 'sage-cream':
      default:
        return 'bg-gradient-to-br from-slate-50 via-blue-50/20 to-teal-50/20 text-slate-900';
    }
  };

  return (
    <div
      className={`min-h-screen ${getThemeClass()} transition-colors duration-300 flex flex-col font-sans`}
    >
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
              ? 'max-w-[440px] bg-white/95 rounded-[42px] p-4 sm:p-5 border-8 border-slate-900 shadow-2xl relative my-auto'
              : 'max-w-4xl'
          }`}
        >
          {/* Phone Frame Speaker Notch */}
          {isPhoneFrame && (
            <div className="w-28 h-4 bg-slate-900 rounded-full mx-auto mb-4 flex items-center justify-center gap-2">
              <div className="w-10 h-1.5 bg-slate-700 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
            </div>
          )}

          {/* Desktop & Tablet Top Navigation Tabs */}
          <nav className="mb-5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs hidden sm:flex items-center justify-between gap-1">
            <button
              onClick={() => handleSelectTab('camera')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'camera'
                  ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{t('tabCamera')}</span>
            </button>

            <button
              onClick={() => handleSelectTab('vocab')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'vocab'
                  ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{t('tabVocab')}</span>
            </button>

            <button
              onClick={() => handleSelectTab('chat')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'chat'
                  ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('tabChat')}</span>
            </button>

            <button
              onClick={() => handleSelectTab('lessons')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'lessons'
                  ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{t('tabLessons')}</span>
            </button>

            <button
              onClick={() => handleSelectTab('game')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'game'
                  ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>{t('tabGame')}</span>
            </button>

            <button
              onClick={() => handleSelectTab('tips')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'tips'
                  ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>{t('tabTips')}</span>
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

      {/* Mobile Native Bottom Navigation Bar (Ultra Polished Native Feel) */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 z-40 px-2 pt-1.5 pb-2.5 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <button
          onClick={() => handleSelectTab('camera')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl min-h-[48px] transition-all active:scale-95 ${
            currentTab === 'camera'
              ? 'bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-600 text-white shadow-sm shadow-indigo-500/20 font-bold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Camera className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">{t('tabCamera')}</span>
        </button>

        <button
          onClick={() => handleSelectTab('vocab')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl min-h-[48px] transition-all active:scale-95 ${
            currentTab === 'vocab'
              ? 'bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-600 text-white shadow-sm shadow-indigo-500/20 font-bold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">{t('tabVocab')}</span>
        </button>

        <button
          onClick={() => handleSelectTab('chat')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl min-h-[48px] transition-all active:scale-95 relative ${
            currentTab === 'chat'
              ? 'bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-600 text-white shadow-sm shadow-indigo-500/20 font-bold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">{t('tabChat')}</span>
          <span className="absolute 1 top-1 right-3 w-2 h-2 rounded-full bg-emerald-400 border border-white"></span>
        </button>

        <button
          onClick={() => handleSelectTab('lessons')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl min-h-[48px] transition-all active:scale-95 ${
            currentTab === 'lessons'
              ? 'bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-600 text-white shadow-sm shadow-indigo-500/20 font-bold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">{t('tabLessons')}</span>
        </button>

        <button
          onClick={() => handleSelectTab('game')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl min-h-[48px] transition-all active:scale-95 ${
            currentTab === 'game'
              ? 'bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-600 text-white shadow-sm shadow-indigo-500/20 font-bold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Gamepad2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">{t('tabGame')}</span>
        </button>

        <button
          onClick={() => handleSelectTab('tips')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl min-h-[48px] transition-all active:scale-95 ${
            currentTab === 'tips'
              ? 'bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-600 text-white shadow-sm shadow-indigo-500/20 font-bold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Lightbulb className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">{t('tabTips')}</span>
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
