package com.mahmoudenglish.app.data

import com.mahmoudenglish.app.model.*

object DefaultData {

    val VOCABULARY = listOf(
        VocabWord(
            id = "vocab-1",
            english = "Door",
            arabic = "باب",
            phonetic = "/dɔːr/",
            category = "المنزل والأشياء",
            exampleEn = "Please knock on the door before entering.",
            exampleAr = "من فضلك اطرق الباب قبل الدخول.",
            iconEmoji = "🚪",
            imageUrl = "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80"
        ),
        VocabWord(
            id = "vocab-2",
            english = "Window",
            arabic = "نافذة / شباك",
            phonetic = "/ˈwɪndoʊ/",
            category = "المنزل والأشياء",
            exampleEn = "Open the window to let fresh air in.",
            exampleAr = "افتح النافذة للسماح للهواء النقي بالدخول.",
            iconEmoji = "🪟",
            imageUrl = "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=600&auto=format&fit=crop&q=80"
        ),
        VocabWord(
            id = "vocab-3",
            english = "Key",
            arabic = "مفتاح",
            phonetic = "/kiː/",
            category = "المنزل والأشياء",
            exampleEn = "I lost my car key yesterday.",
            exampleAr = "فقدت مفتاح سيارتي بالأمس.",
            iconEmoji = "🔑",
            imageUrl = "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80"
        ),
        VocabWord(
            id = "vocab-4",
            english = "Table",
            arabic = "طاولة",
            phonetic = "/ˈteɪbəl/",
            category = "المنزل والأشياء",
            exampleEn = "The book is on the table.",
            exampleAr = "الكتاب موجود على الطاولة.",
            iconEmoji = "🪵",
            imageUrl = "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=600&auto=format&fit=crop&q=80"
        ),
        VocabWord(
            id = "vocab-5",
            english = "Chair",
            arabic = "كرسي",
            phonetic = "/tʃer/",
            category = "المنزل والأشياء",
            exampleEn = "Please take a seat on this chair.",
            exampleAr = "تفضل بالجلوس على هذا الكرسي.",
            iconEmoji = "🪑",
            imageUrl = "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&auto=format&fit=crop&q=80"
        ),
        VocabWord(
            id = "vocab-6",
            english = "Cup",
            arabic = "كوب / فنجان",
            phonetic = "/kʌp/",
            category = "طعام وشراب",
            exampleEn = "A hot cup of coffee in the morning.",
            exampleAr = "كوب قهوة ساخن في الصباح.",
            iconEmoji = "☕",
            imageUrl = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80"
        ),
        VocabWord(
            id = "vocab-7",
            english = "Water",
            arabic = "ماء",
            phonetic = "/ˈwɔːtər/",
            category = "طعام وشراب",
            exampleEn = "Drink plenty of water every day.",
            exampleAr = "اشرب الكثير من الماء يومياً.",
            iconEmoji = "💧",
            imageUrl = "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80"
        ),
        VocabWord(
            id = "vocab-8",
            english = "Book",
            arabic = "كتاب",
            phonetic = "/bʊk/",
            category = "العمل والدراسة",
            exampleEn = "Reading books improves vocabulary.",
            exampleAr = "قراءة الكتب تطور الحصيلة اللغوية.",
            iconEmoji = "📖",
            imageUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
        ),
        VocabWord(
            id = "vocab-9",
            english = "Pen",
            arabic = "قلم",
            phonetic = "/pɛn/",
            category = "العمل والدراسة",
            exampleEn = "May I borrow your pen for a second?",
            exampleAr = "هل يمكنني استعارة قلمك لثانية؟",
            iconEmoji = "🖊️",
            imageUrl = "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80"
        ),
        VocabWord(
            id = "vocab-10",
            english = "Car",
            arabic = "سيارة",
            phonetic = "/kɑːr/",
            category = "السفر والمواصلات",
            exampleEn = "He drives his car to work daily.",
            exampleAr = "يقود سيارته إلى العمل يومياً.",
            iconEmoji = "🚗",
            imageUrl = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80"
        )
    )

