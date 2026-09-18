import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Camera,
  BookOpen,
  MessageSquare,
  GraduationCap,
  Gamepad2,
  Lightbulb,
  Smartphone,
  Sparkles,
  Volume2,
  Award,
  Flame,
  Home,
  HelpCircle,
  Phone,
  Moon,
} from 'lucide-react';
import {
  ThemeStyle,
  UserProgress,
  VocabWord,
  ScanResult,
  ChatMessage,
  QuizAttempt,
} from './types';
import { StorageService } from './utils/storage';
import { DEFAULT_VOCABULARY } from './data/defaultVocab';
import { playUiSound, speakArabic, speakEnglish, speakTabTransition } from './utils/speech';
import { useLanguage } from './context/LanguageContext';
import { usePWAInstall } from './hooks/usePWAInstall';

// Components
import { Header } from './components/Header';
import { HomeSection } from './components/HomeSection';
import { IslamicCornerSection } from './components/IslamicCornerSection';
import { LessonsSection } from './components/LessonsSection';
import { QuizzesSection } from './components/QuizzesSection';
import { InteractiveGameSection } from './components/InteractiveGameSection';
import { ContactSection } from './components/ContactSection';
import { WelcomeModal } from './components/WelcomeModal';
import { CameraTranslator } from './components/CameraTranslator';
import { SpeakingVocab } from './components/SpeakingVocab';
import { AiTutorChat } from './components/AiTutorChat';
import { LessonsAndQuizzes } from './components/LessonsAndQuizzes';
import { EducationalGame } from './components/EducationalGame';
import { ArabicTips } from './components/ArabicTips';
import { MemoryManagerModal } from './components/MemoryManagerModal';
import { AndroidProjectModal } from './components/AndroidProjectModal';
import { AndroidInstallGuideModal } from './components/AndroidInstallGuideModal';
import { ContactModal } from './components/ContactModal';
import { OfflineIndicator } from './components/OfflineIndicator';

type NavTab = 'home' | 'islamic' | 'lessons' | 'vocab' | 'quiz' | 'game' | 'chat' | 'contact' | 'camera' | 'tips';

