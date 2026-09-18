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
            val replyText = when {
                userText.contains("hello", ignoreCase = true) || userText.contains("hi", ignoreCase = true) ->
                    "Hello! It's fantastic to practice English with you today. How can I help you improve your speaking or grammar?"
                userText.contains("coffee", ignoreCase = true) ->
                    "Great! If you want to order coffee politely, you can say: 'Could I please have a medium latte with oat milk?' Practice saying that aloud!"
                userText.contains("hotel", ignoreCase = true) ->
                    "For checking into a hotel, use this handy phrase: 'Hi, I have a reservation under the name Mahmoud.' Would you like to practice a check-in roleplay?"
                else ->
                    "Excellent expression! Your grammar is clear. To make it sound even more natural in daily conversation, try emphasizing the keywords with confidence. Keep going!"
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
            tts.speakEnglish(replyText)
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
