package com.mahmoudenglish.app.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.mahmoudenglish.app.data.DefaultData
import com.mahmoudenglish.app.model.*
import com.mahmoudenglish.app.utils.TextToSpeechHelper
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

class MahmoudEnglishViewModel(application: Application) : AndroidViewModel(application) {

    val tts = TextToSpeechHelper(application)

    private val _currentTab = MutableStateFlow("camera")
    val currentTab: StateFlow<String> = _currentTab.asStateFlow()

    private val _theme = MutableStateFlow(ThemeStyle.SAGE_CREAM)
    val theme: StateFlow<ThemeStyle> = _theme.asStateFlow()

    private val _isVoiceAssistActive = MutableStateFlow(true)
    val isVoiceAssistActive: StateFlow<Boolean> = _isVoiceAssistActive.asStateFlow()

    private val _progress = MutableStateFlow(UserProgress())
    val progress: StateFlow<UserProgress> = _progress.asStateFlow()

    private val _vocabulary = MutableStateFlow<List<VocabWord>>(DefaultData.VOCABULARY)
    val vocabulary: StateFlow<List<VocabWord>> = _vocabulary.asStateFlow()

    private val _currentScan = MutableStateFlow<ScanResult?>(null)
    val currentScan: StateFlow<ScanResult?> = _currentScan.asStateFlow()

    private val _isScanning = MutableStateFlow(false)
    val isScanning: StateFlow<Boolean> = _isScanning.asStateFlow()

    private val _chatMessages = MutableStateFlow<List<ChatMessage>>(
        listOf(
            ChatMessage(
                id = "msg-welcome",
                role = "assistant",
                content = "مرحباً يا بطل! أنا معلمك الذكي لممارسة اللغة الإنجليزية. اكتب لي أو تحدث معي بالإنجليزية وسأقوم بالرد وتصحيح الأخطاء ومساعدتك في النطق!",
                timestamp = "الآن"
            )
        )
    )
    val chatMessages: StateFlow<List<ChatMessage>> = _chatMessages.asStateFlow()

    private val _isChatLoading = MutableStateFlow(false)
    val isChatLoading: StateFlow<Boolean> = _isChatLoading.asStateFlow()

    private val _isMemoryModalOpen = MutableStateFlow(false)
    val isMemoryModalOpen: StateFlow<Boolean> = _isMemoryModalOpen.asStateFlow()

    fun selectTab(tab: String) {
        _currentTab.value = tab
        tts.playUiSound("tap")
        if (_isVoiceAssistActive.value) {
            when (tab) {
                "camera" -> tts.speakWordWithExplanation("Camera Translation", "ترجمة الكاميرا وتحليل الصور")
                "vocab" -> tts.speakWordWithExplanation("Speaking Vocabulary", "قاموس الكلمات المصور والناطق")
                "chat" -> tts.speakWordWithExplanation("AI English Tutor", "شات المعلم الذكي")
                "lessons" -> tts.speakWordWithExplanation("Lessons and Quizzes", "الدروس والاختبارات التفاعلية")
                "game" -> tts.speakWordWithExplanation("Educational Game", "لعبة التحدي التعليمية")
                "tips" -> tts.speakWordWithExplanation("Speaking Tips", "نصائح وأسرار التحدث")
            }
        }
    }

    fun toggleVoiceAssist() {
        tts.playUiSound("tap")
        _isVoiceAssistActive.value = !_isVoiceAssistActive.value
        if (_isVoiceAssistActive.value) {
            tts.speakArabic("تم تفعيل الوضع الصوتي الناطق")
        }
    }

    fun setTheme(themeStyle: ThemeStyle) {
        tts.playUiSound("tap")
        _theme.value = themeStyle
    }

    fun setMemoryModalOpen(isOpen: Boolean) {
        tts.playUiSound("tap")
        _isMemoryModalOpen.value = isOpen
    }