    val LESSONS = listOf(
        Lesson(
            id = "lesson-1",
            titleAr = "ترتيب الجملة الإنجليزية (Subject + Verb + Object)",
            titleEn = "English Sentence Structure",
            level = "مبتدئ",
            durationMin = 7,
            summaryAr = "الجملة الإنجليزية تختلف عن العربية: تبدأ دائماً بالفاعل ثم الفعل ثم المفعول به.",
            diagramType = "sentence-structure",
            sections = listOf(
                LessonSection(
                    headingAr = "القاعدة الذهبية (S + V + O)",
                    explanationAr = "في اللغة العربية يمكنك أن تبدأ بالفعل مثل (شرب أحمد الحليب). أما في الإنجليزية يجب دائماً ذكر الفاعل أولاً (Ahmed drank milk).",
                    englishExamples = listOf(
                        LessonExample("I drink coffee.", "أنا أشرب القهوة.", "I (فاعل) + drink (فعل) + coffee (مفعول)"),
                        LessonExample("She reads a book.", "هي تقرأ كتاباً.", "الفاعل المفرد يتبعه فعل ينتهي بـ s")
                    )
                )
            ),
            keyTips = listOf(
                "لا تبدأ الجملة أبداً بفعل إلا في صيغة الأمر (Open the door).",
                "الفاعل قد يكون اسماً صريحاً (Ali) أو ضميراً (He, She, They)."
            )
        ),
        Lesson(
            id = "lesson-2",
            titleAr = "المضارع البسيط وقاعدة الـ S مع المفرد",
            titleEn = "Present Simple & The S Rule",
            level = "مبتدئ",
            durationMin = 8,
            summaryAr = "متى نضيف حرف s إلى الفعل ومتى نتركه كما هو في الحديث عن العادات اليومية.",
            diagramType = "present-simple",
            sections = listOf(
                LessonSection(
                    headingAr = "المفرد الغائب (He / She / It)",
                    explanationAr = "إذا كان الفاعل مفرداً غائباً نضيف s أو es للفعل: He works, She lives, It rains. بينما مع الجمع والمتكلم (I, We, They, You) يبقى الفعل بالمصدر.",
                    englishExamples = listOf(
                        LessonExample("He works here.", "هو يعمل هنا.", "أضفنا S لأن الفاعل He"),
                        LessonExample("They work here.", "هم يعملون هنا.", "بدون S لأن الفاعل جمع They")
                    )
                )
            ),
            keyTips = listOf(
                "في حالة النفي نستخدم doesn't مع المفرد ونحذف الـ s من الفعل (He doesn't work).",
                "المضارع البسيط يعبر عن حقائق وعادات ثابتة وليس أفعالاً تحدث الآن."
            )
        ),
        Lesson(
            id = "lesson-3",
            titleAr = "حروف الجر المكانية (In, On, Under, Next to)",
            titleEn = "Prepositions of Place",
            level = "مبتدئ",
            durationMin = 6,
            summaryAr = "فهم مواقع الأشياء بدقة وكيف تصف أين يوجد هاتفك أو مفتاحك.",
            diagramType = "prepositions",
            sections = listOf(
                LessonSection(
                    headingAr = "الفرق بين In و On",
                    explanationAr = "نستخدم In عندما يكون الشيء بالداخل محاطاً بجدران أو صندوق. نستخدم On عندما يكون ملامساً للسطح من الأعلى.",
                    englishExamples = listOf(
                        LessonExample("The keys are in the drawer.", "المفاتيح في داخل الدرج."),
                        LessonExample("The cup is on the table.", "الكوب على سطح الطاولة.")
                    )
                )
            ),
            keyTips = listOf(
                "Under تعني تحته مباشرة: The cat is under the bed.",
                "Next to تعني بجانب الشيء."
            )
        )
    )

