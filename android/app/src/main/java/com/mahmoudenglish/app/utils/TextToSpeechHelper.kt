package com.mahmoudenglish.app.utils

import android.content.Context
import android.media.AudioManager
import android.media.ToneGenerator
import android.speech.tts.TextToSpeech
import android.speech.tts.Voice
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
            tts?.setSpeechRate(0.86f)
            tts?.setPitch(0.55f)
        }
    }

    /**
     * Finds the best voice for a language, prioritizing local male voices.
     * Returns a Pair of (selectedVoice, isExplicitlyMale).
     */
    private fun findBestVoice(langPrefix: String): Pair<Voice?, Boolean> {
        return try {
            val allVoices = tts?.voices
            if (allVoices.isNullOrEmpty()) {
                return Pair(null, false)
            }

            val langVoices = allVoices.filter {
                it.locale.language.startsWith(langPrefix, ignoreCase = true) ||
                it.locale.toLanguageTag().startsWith(langPrefix, ignoreCase = true)
            }

            if (langVoices.isEmpty()) {
                return Pair(null, false)
            }

            val isVoiceFemale = { v: Voice ->
                val name = v.name.lowercase()
                name.contains("female") || name.contains("woman") || name.contains("girl") ||
                name.contains("zira") || name.contains("samantha") || name.contains("victoria") ||
                name.contains("karen") || name.contains("hazel") || name.contains("laila") ||
                name.contains("salma") || name.contains("hoda") || name.contains("zehra") ||
                name.contains("mariam") || name.contains("fatima") || name.contains("nour") ||
                name.contains("-f0") || name.contains("_fem") || name.contains("#female")
            }

            val isVoiceMale = { v: Voice ->
                val name = v.name.lowercase()
                !isVoiceFemale(v) && (
                    name.contains("#male") || name.contains("-male") || name.contains("_male") ||
                    name.contains(" male") || name.contains("male-") || name.contains("male_") ||
                    name.contains("david") || name.contains("george") || name.contains("mark") ||
                    name.contains("daniel") || name.contains("alex") || name.contains("guy") ||
                    name.contains("brian") || name.contains("james") || name.contains("paul") ||
                    name.contains("ryan") || name.contains("tarik") || name.contains("tariq") ||
                    name.contains("hamed") || name.contains("shakir") || name.contains("naayf") ||
                    name.contains("maged") || name.contains("-m0") || name.contains("_m0") ||
                    name.contains("m01") || name.contains("m02") || name.contains("m03") ||
                    name.contains("m04") || name.contains("m05") || name.contains("m06")
                )
            }

            // 1. Local (offline) voice that is explicitly tagged male
            val localMale = langVoices.firstOrNull {
                !it.isNetworkConnectionRequired &&
                !it.features.contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED) &&
                isVoiceMale(it)
            }
            if (localMale != null) return Pair(localMale, true)

            // 2. Any voice that is explicitly male
            val anyMale = langVoices.firstOrNull { isVoiceMale(it) }
            if (anyMale != null) return Pair(anyMale, true)

            // 3. Local voice that is NOT female
            val localNonFemale = langVoices.firstOrNull {
                !it.isNetworkConnectionRequired &&
                !it.features.contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED) &&
                !isVoiceFemale(it)
            }
            if (localNonFemale != null) return Pair(localNonFemale, false)

            // 4. Any voice that is NOT female
            val anyNonFemale = langVoices.firstOrNull { !isVoiceFemale(it) }
            if (anyNonFemale != null) return Pair(anyNonFemale, false)

            // 5. Fallback to any local voice
            val anyLocal = langVoices.firstOrNull {
                !it.isNetworkConnectionRequired &&
                !it.features.contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED)
            }
            Pair(anyLocal ?: langVoices.first(), false)
        } catch (e: Exception) {
            Pair(null, false)
        }
    }

    /**
     * Strips emojis, pictographs, symbols, and dingbats so the TTS engine speaks words only.
     */
    fun cleanSpeechText(input: String): String {
        if (input.isBlank()) return ""
        val sb = StringBuilder()
        var i = 0
        while (i < input.length) {
            val codePoint = input.codePointAt(i)
            val charCount = Character.charCount(codePoint)

            val isEmoji = (codePoint in 0x1F600..0x1F64F) || // Emoticons
                          (codePoint in 0x1F300..0x1F5FF) || // Misc Symbols & Pictographs
                          (codePoint in 0x1F680..0x1F6FF) || // Transport & Map
                          (codePoint in 0x1F1E0..0x1F1FF) || // Flags
                          (codePoint in 0x2600..0x26FF) ||   // Misc symbols (☀️, ⚡, ☕)
                          (codePoint in 0x2700..0x27BF) ||   // Dingbats (✨, ❌, ✔️)
                          (codePoint in 0xFE00..0xFE0F) ||   // Variation selectors
                          (codePoint in 0x1F900..0x1F9FF) || // Supplemental Symbols
                          (codePoint in 0x1FA70..0x1FAFF) || // Symbols & Pictographs Ext-A
                          (codePoint == 0x200D) ||           // Zero-width joiner
                          (codePoint in 0x2300..0x23FF) ||   // Misc Technical
                          (codePoint in 0x2B50..0x2B55) ||   // Stars
                          (codePoint in 0x20E3..0x20E4)

            if (!isEmoji) {
                sb.appendCodePoint(codePoint)
            }
            i += charCount
        }
        return sb.toString().replace(Regex("\\s+"), " ").trim()
    }

    fun speakEnglish(text: String) {
        val cleanText = cleanSpeechText(text)
        if (!isInitialized || cleanText.isBlank()) return
        try {
            val (voice, isExplicitMale) = findBestVoice("en")
            if (voice != null) {
                try {
                    tts?.voice = voice
                } catch (e: Exception) {
                    tts?.language = Locale.US
                }
            } else {
                tts?.language = Locale.US
            }

            // If an explicit male voice is found, pitch 0.82f gives a resonant masculine tone.
            // If the voice is unconfirmed or system fallback (which is often female by default),
            // a pitch of 0.52f lowers the vocal tract to ~110 Hz, turning it into a deep baritone male voice.
            val pitch = if (isExplicitMale) 0.82f else 0.52f
            tts?.setPitch(pitch)
            tts?.setSpeechRate(0.86f)

            tts?.speak(cleanText, TextToSpeech.QUEUE_FLUSH, null, "en_utt_${System.currentTimeMillis()}")
        } catch (e: Exception) {
            // Safe fallback
        }
    }

    fun speakArabic(text: String) {
        val cleanText = cleanSpeechText(text)
        if (!isInitialized || cleanText.isBlank()) return
        try {
            val arLocale = Locale("ar")
            val (voice, isExplicitMale) = findBestVoice("ar")
            if (voice != null) {
                try {
                    tts?.voice = voice
                } catch (e: Exception) {
                    tts?.language = arLocale
                }
            } else {
                val isArAvailable = tts?.isLanguageAvailable(arLocale)
                if (isArAvailable != TextToSpeech.LANG_MISSING_DATA && isArAvailable != TextToSpeech.LANG_NOT_SUPPORTED) {
                    tts?.language = arLocale
                }
            }

            val pitch = if (isExplicitMale) 0.82f else 0.52f
            tts?.setPitch(pitch)
            tts?.setSpeechRate(0.88f)

            tts?.speak(cleanText, TextToSpeech.QUEUE_FLUSH, null, "ar_utt_${System.currentTimeMillis()}")
        } catch (e: Exception) {
            // Safe fallback
        }
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
