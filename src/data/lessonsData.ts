import { Lesson } from '../types';

export const LESSONS_DATA: Lesson[] = [
  {
    id: 'lesson-1',
    titleAr: 'الهيكل الأساسي لتكوين الجملة الإنجليزية',
    titleEn: 'English Sentence Structure (S + V + O)',
    level: 'مبتدئ',
    durationMin: 7,
    diagramType: 'sentence-structure',
    bannerImageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    summaryAr: 'تعلم كيف تبني جملة إنجليزية صحيحة 100% دون أن تقع في فخ الترجمة الحرفية من العربية.',
    sections: [
      {
        headingAr: 'الترتيب الإجباري في الإنجليزية',
        explanationAr: 'في اللغة العربية يمكن أن تبدأ الجملة بالفعل (كتب أحمد الدرس) أو بالفاعل (أحمد كتب الدرس). أما في الإنجليزية، فالترتيب إجباري وثابت:\nالفاعل (Subject) ➔ ثم الفعل (Verb) ➔ ثم المفعول أو التكملة (Object).',
        englishExamples: [
          { en: 'Ahmed reads a book.', ar: 'أحمد يقرأ كتاباً. (فاعل + فعل + مفعول)' },
          { en: 'I drink coffee every morning.', ar: 'أنا أشرب القهوة كل صباح.' },
          { en: 'They speak English fluently.', ar: 'هم يتحدثون الإنجليزية بطلاقة.' },
        ],
      },
      {
        headingAr: 'الفاعل لا يُحذف أبداً في الإنجليزية!',
        explanationAr: 'في العربية نقول "أحب القهوة" ويفهم الفاعل ضمير مستتر (أنا). في الإنجليزية ممنوع قول "Love coffee" وحدها في الجمل الخبرية؛ يجب أن تقول: "I love coffee".',
        englishExamples: [
          { en: 'It is raining outside.', ar: 'إنها تمطر في الخارج. (وضعنا It كفاعل)' },
          { en: 'He is an engineer.', ar: 'هو مهندس.' },
        ],
      },
    ],
    keyTips: [
      'تذكر دائماً المعادلة: Subject + Verb + Rest of sentence',
      'لا تنسَ ضمير الفاعل أبداً (I, You, He, She, It, We, They)',
      'الصفة تأتي دائماً قبل الاسم الموصوف (A red car وليس A car red)',
    ],
  },
  {
    id: 'lesson-2',
    titleAr: 'زمن المضارع البسيط (Present Simple)',
    titleEn: 'The Present Simple Tense',
    level: 'مبتدئ',
    durationMin: 9,
    diagramType: 'present-simple',
    bannerImageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop&q=80',
    summaryAr: 'الزمن الأكثر استخداماً في الحياة اليومية للتعبير عن العادات، الحقائق، والروتين اليومي.',
    sections: [
      {
        headingAr: 'متى نستخدمه؟',
        explanationAr: 'نستخدم المضارع البسيط عندما نتحدث عن شيء يتكرر كعادة، أو حقيقة عامة، أو روتينك اليومي، وليس شيئاً تفعله في هذه اللحظة بالذات.',
        englishExamples: [
          { en: 'The sun rises in the east.', ar: 'تشرق الشمس من الشرق. (حقيقة علمية)' },
          { en: 'I wake up at 7 AM.', ar: 'أستيقظ في السابعة صباحاً. (عادة وروتين)' },
        ],
      },
      {
        headingAr: 'قاعدة الـ S مع المفرد (He, She, It)',
        explanationAr: 'إذا كان الفاعل مفرداً غائباً (He, She, It أو اسم مفرد كـ Mahmoud)، نضيف s أو es لنهاية الفعل. أما مع (I, You, We, They) يظل الفعل في شكله المصدري البسيط.',
        englishExamples: [
          { en: 'Mahmoud speaks English.', ar: 'محمود يتحدث الإنجليزية. (أضفنا S لأن محمود مفرد)' },
          { en: 'They speak English.', ar: 'هم يتحدثون الإنجليزية. (بدون S مع الجمع)' },
        ],
      },
    ],
    keyTips: [
      'مع He / She / It ➔ الفعل + s (مثل: He works / She learns)',
      'مع I / You / We / They ➔ الفعل مجرد (مثل: I work / They learn)',
      'كلمات شائعة تدل عليه: Always (دائماً)، Usually (عادةً)، Sometimes (أحياناً)',
    ],
  },
  {
    id: 'lesson-3',
    titleAr: 'حروف الجر الذهبية (In, On, At)',
    titleEn: 'Prepositions of Time & Place',
    level: 'مبتدئ',
    durationMin: 8,
    diagramType: 'prepositions',
    bannerImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    summaryAr: 'أسهل طريقة لفهم حروف الجر في الإنجليزية باستخدام هرم الاتساع والتحديد.',
    sections: [
      {
        headingAr: 'هرم حروف الجر (من العام إلى الأكثر دقة)',
        explanationAr: '• IN: للأوقات والأماكن الكبيرة والعامة (السنوات، الشهور، الدول، المدن).\n• ON: للأيام والتواريخ المحددة، والشوارع ووسائل المواصلات العامة.\n• AT: للوقت المحدد بالدقيقة (الساعة) وللنقاط المحددة بدقة (في البيت، عند الباب).',
        englishExamples: [
          { en: 'I was born in 1995.', ar: 'ولدت في عام 1995. (سنة عامة -> In)' },
          { en: 'We meet on Friday.', ar: 'نلتقي يوم الجمعة. (يوم محدد -> On)' },
          { en: 'The class starts at 8:00 AM.', ar: 'يبدأ الدرس في الساعة 8 صباحاً. (وقت محدد بالدقيقة -> At)' },
        ],
      },
    ],
    keyTips: [
      'In: فترات عامة وكبيرة (In 2026, In Egypt, In June)',
      'On: أيام وأسطح (On Monday, On the table, On the bus)',
      'At: ساعات ونقاط محددة بدقة (At 5 PM, At the door, At home)',
    ],
  },
  {
    id: 'lesson-4',
    titleAr: 'كيف تصوغ سؤالاً بالإنجليزية بثقة؟',
    titleEn: 'How to Form Questions',
    level: 'متوسط',
    durationMin: 10,
    diagramType: 'questions',
    bannerImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    summaryAr: 'معادلة صياغة الأسئلة بنوعيها: أسئلة نعم/لا وأسئلة أدوات الاستفهام (WH Questions).',
    sections: [
      {
        headingAr: 'معادلة أسئلة أدوات الاستفهام (WH Questions)',
        explanationAr: 'القاعدة الذهبية:\nأداة الاستفهام (Wh) + الفعل المساعد (Do / Does / Is / Are) + الفاعل (Subject) + الفعل الأساسي (Main Verb).',
        englishExamples: [
          { en: 'Where do you live?', ar: 'أين تعيش؟' },
          { en: 'What does Mahmoud study?', ar: 'ماذا يدرس محمود؟' },
          { en: 'Why are you learning English?', ar: 'لماذا تتعلم الإنجليزية؟' },
        ],
      },
    ],
    keyTips: [
      'لا تنسَ الفعل المساعد (Do / Does / Did / Is / Are)',
      'مع Do و Does، يرجع الفعل الأساسي لأصله ومصدره (Where does he go وليس goes)',
    ],
  },
  {
    id: 'lesson-5',
    titleAr: 'أشهر الأخطاء الشائعة للعرب في الإنجليزية',
    titleEn: 'Common Traps & Mistakes to Avoid',
    level: 'متوسط',
    durationMin: 6,
    diagramType: 'common-mistakes',
    bannerImageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    summaryAr: 'تجنب هذه الأخطاء الخمسة التي تكشف فوراً أنك تترجم ترجمة حرفية من العربية.',
    sections: [
      {
        headingAr: 'الترجمة الحرفية القاتلة',
        explanationAr: 'العربية والإنجليزية لغتان لهما منطق مختلف، وإليك المقارنات المباشرة لتفادي الأخطاء.',
        englishExamples: [
          { en: 'I agree with you.', ar: 'أنا متفق معك. (خطأ شائع: I am agree)', note: 'Agree فعل وليس صفة، فلا تضع Am قبلها!' },
          { en: 'I have 25 years.', ar: 'خطأ شائع! الصحيح: I am 25 years old.', note: 'في العمر نستخدم verb to be وليس have!' },
          { en: 'He explained the lesson to me.', ar: 'شرح لي الدرس. (خطأ شائع: He explained me the lesson)', note: 'Explain تأتي مع to me!' },
        ],
      },
    ],
    keyTips: [
      'العمر = I am 20 years old (وليس I have 20)',
      'الاتفاق = I agree (وليس I am agree)',
      'الصفة قبل الاسم = A clever boy (وليس A boy clever)',
    ],
  },
];
