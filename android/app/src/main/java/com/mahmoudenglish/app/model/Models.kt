package com.mahmoudenglish.app.model

enum class ThemeStyle(val labelAr: String) {
    SAGE_CREAM("مظهر المريمية والورق الهادئ"),
    WARM_PARCHMENT("وضع قراءة الورق الدافئ"),
    NIGHT_FOREST("وضع الغابة الليلية")
}

data class VocabWord(
    val id: String,
    val english: String,
    val arabic: String,
    val phonetic: String,
    val category: String,
    val exampleEn: String? = null,
    val exampleAr: String? = null,
    val imageUrl: String? = null,
    val iconEmoji: String? = null,
    val isFavorite: Boolean = false,
    val learnedCount: Int = 0,
    val createdAt: String = "2026-01-01"
)

data class DetectedObject(
    val id: String,
    val english: String,
    val arabic: String,
    val phonetic: String,
    val partOfSpeech: String = "Noun",
    val exampleSentenceEn: String? = null,
    val exampleSentenceAr: String? = null,
    val imageUrl: String? = null,
    val iconEmoji: String? = null
)

data class ExtractedTextItem(
    val original: String,
    val translated: String,
    val context: String? = null
)

data class ScanResult(
    val id: String,
    val timestamp: String,
    val imageUrl: String,
    val mainSceneEn: String,
    val mainSceneAr: String,
    val detectedObjects: List<DetectedObject>,
    val extractedText: List<ExtractedTextItem> = emptyList(),
    val learningTip: String = ""
)

data class LessonExample(
    val en: String,
    val ar: String,
    val note: String? = null
)

data class LessonSection(
    val headingAr: String,
    val explanationAr: String,
    val englishExamples: List<LessonExample> = emptyList()
)

data class Lesson(
    val id: String,
    val titleAr: String,
    val titleEn: String,
    val level: String, // مبتدئ, متوسط, متقدم
    val durationMin: Int,
    val summaryAr: String,
    val diagramType: String? = null, // sentence-structure, present-simple, prepositions, questions, common-mistakes
    val bannerImageUrl: String? = null,
    val sections: List<LessonSection>,
    val keyTips: List<String>
)

data class QuizQuestion(
    val id: String,
    val lessonId: String,
    val questionAr: String,
    val questionEn: String? = null,
    val contextEn: String? = null,
    val options: List<String>,
    val correctIndex: Int,
    val explanationAr: String,
    val type: String = "choice"
)

data class ChatMessage(
    val id: String,
    val role: String, // "user" or "assistant"
    val content: String,
    val timestamp: String
)

data class EducationalTip(
    val id: String,
    val titleAr: String,
    val category: String, // قواعد, نطق, محادثة, حفظ الكلمات
    val tipAr: String,
    val exampleEn: String? = null,
    val exampleAr: String? = null
)

data class MissingWordPuzzle(
    val template: String,
    val missingLetters: String
)

data class GameQuestion(
    val id: String,
    val word: String,
    val translation: String,
    val phonetic: String,
    val options: List<String>,
    val correctIndex: Int,
    val category: String,
    val imageUrl: String? = null,
    val iconEmoji: String? = null,
    val missingWordPuzzle: MissingWordPuzzle? = null
)

data class UserProgress(
    val streakDays: Int = 1,
    val totalScans: Int = 0,
    val wordsLearnedCount: Int = 8,
    val quizzesCompletedCount: Int = 2,
    val gameHighScore: Int = 50,
    val lastActiveDate: String = "2026-09-17"
)