    fun addWordToVocab(word: VocabWord) {
        if (_vocabulary.value.none { it.english.equals(word.english, ignoreCase = true) }) {
            _vocabulary.value = listOf(word) + _vocabulary.value
            _progress.value = _progress.value.copy(
                wordsLearnedCount = _progress.value.wordsLearnedCount + 1
            )
            tts.playUiSound("success")
        }
    }

    fun toggleFavoriteWord(id: String) {
        tts.playUiSound("tap")
        _vocabulary.value = _vocabulary.value.map {
            if (it.id == id) it.copy(isFavorite = !it.isFavorite) else it
        }
    }

    fun deleteWord(id: String) {
        tts.playUiSound("pop")
        _vocabulary.value = _vocabulary.value.filter { it.id != id }
    }

    fun updateHighScore(newScore: Int) {
        if (newScore > _progress.value.gameHighScore) {
            _progress.value = _progress.value.copy(gameHighScore = newScore)
        }
    }

    fun simulateCameraCapture() {
        _isScanning.value = true
        tts.playUiSound("tap")
        viewModelScope.launch {
            kotlinx.coroutines.delay(1200)
            val mockResult = ScanResult(
                id = UUID.randomUUID().toString(),
                timestamp = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date()),
                imageUrl = "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
                mainSceneEn = "Room with Door and Table",
                mainSceneAr = "غرفة تحتوي على باب وطاولة ونافذة",
                detectedObjects = listOf(
                    DetectedObject(
                        id = "det-1",
                        english = "Door",
                        arabic = "باب",
                        phonetic = "/dɔːr/",
                        partOfSpeech = "Noun",
                        exampleSentenceEn = "The wooden door is closed.",
                        exampleSentenceAr = "الباب الخشبي مغلق.",
                        iconEmoji = "🚪",
                        imageUrl = "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80"
                    ),
                    DetectedObject(
                        id = "det-2",
                        english = "Key",
                        arabic = "مفتاح",
                        phonetic = "/kiː/",
                        partOfSpeech = "Noun",
                        exampleSentenceEn = "Here is the key to the door.",
                        exampleSentenceAr = "إليك مفتاح الباب.",
                        iconEmoji = "🔑",
                        imageUrl = "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80"
                    )
                ),
                learningTip = "لاحظ أن كلمة Door تأتي مع حرف الجر at عندما نقول (He is at the door) أي عند الباب."
            )
            _currentScan.value = mockResult
            _isScanning.value = false
            _progress.value = _progress.value.copy(totalScans = _progress.value.totalScans + 1)
            tts.playUiSound("success")
            tts.speakWordWithExplanation(mockResult.detectedObjects.first().english, mockResult.detectedObjects.first().arabic)
        }
    }

    fun sendChatMessage(userText: String) {
        if (userText.isBlank()) return
        val userMsg = ChatMessage(
            id = UUID.randomUUID().toString(),
            role = "user",
            content = userText,
            timestamp = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date())
        )
        _chatMessages.value = _chatMessages.value + userMsg
        _isChatLoading.value = true
        tts.playUiSound("tap")

        viewModelScope.launch {
            kotlinx.coroutines.delay(1000)
            val lower = userText.lowercase(Locale.ROOT)
            val replyText = when {
                lower.contains("coffee") || lower.contains("قهوة") || lower.contains("طلب") ->
                    "أهلاً بك يا بطل! معك مستر محمود علي ☕✨\n\nلطلب القهوة أو أي وجبة بالإنجليزية بذوق كالمتحدثين الأصليين:\n• 'Could I please have a medium latte?' (كود آي بليز هاف أ ميديام لاتيه)\n• 'I'd like a black coffee to go, please.'\n\n💡 سر مستر محمود: ابتعد عن 'I want' لأنها تبدو كأمر جاف، واستخدم دائماً 'Could I have' أو 'I'd like'!"

                lower.contains("agree") || lower.contains("صحح") || lower.contains("correct") ->
                    "أهلاً بك يا صديقي! مستر محمود علي يراجع معك الجملة 🌟\n\n❌ الخطأ الشائع: 'I am agree with you'\n✅ الصحيح المتقن: 'I agree with you'\n\n🔍 سر القاعدة: Agree فعل (Verb) وليس صفة، فلا يأتي قبله (am/is/are) تماماً مثل 'I understand'. ممتاز!"

                lower.contains("since") || lower.contains("for") || lower.contains("منذ") ->
                    "يا هلا يا فنان! مستر محمود يشرح لك الفرق:\n\n1. Since (منذ): نستخدمها مع نقطة بداية محددة (Since 2018 / Since Monday).\n2. For (لمدة): نستخدمها مع فترة محسوبة بالكامل (For 3 years / For 2 hours).\n\n🎯 تحدي اليوم: أكمل الفراغ: 'I have waited (since / for) 30 minutes'؟"

                lower.contains("interview") || lower.contains("مقابلة") || lower.contains("وظيفة") || lower.contains("job") ->
                    "مستر محمود علي يجهزك لأقوى مقابلة عمل 💼🚀\n\nللسؤال الشهير 'Tell me about yourself'، اتبع هذه الخلطة:\n1. 'Thank you for this opportunity.'\n2. 'Currently, I specialize in [مجالك]...'\n3. 'I am passionate about learning and contributing to your team.'\n\nجرّب كتابة جملة تعرف فيها عن نفسك وسأراجعها لك!"

                lower.contains("look") || lower.contains("see") || lower.contains("watch") ->
                    "سؤال ذكي ومهم جداً من المتعلم الشاطر! إليك الفرق من مستر محمود:\n\n• See: الرؤية الطبيعية بدون مجهود (أرى شيئاً بالصدفة).\n• Look: النظر والتركيز باتجاه محدد ('Look at the board!').\n• Watch: المشاهدة لشيء يتحرك أو يتغير بمرور الوقت ('Watch a movie / Watch football')."

                lower.contains("hello") || lower.contains("hi") || lower.contains("مرحبا") || lower.contains("أهلا") || lower.contains("ازيك") ->
                    "Hello champion! أهلاً بك يا بطل، أنا مستر محمود علي (Mr. Mahmoud Ali) معلمك ومرشدك الشخصي للغة الإنجليزية ومدعوم بالذكاء الاصطناعي للإجابة على كل أسئلتك. اسألني أي سؤال في القواعد أو النطق أو لنبدأ محادثة معاً!"

                else ->
                    "أحسنت يا بطل! سؤالك رائع ومهم جداً. مستر محمود علي معك دائماً:\n\nجملتك واضحة ومعبرة! للممارسة العملية، تذكر دائماً ربط الكلمات بنبرة واثقة، وجرّب نطق الجملة بصوت عالٍ الآن لتثبيت الكلمات في الذاكرة. هل تود أن نتدرب على جملة أخرى؟"
            }

            val botMsg = ChatMessage(
                id = UUID.randomUUID().toString(),
                role = "assistant",
                content = replyText,
                timestamp = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date())
            )
            _chatMessages.value = _chatMessages.value + botMsg
            _isChatLoading.value = false
            tts.playUiSound("chime")

            val englishChars = replyText.count { it in 'a'..'z' || it in 'A'..'Z' }
            val arabicChars = replyText.count { it in '\u0600'..'\u06FF' }
            if (englishChars > arabicChars) {
                tts.speakEnglish(replyText)
            } else {
                tts.speakArabic(replyText)
            }
        }
    }

    fun resetAllData() {
        _vocabulary.value = DefaultData.VOCABULARY
        _progress.value = UserProgress()
        _currentScan.value = null
        _isMemoryModalOpen.value = false
        tts.playUiSound("pop")
    }

    override fun onCleared() {
        super.onCleared()
        tts.shutdown()
    }
}
