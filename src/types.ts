export interface DetectedObject {
  id: string;
  english: string;
  arabic: string;
  phonetic: string;
  partOfSpeech: string;
  exampleSentenceEn: string;
  exampleSentenceAr: string;
  imageUrl?: string;
  iconEmoji?: string;
}

export interface ExtractedTextItem {
  original: string;
  translated: string;
  context?: string;
}

export interface ScanResult {
  id: string;
  timestamp: string;
  imageUrl: string;
  mainScene: {
    english: string;
    arabic: string;
  };
  detectedObjects: DetectedObject[];
  extractedText: ExtractedTextItem[];
  learningTip: string;
  relatedWords?: Array<{
    english: string;
    arabic: string;
    phonetic?: string;
  }>;
}

export interface VocabWord {
  id: string;
  english: string;
  arabic: string;
  phonetic: string;
  category: string;
  exampleEn?: string;
  exampleAr?: string;
  imageUrl?: string;
  iconEmoji?: string;
  isCustom?: boolean;
  isFavorite?: boolean;
  learnedCount?: number;
  createdAt: string;
}

export interface LessonSection {
  headingAr: string;
  explanationAr: string;
  englishExamples: Array<{
    en: string;
    ar: string;
    note?: string;
  }>;
}

export interface Lesson {
  id: string;
  titleAr: string;
  titleEn: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم';
  durationMin: number;
  summaryAr: string;
  diagramType?: 'sentence-structure' | 'present-simple' | 'prepositions' | 'questions' | 'common-mistakes';
  bannerImageUrl?: string;
  sections: LessonSection[];
  keyTips: string[];
}

export interface QuizQuestion {
  id: string;
  lessonId: string;
  questionAr: string;
  questionEn?: string;
  contextEn?: string;
  options: string[];
  correctIndex: number;
  explanationAr: string;
  type?: 'choice' | 'audio' | 'translate';
}

export interface QuizAttempt {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface EducationalTip {
  id: string;
  titleAr: string;
  category: 'قواعد' | 'نطق' | 'محادثة' | 'حفظ الكلمات' | 'أخطاء شائعة';
  tipAr: string;
  englishExample?: {
    en: string;
    ar: string;
  };
}

export type ThemeStyle = 'sage-cream' | 'warm-parchment' | 'night-forest';

export interface UserProgress {
  streakDays: number;
  totalScans: number;
  wordsLearnedCount: number;
  quizzesCompletedCount: number;
  gameHighScore: number;
  lastActiveDate: string;
}