export const App: React.FC = () => {
  const { language, t } = useLanguage();
  const { isInstallable, install } = usePWAInstall();

  // Active Tab (Default to Home on launch)
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Completed Lessons state
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>(() => {
    return StorageService.getCompletedLessons();
  });

  // Welcome Modal state (shows on first visit)
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(() => {
    try {
      const seen = localStorage.getItem('mahmoud_seen_welcome_v1');
      return seen === null;
    } catch {
      return false;
    }
  });

  // Theme State
  const [theme, setTheme] = useState<ThemeStyle>(() => {
    return (StorageService.getTheme() as ThemeStyle) || 'sage-cream';
  });

  // User Progress
  const [progress, setProgress] = useState<UserProgress>(() => {
    return StorageService.getProgress();
  });

  // Saved Words (Merge default + custom stored)
  const [savedWords, setSavedWords] = useState<VocabWord[]>(() => {
    const custom = StorageService.getSavedWords();
    const map = new Map<string, VocabWord>();
    DEFAULT_VOCABULARY.forEach((w) => map.set(w.english.toLowerCase(), w));
    custom.forEach((w) => map.set(w.english.toLowerCase(), w));
    return Array.from(map.values());
  });

  // Scans History
  const [scanHistory, setScanHistory] = useState<ScanResult[]>(() => {
    return StorageService.getScanHistory();
  });

  // Chat History
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = StorageService.getChatHistory();
    if (saved.length > 0) return saved;
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content:
          language === 'ar'
            ? 'أهلاً بك يا بطل! أنا مستر محمود علي، معلمك ومستشارك الشخصي للغة الإنجليزية ومدعوم بالذكاء الاصطناعي. اسألني أي سؤال في القواعد، النطق، تصحيح الجمل، أو لنبدأ محادثة ممتعة معاً!'
            : 'Welcome! I am Mr. Mahmoud Ali, your dedicated English tutor powered by AI. Ask me any question about grammar, pronunciation, sentence correction, or let’s practice a live conversation!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Quizzes History
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>(() => {
    return StorageService.getQuizResults();
  });

  // Modals & Display Options
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState<boolean>(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState<boolean>(false);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState<boolean>(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);

  const [isVoiceAssistActive, setIsVoiceAssistActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mahmoud_voice_assist');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Sync theme changes
  const handleThemeChange = (newTheme: ThemeStyle) => {
    setTheme(newTheme);
    StorageService.setTheme(newTheme);
  };

  // Sync voice assist
  const handleToggleVoiceAssist = () => {
    setIsVoiceAssistActive((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('mahmoud_voice_assist', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Reload state from StorageService on data restore
  const handleDataRestored = () => {
    setProgress(StorageService.getProgress());
    const custom = StorageService.getSavedWords();
    const map = new Map<string, VocabWord>();
    DEFAULT_VOCABULARY.forEach((w) => map.set(w.english.toLowerCase(), w));
    custom.forEach((w) => map.set(w.english.toLowerCase(), w));
    setSavedWords(Array.from(map.values()));
    setScanHistory(StorageService.getScanHistory());
    setChatMessages(StorageService.getChatHistory());
    setQuizHistory(StorageService.getQuizResults());
    setTheme((StorageService.getTheme() as ThemeStyle) || 'sage-cream');
  };

  // Word handlers
  const handleSaveWord = useCallback((word: VocabWord) => {
    StorageService.saveWord(word);
    setSavedWords((prev) => {
      const exists = prev.findIndex((w) => w.english.toLowerCase() === word.english.toLowerCase());
      if (exists >= 0) {
        const next = [...prev];
        next[exists] = { ...next[exists], ...word };
        return next;
      }
      return [word, ...prev];
    });
    setProgress(StorageService.getProgress());
  }, []);

  const handleDeleteWord = useCallback((wordId: string) => {
    StorageService.deleteWord(wordId);
    setSavedWords((prev) => prev.filter((w) => w.id !== wordId));
  }, []);

  // Scan handlers
  const handleAddScanResult = useCallback((scan: ScanResult) => {
    StorageService.addScanResult(scan);
    setScanHistory(StorageService.getScanHistory());
    setProgress(StorageService.getProgress());
  }, []);

  const handleDeleteScan = useCallback((id: string) => {
    StorageService.deleteScan(id);
    setScanHistory(StorageService.getScanHistory());
  }, []);

  // Lesson completion handler
  const handleMarkLessonCompleted = useCallback((lessonId: string) => {
    const updated = StorageService.markLessonCompleted(lessonId);
    setCompletedLessons(updated);
  }, []);

  // Quiz handlers
  const handleSaveQuizResult = useCallback((result: QuizAttempt) => {
    const updated = StorageService.saveQuizResult(result);
    setQuizHistory(updated);
    setProgress(StorageService.getProgress());
  }, []);

  // Game score handler
  const handleUpdateHighScore = useCallback((score: number) => {
    StorageService.updateGameHighScore(score);
    setProgress(StorageService.getProgress());
  }, []);

  // Chat handlers
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    StorageService.saveChatHistory(newMessages);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatMessages,
          userMessage: text.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('فشل الرد من الخادم');
      }

      const data = await response.json();
      const assistantText = data.reply || 'أحسنت السؤال يا صديقي! استمر في التعلم دائماً.';

      const assistantMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        content: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updated = [...newMessages, assistantMsg];
      setChatMessages(updated);
      StorageService.saveChatHistory(updated);
      playUiSound('pop');
    } catch (err) {
      // Graceful offline/fallback response
      const fallbackMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        content:
          language === 'ar'
            ? 'أهلاً بك يا بطل! يبدو أن هناك انقطاعاً مؤقتاً في الاتصال أو لم يتم تفعيل مفتاح Gemini بعد. ومع ذلك، أنا مستر محمود علي ومستعد للإجابة ومساعدتك دائماً في قاموس الكلمات والدروس التفاعلية!'
            : 'Hello! It looks like there is a temporary network issue or Gemini API key is being initialized. Rest assured, you can continue exploring the Visual Vocab, Lessons, and Quizzes seamlessly!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const updated = [...newMessages, fallbackMsg];
      setChatMessages(updated);
      StorageService.saveChatHistory(updated);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleClearChat = () => {
    StorageService.clearChatHistory();
    setChatMessages([
      {
        id: 'msg-welcome-reset',
        role: 'assistant',
        content:
          language === 'ar'
            ? 'تم بدء محادثة جديدة! أنا مستر محمود علي معك خطوة بخطوة. اسألني أي سؤال في الإنجليزية!'
            : 'New conversation started! I am Mr. Mahmoud Ali, ready to assist you step by step.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Tab definitions
  const tabs = useMemo(
    () => [
      { id: 'home' as NavTab, label: t('tabHome'), icon: Home, badge: 'Main' },
      { id: 'islamic' as NavTab, label: t('tabIslamic'), icon: Moon, badge: 'إسلاميات' },
      { id: 'lessons' as NavTab, label: t('tabLessons'), icon: BookOpen, badge: 'A1-B2' },
      { id: 'vocab' as NavTab, label: t('tabVocab'), icon: Volume2, badge: savedWords.length },
      { id: 'quiz' as NavTab, label: t('tabQuiz'), icon: HelpCircle, badge: 'Tests' },
      { id: 'game' as NavTab, label: t('tabGame'), icon: Gamepad2, badge: 'Play' },
      { id: 'chat' as NavTab, label: t('tabChat'), icon: MessageSquare, badge: language === 'ar' ? 'مستر محمود' : 'Mr. Ali' },
      { id: 'contact' as NavTab, label: t('tabContact'), icon: Phone, badge: 'Mr. Ali' },
      { id: 'camera' as NavTab, label: t('tabCamera'), icon: Camera, badge: 'Live AI' },
      { id: 'tips' as NavTab, label: t('tabTips'), icon: Lightbulb, badge: 'Tips' },
    ],
    [t, savedWords.length]
  );

  // Theme styling wrapper
  const themeClasses = useMemo(() => {
    switch (theme) {
      case 'warm-parchment':
        return {
          bg: 'bg-[#FBF8F3]',
          text: 'text-stone-900',
          navBg: 'bg-[#F4EFE6]/90 border-[#E7DFD5]',
          activeTab: 'bg-amber-800 text-white shadow-md shadow-amber-950/10',
          inactiveTab: 'text-stone-700 hover:text-stone-950 hover:bg-[#EAE3D6]',
        };
      case 'night-forest':
        return {
          bg: 'bg-[#0F172A]',
          text: 'text-slate-100',
          navBg: 'bg-slate-900/90 border-slate-800',
          activeTab: 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30',
          inactiveTab: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80',
        };
      case 'sage-cream':
      default:
        return {
          bg: 'bg-[#F8FAF8]',
          text: 'text-slate-900',
          navBg: 'bg-white/90 border-slate-200/90',
          activeTab: 'bg-teal-700 text-white shadow-md shadow-teal-950/10',
          inactiveTab: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
        };
    }
  }, [theme]);

  return (
    <div
      className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} flex flex-col font-sans transition-colors duration-300 selection:bg-teal-200 selection:text-teal-950`}
    >
      {/* App Header */}
      <Header
        theme={theme}
        onThemeChange={handleThemeChange}
        progress={progress}
        onOpenMemoryModal={() => setIsMemoryModalOpen(true)}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
        onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
        isInstallable={isInstallable}
        onInstallPwa={install}
        isPhoneFrame={isPhoneFrame}
        onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        isVoiceAssistActive={isVoiceAssistActive}
        onToggleVoiceAssist={handleToggleVoiceAssist}
      />

      {/* Main Tab Navigation Bar */}
      <nav className={`sticky top-[57px] sm:top-[61px] z-20 backdrop-blur-md border-b ${themeClasses.navBg} transition-all`}>
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-2">
          <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    speakTabTransition(tab.label, language as 'ar' | 'en');
                  }}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 active:scale-95 ${
                    isActive ? themeClasses.activeTab : themeClasses.inactiveTab
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Area (Optional Phone Bezel Simulation) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* High-Graphic Master Studio Hero Banner */}
        <div className="mb-5 sm:mb-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-4 sm:p-6 border border-indigo-500/25 shadow-xl shadow-indigo-950/20 relative overflow-hidden">
          {/* Ambient luminous glow circles */}
          <div className="absolute top-0 end-0 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 start-0 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{language === 'ar' ? 'الذكاء الاصطناعي والكاميرا الحية' : 'AI Vision & Live Camera'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                  <span>{language === 'ar' ? 'منظومة تفاعلية متكاملة' : 'Integrated Learning Hub'}</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif flex items-center gap-2">
                <span>{language === 'ar' ? 'أكاديمية مستر محمود علي للإنجليزية' : 'Mr. Mahmoud Ali English Academy'}</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {language === 'ar'
                  ? 'تعلم الإنجليزية بترجمة الكاميرا الفورية، وقاموس مصوّر ذكي، ودروس واختبارات تفاعلية، وشات ذكي متقدم مع مستر محمود علي.'
                  : 'Master English with real-time camera translation, smart visual dictionary, interactive lessons & quizzes, and AI tutor Mr. Mahmoud Ali.'}
              </p>
            </div>

            {/* Quick Stats Banner */}
            <div className="flex flex-wrap md:flex-col items-stretch gap-2.5 w-full md:w-auto shrink-0">
              <div className="flex items-center justify-between gap-3.5 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs shadow-inner">
                <div className="flex items-center gap-2 text-slate-200">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold">{savedWords.length} {language === 'ar' ? 'كلمة' : 'Words'}</span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center gap-2 text-amber-300 font-semibold">
                  <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>{progress.streakDays} {language === 'ar' ? 'يوم' : 'Days'}</span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>{progress.gameHighScore} {language === 'ar' ? 'نقطة' : 'Pts'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isPhoneFrame ? (
          <div className="max-w-[420px] mx-auto bg-black rounded-[48px] p-3.5 shadow-2xl ring-8 ring-slate-800/40 border-4 border-slate-700 my-4 transition-all">
            {/* Phone Top Speaker & Camera Notch */}
            <div className="w-full flex justify-center py-2 relative">
              <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-end px-3">
                <div className="w-2 h-2 rounded-full bg-blue-900/60 ring-1 ring-blue-500/30"></div>
              </div>
            </div>

            {/* Phone Screen Canvas */}
            <div className={`rounded-[36px] overflow-hidden ${themeClasses.bg} min-h-[720px] max-h-[820px] overflow-y-auto p-4`}>
              {activeTab === 'home' && (
                <HomeSection
                  onNavigateTab={(tab) => {
                    setActiveTab(tab as NavTab);
                    const found = tabs.find((t) => t.id === tab);
                    if (found) speakTabTransition(found.label, language as 'ar' | 'en');
                  }}
                  progress={progress}
                  totalWords={savedWords.length}
                  featuredWord={savedWords[0]}
                />
              )}
              {activeTab === 'islamic' && <IslamicCornerSection />}
              {activeTab === 'lessons' && (
                <LessonsSection
                  completedLessons={completedLessons}
                  onMarkLessonCompleted={handleMarkLessonCompleted}
                />
              )}
              {activeTab === 'vocab' && (
                <SpeakingVocab
                  allWords={savedWords}
                  onAddCustomWord={handleSaveWord}
                  onDeleteWord={handleDeleteWord}
                />
              )}
              {activeTab === 'quiz' && (
                <QuizzesSection
                  onSaveQuizResult={handleSaveQuizResult}
                  quizHistory={quizHistory}
                />
              )}
              {activeTab === 'game' && (
                <InteractiveGameSection
                  highScore={progress.gameHighScore}
                  onUpdateHighScore={handleUpdateHighScore}
                />
              )}
              {activeTab === 'chat' && (
                <AiTutorChat
                  messages={chatMessages}
                  onSendMessage={handleSendMessage}
                  onClearChat={handleClearChat}
                  isLoading={isChatLoading}
                  onSaveWord={handleSaveWord}
                />
              )}
              {activeTab === 'contact' && <ContactSection />}
              {activeTab === 'camera' && (
                <CameraTranslator
                  onSaveWord={handleSaveWord}
                  savedWords={savedWords}
                  scanHistory={scanHistory}
                  onAddScanResult={handleAddScanResult}
                  onDeleteScan={handleDeleteScan}
                />
              )}
              {activeTab === 'tips' && <ArabicTips />}
            </div>

            {/* Phone Bottom Home Bar */}
            <div className="w-full flex justify-center py-2.5">
              <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
            </div>
          </div>
        ) : (
          /* Standard Responsive Web Layout */
          <div className="transition-all">
            {activeTab === 'home' && (
              <HomeSection
                onNavigateTab={(tab) => {
                  setActiveTab(tab as NavTab);
                  const found = tabs.find((t) => t.id === tab);
                  if (found) speakTabTransition(found.label, language as 'ar' | 'en');
                }}
                progress={progress}
                totalWords={savedWords.length}
                featuredWord={savedWords[0]}
              />
            )}
            {activeTab === 'islamic' && <IslamicCornerSection />}
            {activeTab === 'lessons' && (
              <LessonsSection
                completedLessons={completedLessons}
                onMarkLessonCompleted={handleMarkLessonCompleted}
              />
            )}
            {activeTab === 'vocab' && (
              <SpeakingVocab
                allWords={savedWords}
                onAddCustomWord={handleSaveWord}
                onDeleteWord={handleDeleteWord}
              />
            )}
            {activeTab === 'quiz' && (
              <QuizzesSection
                onSaveQuizResult={handleSaveQuizResult}
                quizHistory={quizHistory}
              />
            )}
            {activeTab === 'game' && (
              <InteractiveGameSection
                highScore={progress.gameHighScore}
                onUpdateHighScore={handleUpdateHighScore}
              />
            )}
            {activeTab === 'chat' && (
              <AiTutorChat
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onClearChat={handleClearChat}
                isLoading={isChatLoading}
                onSaveWord={handleSaveWord}
              />
            )}
            {activeTab === 'contact' && <ContactSection />}
            {activeTab === 'camera' && (
              <CameraTranslator
                onSaveWord={handleSaveWord}
                savedWords={savedWords}
                scanHistory={scanHistory}
                onAddScanResult={handleAddScanResult}
                onDeleteScan={handleDeleteScan}
              />
            )}
            {activeTab === 'tips' && <ArabicTips />}
          </div>
        )}
      </main>

      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* Memory & Backup Manager Modal */}
      <MemoryManagerModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        progress={progress}
        savedWordsCount={savedWords.length}
        scanHistoryCount={scanHistory.length}
        chatCount={chatMessages.length}
        quizzesCount={quizHistory.length}
        onDataRestored={handleDataRestored}
      />

      {/* Android Kotlin Project Modal */}
      <AndroidProjectModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />

      {/* Android Install & APK Guide Modal */}
      <AndroidInstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
        isInstallable={isInstallable}
        onInstallPwa={install}
      />

      {/* Contact Us Modal (أ / محمود) */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* Welcome & Splash Modal */}
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => {
          setIsWelcomeModalOpen(false);
          try {
            localStorage.setItem('mahmoud_seen_welcome_v1', 'true');
          } catch {}
        }}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 py-5 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <span>Mahmoud English • تطبيق محمود إنجلش الناطق والمصوّر</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={() => {
                playUiSound('tap');
                setIsContactModalOpen(true);
              }}
              className="text-teal-700 hover:text-teal-900 dark:text-teal-400 font-bold underline underline-offset-2 transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'تواصل معنا (أ / محمود)' : 'Contact Us'}
            </button>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">
              {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي والكاميرا الحية' : 'Powered by AI & Live Camera'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
