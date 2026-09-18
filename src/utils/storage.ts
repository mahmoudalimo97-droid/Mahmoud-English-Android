import { VocabWord, ScanResult, ChatMessage, QuizAttempt, UserProgress } from '../types';

const STORAGE_KEYS = {
  WORDS: 'mahmoud_english_words_v1',
  SCANS: 'mahmoud_english_scans_v1',
  CHAT: 'mahmoud_english_chat_v1',
  QUIZ_RESULTS: 'mahmoud_english_quiz_results_v1',
  PROGRESS: 'mahmoud_english_progress_v1',
  THEME: 'mahmoud_english_theme_v1',
  FAVORITES: 'mahmoud_english_favorites_v1',
};

// Safe JSON parser
function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
    return false;
  }
}

export const StorageService = {
  // Words
  getSavedWords(): VocabWord[] {
    return safeGet<VocabWord[]>(STORAGE_KEYS.WORDS, []);
  },

  saveWord(word: VocabWord): VocabWord[] {
    const words = this.getSavedWords();
    const existingIndex = words.findIndex((w) => w.english.toLowerCase() === word.english.toLowerCase());
    let updated: VocabWord[];
    if (existingIndex >= 0) {
      updated = [...words];
      updated[existingIndex] = { ...updated[existingIndex], ...word };
    } else {
      updated = [word, ...words];
    }
    safeSet(STORAGE_KEYS.WORDS, updated);
    this.incrementWordsCount();
    return updated;
  },

  deleteWord(wordId: string): VocabWord[] {
    const words = this.getSavedWords();
    const filtered = words.filter((w) => w.id !== wordId);
    safeSet(STORAGE_KEYS.WORDS, filtered);
    return filtered;
  },

  // Scan History
  getScanHistory(): ScanResult[] {
    return safeGet<ScanResult[]>(STORAGE_KEYS.SCANS, []);
  },

  addScanResult(scan: ScanResult): ScanResult[] {
    const current = this.getScanHistory();
    // Keep last 30 scans to prevent overflow
    const updated = [scan, ...current].slice(0, 30);
    safeSet(STORAGE_KEYS.SCANS, updated);
    this.incrementScanCount();
    return updated;
  },

  deleteScan(scanId: string): ScanResult[] {
    const current = this.getScanHistory();
    const updated = current.filter((s) => s.id !== scanId);
    safeSet(STORAGE_KEYS.SCANS, updated);
    return updated;
  },

  // Chat History
  getChatHistory(): ChatMessage[] {
    return safeGet<ChatMessage[]>(STORAGE_KEYS.CHAT, []);
  },

  saveChatHistory(messages: ChatMessage[]): void {
    // Keep last 50 messages
    safeSet(STORAGE_KEYS.CHAT, messages.slice(-50));
  },

  clearChatHistory(): void {
    safeSet(STORAGE_KEYS.CHAT, []);
  },

  // Quiz Results
  getQuizResults(): QuizAttempt[] {
    return safeGet<QuizAttempt[]>(STORAGE_KEYS.QUIZ_RESULTS, []);
  },

  saveQuizResult(result: QuizAttempt): QuizAttempt[] {
    const current = this.getQuizResults();
    const updated = [result, ...current].slice(0, 25);
    safeSet(STORAGE_KEYS.QUIZ_RESULTS, updated);
    
    // update progress
    const progress = this.getProgress();
    this.saveProgress({
      ...progress,
      quizzesCompletedCount: progress.quizzesCompletedCount + 1,
    });
    return updated;
  },

  // Progress & Stats
  getProgress(): UserProgress {
    const today = new Date().toISOString().slice(0, 10);
    const fallback: UserProgress = {
      streakDays: 1,
      totalScans: 0,
      wordsLearnedCount: 0,
      quizzesCompletedCount: 0,
      gameHighScore: 0,
      lastActiveDate: today,
    };
    const current = safeGet<UserProgress>(STORAGE_KEYS.PROGRESS, fallback);

    // Update streak if needed
    if (current.lastActiveDate !== today) {
      const last = new Date(current.lastActiveDate);
      const now = new Date(today);
      const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        current.streakDays += 1;
      } else if (diffDays > 1) {
        current.streakDays = 1;
      }
      current.lastActiveDate = today;
      safeSet(STORAGE_KEYS.PROGRESS, current);
    }
    return current;
  },

  saveProgress(progress: UserProgress): void {
    safeSet(STORAGE_KEYS.PROGRESS, progress);
  },

  incrementScanCount(): void {
    const progress = this.getProgress();
    progress.totalScans += 1;
    this.saveProgress(progress);
  },

  incrementWordsCount(): void {
    const progress = this.getProgress();
    progress.wordsLearnedCount += 1;
    this.saveProgress(progress);
  },

  updateGameHighScore(score: number): number {
    const progress = this.getProgress();
    if (score > progress.gameHighScore) {
      progress.gameHighScore = score;
      this.saveProgress(progress);
    }
    return progress.gameHighScore;
  },

  // Theme
  getTheme(): string {
    return safeGet<string>(STORAGE_KEYS.THEME, 'sage-cream');
  },

  setTheme(theme: string): void {
    safeSet(STORAGE_KEYS.THEME, theme);
  },

  // Full Backup & Restore
  exportAllDataAsJSON(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      appName: 'Mahmoud English',
      words: this.getSavedWords(),
      scans: this.getScanHistory(),
      chat: this.getChatHistory(),
      quizResults: this.getQuizResults(),
      progress: this.getProgress(),
      theme: this.getTheme(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importDataFromJSON(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (data.words && Array.isArray(data.words)) {
        safeSet(STORAGE_KEYS.WORDS, data.words);
      }
      if (data.scans && Array.isArray(data.scans)) {
        safeSet(STORAGE_KEYS.SCANS, data.scans);
      }
      if (data.chat && Array.isArray(data.chat)) {
        safeSet(STORAGE_KEYS.CHAT, data.chat);
      }
      if (data.quizResults && Array.isArray(data.quizResults)) {
        safeSet(STORAGE_KEYS.QUIZ_RESULTS, data.quizResults);
      }
      if (data.progress) {
        safeSet(STORAGE_KEYS.PROGRESS, data.progress);
      }
      return { success: true, message: 'تم استرجاع جميع بياناتك بنجاح!' };
    } catch (err: any) {
      return { success: false, message: 'الملف غير صالح أو تالف: ' + err.message };
    }
  },

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
};
