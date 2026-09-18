export interface IslamicDua {
  id: string;
  titleAr: string;
  titleEn: string;
  arabicText: string;
  englishText: string;
  transliteration: string;
  category: 'أذكار الصباح والمساء' | 'أدعية يومية' | 'طلب العلم والسكينة';
  virtueAr: string;
}

export interface IslamicTerm {
  id: string;
  termEn: string;
  termAr: string;
  phonetic: string;
  definitionEn: string;
  definitionAr: string;
  exampleEn: string;
  exampleAr: string;
  category: 'عبادات' | 'عقيدة وأخلاق' | 'مصطلحات شائعة';
}

export interface PropheticWisdom {
  id: string;
  arabicText: string;
  englishText: string;
  topicAr: string;
  topicEn: string;
  source: string;
}

export interface IslamicQuizItem {
  id: string;
  questionAr: string;
  questionEn: string;
  options: string[];
  correctIndex: number;
  explanationAr: string;
}

export const ISLAMIC_DUAS: IslamicDua[] = [
  {
    id: 'dua-1',
    titleAr: 'دعاء طلب العلم النافع',
    titleEn: 'Dua for Seeking Knowledge',
    arabicText: 'رَبِّ زِدْنِي عِلْمًا',
    englishText: 'My Lord, increase me in knowledge.',
    transliteration: "Rabbi zidni 'ilma",
    category: 'طلب العلم والسكينة',
    virtueAr: 'آية كريمة من سورة طه (114) يُستحب تكرارها عند بداية المذاكرة وطلب العلم.',
  },
  {
    id: 'dua-2',
    titleAr: 'دعاء الاستيقاظ من النوم',
    titleEn: 'Dua Upon Waking Up',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    englishText: 'Praise is to Allah Who gave us life after having given us death, and unto Him is the resurrection.',
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushoor",
    category: 'أدعية يومية',
    virtueAr: 'شكر الله تعالى على نعمة الحياة والصحة في مطلع كل يوم جديد.',
  },
  {
    id: 'dua-3',
    titleAr: 'دعاء الخروج من المنزل',
    titleEn: 'Dua When Leaving Home',
    arabicText: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    englishText: 'In the name of Allah, I place my trust in Allah; there is no power and no strength except with Allah.',
    transliteration: "Bismillahi tawakkaltu 'alallah, wa la hawla wa la quwwata illa billah",
    category: 'أدعية يومية',
    virtueAr: 'يُقال للعبد حينها: كُفيت ووُقيت وهُديت وتنحى عنه الشيطان.',
  },
  {
    id: 'dua-4',
    titleAr: 'دعاء تفريج الهم وطلب التيسير',
    titleEn: 'Dua for Ease and Relieving Distress',
    arabicText: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    englishText: 'O Allah, there is no ease except in that which You have made easy, and You make hardship easy if You wish.',
    transliteration: "Allahumma la sahla illa ma ja'altahu sahla, wa anta taj'alul-hazna idha shi'ta sahla",
    category: 'طلب العلم والسكينة',
    virtueAr: 'يُستحب قوله عند مواجهة صعوبة في الحفظ أو الاختبارات أو الحياة.',
  },
  {
    id: 'dua-5',
    titleAr: 'الذكر الأعظم (الباقيات الصالحات)',
    titleEn: 'The Virtuous Remembrance (Dhikr)',
    arabicText: 'سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ',
    englishText: 'Glory be to Allah, and praise be to Allah, and there is no deity worthy of worship except Allah, and Allah is the Greatest.',
    transliteration: 'Subhanallah, walhamdulillah, wa la ilaha illallah, wallahu akbar',
    category: 'أذكار الصباح والمساء',
    virtueAr: 'أحب الكلام إلى الله، تغرس لقائلها نخلاً في الجنة وتثقل الميزان.',
  },
  {
    id: 'dua-6',
    titleAr: 'سيد الاستغفار',
    titleEn: 'The Master Supplication for Forgiveness',
    arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
    englishText: 'O Allah, You are my Lord; there is no deity worthy of worship except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can.',
    transliteration: "Allahumma anta Rabbi la ilaha illa Ant, khalaqtani wa ana 'abduk...",
    category: 'أذكار الصباح والمساء',
    virtueAr: 'من قالها موقناً بها حين يمسي فمات دخل الجنة، وكذلك إذا أصبح.',
  },
];