    val QUIZZES = listOf(
        QuizQuestion(
            id = "q-1",
            lessonId = "lesson-1",
            questionAr = "ما هو الترتيب الصحيح للجملة: (ذهب محمود إلى المتجر) بالإنجليزية؟",
            contextEn = "Mahmoud went to the store.",
            options = listOf(
                "Went Mahmoud to the store.",
                "Mahmoud went to the store.",
                "To the store Mahmoud went.",
                "Mahmoud to the store went."
            ),
            correctIndex = 1,
            explanationAr = "الجملة الإنجليزية تبدأ دائماً بالفاعل (Mahmoud) ثم الفعل (went) ثم المفعول والجار والمجرور."
        ),
        QuizQuestion(
            id = "q-2",
            lessonId = "lesson-2",
            questionAr = "اختر الفعل الصحيح: He _____ coffee every morning.",
            contextEn = "He drinks coffee every morning.",
            options = listOf(
                "drink",
                "drinks",
                "drinking",
                "dranked"
            ),
            correctIndex = 1,
            explanationAr = "لأن الفاعل هو He (مفرد غائب) نضيف s للفعل في المضارع البسيط فتصبح drinks."
        )
    )

    val TIPS = listOf(
        EducationalTip(
            id = "tip-1",
            titleAr = "سر التحدث بطلاقة: لا تترجم حرفياً في عقلك",
            category = "محادثة",
            tipAr = "عندما تفكر بالعربية ثم تترجم كلمة بكلمة، تتوقف وتتلعثم. تدرب على حفظ القوالب الجاهزة مثل (I would like to...) بدلاً من تركيب كل كلمة بمفردها.",
            exampleEn = "I would like to have a glass of water.",
            exampleAr = "أرغب في الحصول على كوب ماء."
        ),
        EducationalTip(
            id = "tip-2",
            titleAr = "نطق صوت الـ TH: اللسان بين الأسنان",
            category = "نطق",
            tipAr = "الفرق بين (Thank you) و (Sank you) هو مكان اللسان! أخرج طرف لسانك بين أسنانك الأمامية لتنطق الصوت بشكل سليم مثل حرف الثاء والذال.",
            exampleEn = "Think before you speak.",
            exampleAr = "فكر قبل أن تتكلم."
        ),
        EducationalTip(
            id = "tip-3",
            titleAr = "قاعدة التكرار المتباعد لحفظ الكلمات",
            category = "حفظ الكلمات",
            tipAr = "لا تحفظ الكلمة 50 مرة في يوم واحد وتنساها! راجعها بعد 24 ساعة، ثم بعد 3 أيام، ثم بعد أسبوع. هذا يحولها من الذاكرة قصيرة المدى إلى الذاكرة الدائمة.",
            exampleEn = "Consistency is the key to mastery.",
            exampleAr = "الاستمرارية هي سر الإتقان."
        )
    )

    val GAME_QUESTIONS = listOf(
        GameQuestion(
            id = "g-1",
            word = "Door",
            translation = "باب",
            phonetic = "/dɔːr/",
            options = listOf("نافذة", "باب", "مفتاح", "جدار"),
            correctIndex = 1,
            category = "المنزل",
            iconEmoji = "🚪",
            imageUrl = "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
            missingWordPuzzle = MissingWordPuzzle("D _ _ r", "oo")
        ),
        GameQuestion(
            id = "g-2",
            word = "Key",
            translation = "مفتاح",
            phonetic = "/kiː/",
            options = listOf("مفتاح", "قفل", "باب", "حقيبة"),
            correctIndex = 0,
            category = "المنزل",
            iconEmoji = "🔑",
            imageUrl = "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80",
            missingWordPuzzle = MissingWordPuzzle("K _ y", "e")
        ),
        GameQuestion(
            id = "g-3",
            word = "Water",
            translation = "ماء",
            phonetic = "/ˈwɔːtər/",
            options = listOf("شاي", "عصير", "ماء", "قهوة"),
            correctIndex = 2,
            category = "طعام وشراب",
            iconEmoji = "💧",
            imageUrl = "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80",
            missingWordPuzzle = MissingWordPuzzle("W a _ e r", "t")
        )
    )
}
