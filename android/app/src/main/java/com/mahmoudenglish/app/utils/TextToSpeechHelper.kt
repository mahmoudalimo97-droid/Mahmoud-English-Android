package com.mahmoudenglish.app.utils

import android.content.Context
import android.media.AudioManager
import android.media.ToneGenerator
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.util.*

class TextToSpeechHelper(private val context: Context) : TextToSpeech.OnInitListener {

    private var tts: TextToSpeech? = null
    private var isInitialized = false
    private val scope = CoroutineScope(Dispatchers.Main)
    private var toneGenerator: ToneGenerator? = null

    init {
        tts = TextToSpeech(context, this)
        try {
            toneGenerator = ToneGenerator(AudioManager.STREAM_MUSIC, 60)
        } catch (e: Exception) {
            // Ignored if audio stream not ready
        }
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            isInitialized = true
            tts?.language = Locale.US
            tts?.setSpeechRate(0.92f)
            // Masculine pitch tuning (0.88f) for Mr. Mahmoud Ali
            tts?.setPitch(0.88f)
            selectMaleVoice("en")
        }
    }

    private fun selectMaleVoice(langCode: String) {
        try {
            val voices = tts?.voices
            if (!voices.isNullOrEmpty()) {
                val maleVoice = voices.firstOrNull { voice ->
                    voice.locale.language.startsWith(langCode) &&
                    !voice.name.contains("female", ignoreCase = true) &&
                    (voice.name.contains("male", ignoreCase = true) ||
                     voice.name.contains("guy", ignoreCase = true) ||
                     voice.name.contains("david", ignoreCase = true) ||
                     voice.name.contains("george", ignoreCase = true) ||
                     voice.name.contains("sfg#male", ignoreCase = true))
                } ?: voices.firstOrNull { voice ->
                    voice.locale.language.startsWith(langCode) &&
                    !voice.name.contains("female", ignoreCase = true)
                }
                if (maleVoice != null) {
                    tts?.voice = maleVoice
                }
            }
        } catch (e: Exception) {
            // Safe fallback
        }
    }

    fun speakEnglish(text: String) {
        if (!isInitialized || text.isBlank()) return
        tts?.language = Locale.US
        tts?.setPitch(0.88f)
        selectMaleVoice("en")
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "en_utt")
    }

    fun speakArabic(text: String) {
        if (!isInitialized || text.isBlank()) return
        val arLocale = Locale("ar")
        val isArAvailable = tts?.isLanguageAvailable(arLocale)
        if (isArAvailable != TextToSpeech.LANG_MISSING_DATA && isArAvailable != TextToSpeech.LANG_NOT_SUPPORTED) {
            tts?.language = arLocale
            tts?.setPitch(0.88f)
            selectMaleVoice("ar")
        }
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "ar_utt")
    }

    fun speakWordWithExplanation(englishWord: String, arabicMeaning: String) {
        if (!isInitialized) return
        scope.launch {
            // 1. Speak English Word
            speakEnglish(englishWord)
            // 2. Wait slightly for word to finish
            delay(1200)
            // 3. Speak Arabic Translation
            speakArabic("تعني بالعربية: $arabicMeaning")
        }
    }

    fun playUiSound(type: String = "tap") {
        try {
            when (type) {
                "tap" -> toneGenerator?.startTone(ToneGenerator.TONE_PROP_BEEP, 40)
                "success" -> toneGenerator?.startTone(ToneGenerator.TONE_CDMA_ALERT_CALL_GUARD, 120)
                "chime" -> toneGenerator?.startTone(ToneGenerator.TONE_PROP_ACK, 100)
                "pop" -> toneGenerator?.startTone(ToneGenerator.TONE_PROP_NACK, 70)
            }
        } catch (e: Exception) {
            // fallback
        }
    }

    fun shutdown() {
        tts?.stop()
        tts?.shutdown()
        toneGenerator?.release()
    }
}