export const ISLAMIC_TERMS: IslamicTerm[] = [
  {
    id: 'term-1',
    termEn: 'The Holy Quran',
    termAr: 'القرآن الكريم',
    phonetic: '/kəˈrɑːn/',
    definitionEn: 'The sacred book of Islam, revealed by Allah to Prophet Muhammad (peace be upon him).',
    definitionAr: 'كتاب الله المعجز المنزل على سيدنا محمد صلى الله عليه وسلم هداية ونوراً للعالمين.',
    exampleEn: 'Reciting the Holy Quran brings tranquility to our hearts.',
    exampleAr: 'تلاوة القرآن الكريم تجلب الطمأنينة لقلوبنا.',
    category: 'عقيدة وأخلاق',
  },
  {
    id: 'term-2',
    termEn: 'Mosque',
    termAr: 'مسجد / جامع',
    phonetic: '/mɑːsk/',
    definitionEn: 'A place of worship for Muslims.',
    definitionAr: 'بيت من بيوت الله مخصص للصلاة والعبادة وذكر الله.',
    exampleEn: 'We attend the Friday prayer at the local mosque.',
    exampleAr: 'نحضر صلاة الجمعة في المسجد القريب.',
    category: 'عبادات',
  },
  {
    id: 'term-3',
    termEn: 'Prayer (Salah)',
    termAr: 'الصلاة',
    phonetic: '/prer/',
    definitionEn: 'The ritual worship performed five times a day, forming the second pillar of Islam.',
    definitionAr: 'الركن الثاني من أركان الإسلام، وهي صلة العبد بربه خمس مرات يومياً.',
    exampleEn: 'Performing prayer on time is the best of deeds.',
    exampleAr: 'أداء الصلاة على وقتها من أحب الأعمال إلى الله.',
    category: 'عبادات',
  },
  {
    id: 'term-4',
    termEn: 'Charity (Sadaqah & Zakat)',
    termAr: 'الصدقة والزكاة',
    phonetic: '/ˈtʃær.ə.t̬i/',
    definitionEn: 'Giving voluntarily or as an obligatory due to help the poor and needy.',
    definitionAr: 'الإنفاق في سبيل الله لمساعدة الفقراء والمحتاجين ونماء المال وطهارته.',
    exampleEn: 'A kind word and a warm smile are forms of charity.',
    exampleAr: 'الكلمة الطيبة والابتسامة الصادقة نوع من أنواع الصدقة.',
    category: 'عبادات',
  },
  {
    id: 'term-5',
    termEn: 'Fasting (Sawm)',
    termAr: 'الصيام',
    phonetic: '/ˈfæstɪŋ/',
    definitionEn: 'Abstaining from food and drink from dawn until sunset during the month of Ramadan.',
    definitionAr: 'الإمساك عن المفطرات من طلوع الفجر إلى غروب الشمس تعبداً لله وتزكية للنفس.',
    exampleEn: 'Fasting in Ramadan teaches us self-discipline and empathy.',
    exampleAr: 'الصيام في رمضان يعلمنا الانضباط والشعور بالمحتاجين.',
    category: 'عبادات',
  },
  {
    id: 'term-6',
    termEn: 'Taqwa (God-Consciousness / Piety)',
    termAr: 'التقوى ومراقبة الله',
    phonetic: '/ˈtɑːkwə/',
    definitionEn: 'Consciousness and mindfulness of Allah, avoiding disobedience and doing good.',
    definitionAr: 'مخافة الله في السر والعلن واتباع أوامره واجتناب نواهيه.',
    exampleEn: 'Taqwa is the true foundation of honorable character.',
    exampleAr: 'التقوى هي الأساس الحقيقي للأخلاق الفاضلة والمكانة الرفيعة.',
    category: 'عقيدة وأخلاق',
  },
  {
    id: 'term-7',
    termEn: 'Akhlaq (Good Morals & Ethics)',
    termAr: 'مكارم الأخلاق',
    phonetic: '/ækˈlɑːk/',
    definitionEn: 'Virtuous character, honesty, integrity, and gentle conduct toward all creations.',
    definitionAr: 'الخلق الحسن والأدب الرفيع والمعاملة الطيبة مع سائر الناس.',
    exampleEn: 'Prophet Muhammad was sent to perfect noble morals.',
    exampleAr: 'بُعث النبي صلى الله عليه وسلم ليتمم مكارم الأخلاق.',
    category: 'عقيدة وأخلاق',
  },
  {
    id: 'term-8',
    termEn: 'Bismillah (In the Name of Allah)',
    termAr: 'بسم الله الرحمن الرحيم',
    phonetic: '/bɪsˈmɪl.lə/',
    definitionEn: 'The sacred phrase Muslims say before starting any good action or meal.',
    definitionAr: 'الابتداء باسم الله طلباً للبركة والتوفيق والتيسير في كل عمل.',
    exampleEn: 'Always say Bismillah before you start eating or studying.',
    exampleAr: 'قل دائماً بسم الله قبل أن تبدأ في الأكل أو المذاكرة.',
    category: 'مصطلحات شائعة',
  },
  {
    id: 'term-9',
    termEn: 'Alhamdulillah (All Praise is due to Allah)',
    termAr: 'الحمد لله رب العالمين',
    phonetic: '/æl.hæm.duːˈlɪl.lə/',
    definitionEn: 'An expression of profound gratitude and praise to Allah in all situations.',
    definitionAr: 'عبارة الشكر والثناء على الله تعالى في السراء والضراء.',
    exampleEn: 'Say Alhamdulillah when finishing your work successfully.',
    exampleAr: 'قل الحمد لله عند إتمام عملك بنجاح.',
    category: 'مصطلحات شائعة',
  },
];

