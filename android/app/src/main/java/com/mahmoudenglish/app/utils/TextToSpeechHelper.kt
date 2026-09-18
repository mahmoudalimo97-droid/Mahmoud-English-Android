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

    companion object {
        private val FEMALE_KEYWORDS = listOf(
            "female", "woman", "girl", "zira", "samantha", "victoria", "karen",
            "hazel", "laila", "salma", "hoda", "zehra", "mariam", "fatima", "nour",
            "sfg-local", "sfg_1", "tpd-local", "iom-local", "arz-local", "ar-eg-female"
        )

        private val MALE_KEYWORDS = listOf(
            "male", "#male", "guy", "david", "george", "mark", "daniel", "alex",
            "brian", "james", "paul", "ryan", "shakir", "hamed", "tarik", "tariq",
            "naayf", "maged", "iol#male", "iob#male", "sfg#male", "tpd#male",
            "rjs#male", "gba#male", "aub#male", "arc#male"
        )
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            isInitialized = true
            tts?.language = Locale.US
            tts?.setSpeechRate(0.88f)
            // Masculine pitch tuning (0.75f) for Mr. Mahmoud Ali
            tts?.setPitch(0.75f)
            selectMaleVoice("en")
        }
    }

    private fun selectMaleVoice(langCode: String) {
        try {
            val voices = tts?.voices
            if (!voices.isNullOrEmpty()) {
                val isStrictlyNotFemale = { vName: String ->
                    val lower = vName.lowercase()
                    !FEMALE_KEYWORDS.any { kw -> lower.contains(kw) }
                }

                // 1. First priority: explicitly tagged male voice
                var targetVoice = voices.firstOrNull { voice ->
                    val vName = voice.name.lowercase()
                    voice.locale.language.startsWith(langCode) &&
                    isStrictlyNotFemale(vName) &&
                    MALE_KEYWORDS.any { kw -> vName.contains(kw) }
                }

                // 2. Second priority: any voice with "male" in its name
                if (targetVoice == null) {
                    targetVoice = voices.firstOrNull { voice ->
                        voice.locale.language.startsWith(langCode) &&
                        voice.name.lowercase().contains("male") &&
                        !voice.name.lowercase().contains("female")
                    }
                }

                // 3. Third priority: non-female voice
                if (targetVoice == null) {
                    targetVoice = voices.firstOrNull { voice ->
                        voice.locale.language.startsWith(langCode) &&
                        isStrictlyNotFemale(voice.name)
                    }
                }

                if (targetVoice != null) {
                    tts?.voice = targetVoice
                    val isExplicitMale = MALE_KEYWORDS.any { kw -> targetVoice.name.lowercase().contains(kw) }
                    if (isExplicitMale) {
                        tts?.setPitch(0.80f)
                    } else {
                        tts?.setPitch(0.68f) // Deep masculine pitch transformation
                    }
                } else {
                    // Fallback to deep pitch so even default engine sounds male
                    tts?.setPitch(0.68f)
                }
            } else {
                tts?.setPitch(0.68f)
            }
        } catch (e: Exception) {
            tts?.setPitch(0.68f)
        }
    }

    fun speakEnglish(text: String) {
        if (!isInitialized || text.isBlank()) return
        tts?.language = Locale.US
        tts?.setSpeechRate(0.88f)
        selectMaleVoice("en")
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "en_utt")
    }

    fun speakArabic(text: String) {
        if (!isInitialized || text.isBlank()) return
        val arLocale = Locale("ar")
        val isArAvailable = tts?.isLanguageAvailable(arLocale)
        if (isArAvailable != TextToSpeech.LANG_MISSING_DATA && isArAvailable != TextToSpeech.LANG_NOT_SUPPORTED) {
            tts?.language = arLocale
            tts?.setSpeechRate(0.90f)
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
