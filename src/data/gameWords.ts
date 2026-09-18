export interface GameQuestion {
  id: string;
  word: string;
  translation: string;
  phonetic: string;
  audioHint?: string;
  imageUrl?: string;
  iconEmoji?: string;
  missingWordPuzzle?: {
    template: string; // e.g., "D _ _ R"
    missing: string; // "OO"
    full: string; // "DOOR"
  };
  options: string[];
  correctIndex: number;
}

export const GAME_QUESTIONS: GameQuestion[] = [
  {
    id: 'g-1',
    word: 'Door',
    translation: 'باب',
    phonetic: '/dɔːr/',
    iconEmoji: '🚪',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=80',
    missingWordPuzzle: {
      template: 'D _ _ R',
      missing: 'OO',
      full: 'DOOR',
    },
    options: ['باب', 'نافذة', 'طاولة', 'مفتاح'],
    correctIndex: 0,
  },
  {
    id: 'g-2',
    word: 'Window',
    translation: 'نافذة / شباك',
    phonetic: '/ˈwɪndoʊ/',
    iconEmoji: '🪟',
    imageUrl: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=400&auto=format&fit=crop&q=80',
    missingWordPuzzle: {
      template: 'W _ N _ O W',
      missing: 'I, D',
      full: 'WINDOW',
    },
    options: ['كرسي', 'نافذة', 'جدار', 'سرير'],
    correctIndex: 1,
  },
  {
    id: 'g-3',
    word: 'Key',
    translation: 'مفتاح',
    phonetic: '/kiː/',
    iconEmoji: '🔑',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&auto=format&fit=crop&q=80',
    missingWordPuzzle: {
      template: 'K _ Y',
      missing: 'E',
      full: 'KEY',
    },
    options: ['قفل', 'حقيبة', 'مفتاح', 'ساعة'],
    correctIndex: 2,
  },
  {
    id: 'g-4',
    word: 'Coffee',
    translation: 'قهوة',
    phonetic: '/ˈkɔːfi/',
    iconEmoji: '☕',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80',
    missingWordPuzzle: {
      template: 'C _ F F _ E',
      missing: 'O, E',
      full: 'COFFEE',
    },
    options: ['شاي', 'عصير', 'ماء', 'قهوة'],
    correctIndex: 3,
  },
  {
    id: 'g-5',
    word: 'Book',
    translation: 'كتاب',
    phonetic: '/bʊk/',
    iconEmoji: '📖',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    missingWordPuzzle: {
      template: 'B _ _ K',
      missing: 'OO',
      full: 'BOOK',
    },
    options: ['كتاب', 'دفتر', 'قلم', 'جريدة'],
    correctIndex: 0,
  },
  {
    id: 'g-6',
    word: 'Chair',
    translation: 'كرسي',
    phonetic: '/tʃer/',
    iconEmoji: '🪑',
    imageUrl: 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?w=400&auto=format&fit=crop&q=80',
    missingWordPuzzle: {
      template: 'C H _ _ R',
      missing: 'AI',
      full: 'CHAIR',
    },
    options: ['طاولة', 'كرسي', 'كنبة', 'مكتب'],
    correctIndex: 1,
  },
  {
    id: 'g-7',
    word: 'Apple',
    translation: 'تفاحة',
    phonetic: '/ˈæpəl/',
    iconEmoji: '🍎',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80',
    missingWordPuzzle: {
      template: 'A P P _ E',
      missing: 'L',
      full: 'APPLE',
    },
    options: ['موزة', 'برتقالة', 'تفاحة', 'عنب'],
    correctIndex: 2,
  },
  {
    id: 'g-8',
    word: 'Laptop',
    translation: 'حاسوب محمول',
    phonetic: '/ˈlæptɑːp/',
    iconEmoji: '💻',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&auto=format&fit=crop&q=80',
    missingWordPuzzle: {
      template: 'L _ P T _ P',
      missing: 'A, O',
      full: 'LAPTOP',
    },
    options: ['تلفاز', 'شاشة', 'طابعة', 'حاسوب محمول'],
    correctIndex: 3,
  },
  {
    id: 'g-9',
    word: 'Water',
    translation: 'ماء',
    phonetic: '/ˈwɔːtər/',
    iconEmoji: '💧',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400&auto=format&fit=crop&q=80',
    missingWordPuzzle: {
      template: 'W _ T _ R',
      missing: 'A, E',
      full: 'WATER',
    },
    options: ['ماء', 'حليب', 'زيت', 'شوربة'],
    correctIndex: 0,
  },
  {
    id: 'g-10',
    word: 'Car',
    translation: 'سيارة',
    phonetic: '/kɑːr/',
    iconEmoji: '🚗',
    imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&auto=format&fit=crop&q=80',
    missingWordPuzzle: {
      template: 'C _ R',
      missing: 'A',
      full: 'CAR',
    },
    options: ['قطار', 'سيارة', 'طائرة', 'دراجة'],
    correctIndex: 1,
  },
];