export const PROPHETIC_WISDOMS: PropheticWisdom[] = [
  {
    id: 'hadith-1',
    arabicText: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
    englishText: 'The best of people are those who are most beneficial to others.',
    topicAr: 'نفع الناس وخدمة المجتمع',
    topicEn: 'Serving Humanity',
    source: 'رواه الطبراني',
  },
  {
    id: 'hadith-2',
    arabicText: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    englishText: 'Smiling in the face of your brother is a charitable act for you.',
    topicAr: 'البشاشة ونشر المحبة',
    topicEn: 'Kindness and Smiling',
    source: 'جامع الترمذي',
  },
  {
    id: 'hadith-3',
    arabicText: 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ',
    englishText: 'A good and kind word is a form of charity.',
    topicAr: 'طيب الكلام والتهذيب',
    topicEn: 'Gentle Speech',
    source: 'صحيح البخاري ومسلم',
  },
  {
    id: 'hadith-4',
    arabicText: 'مَنْ لَا يَرْحَمُ لَا يُرْحَمُ',
    englishText: 'He who is not merciful to others will not be shown mercy.',
    topicAr: 'الرحمة والشفقة',
    topicEn: 'Mercy and Compassion',
    source: 'صحيح البخاري ومسلم',
  },
  {
    id: 'hadith-5',
    arabicText: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    englishText: 'None of you truly believes until he loves for his brother what he loves for himself.',
    topicAr: 'سلامة الصدر والأخوة',
    topicEn: 'Sincere Brotherhood',
    source: 'صحيح البخاري ومسلم',
  },
];

export const ISLAMIC_QUIZ_ITEMS: IslamicQuizItem[] = [
  {
    id: 'isl-q-1',
    questionAr: 'ما هو المعنى الإنجليزي الدقيق لعبارة "رَبِّ زِدْنِي عِلْمًا"؟',
    questionEn: 'What is the English translation of "Rabbi zidni \'ilma"?',
    options: [
      'My Lord, grant me patience.',
      'My Lord, increase me in knowledge.',
      'My Lord, forgive my mistakes.',
      'My Lord, guide my heart.',
    ],
    correctIndex: 1,
    explanationAr: 'المعنى الدقيق لـ "رب زدني علماً" هو: My Lord, increase me in knowledge.',
  },
  {
    id: 'isl-q-2',
    questionAr: 'ما هي الكلمة الإنجليزية الدالة على "مسجد" مع نطقها الصحيح؟',
    questionEn: 'Which word means "Mosque" in English?',
    options: ['Mosque (/mɑːsk/)', 'Museum (/mjuːˈziːəm/)', 'Market (/ˈmɑːrkɪt/)', 'Castle (/ˈkæsəl/)'],
    correctIndex: 0,
    explanationAr: 'المسجد بالإنجليزية هو Mosque ويُنطق /mɑːsk/.',
  },
  {
    id: 'isl-q-3',
    questionAr: 'كيف نترجم الحديث الشريف: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ"؟',
    questionEn: 'How to translate "الكلمة الطيبة صدقة" into English?',
    options: [
      'Speaking loud is useful.',
      'A good and kind word is a form of charity.',
      'Always read English books.',
      'Silence is golden.',
    ],
    correctIndex: 1,
    explanationAr: 'ترجمة الكلمة الطيبة صدقة هي: A good and kind word is a form of charity.',
  },
  {
    id: 'isl-q-4',
    questionAr: 'ما هو المصطلح الإنجليزي لـ "الصلاة" و"الصدقة" على الترتيب؟',
    questionEn: 'Select the English words for "الصلاة" and "الصدقة":',
    options: [
      'Prayer and Charity',
      'Study and Work',
      'Travel and Sleep',
      'Food and Water',
    ],
    correctIndex: 0,
    explanationAr: 'الصلاة = Prayer، والصدقة = Charity.',
  },
];
