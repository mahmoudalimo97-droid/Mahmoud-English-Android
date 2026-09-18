/**
 * Web Speech API and Sound Effects engine for Mahmoud English
 * STRICT MALE VOICE ONLY: All synthesized speech and pronunciations
 * are rigorously filtered and pitched for dignified, articulate male voices.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Pre-load voices immediately
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };

  // Ensure sound plays during usage only: stop immediately when user leaves or hides the app
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopSpeaking();
    }
  });

  window.addEventListener('pagehide', () => {
    stopSpeaking();
  });

  window.addEventListener('beforeunload', () => {
    stopSpeaking();
  });

  window.addEventListener('blur', () => {
    // If the browser tab/app window loses focus, cancel background speech
    stopSpeaking();
  });
}

/**
 * Play subtle, polished UI sound effects (Tap, Success, Pop, Chime)
 */
export function playUiSound(type: 'tap' | 'success' | 'pop' | 'chime' | 'shutter' = 'tap') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'shutter') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.06);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'tap') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'pop') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'chime') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'success') {
      // Harmonic celebratory chord
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, now + i * 0.07);
        g.gain.setValueAtTime(0.1, now + i * 0.07);
        g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.07 + 0.25);
        o.start(now + i * 0.07);
        o.stop(now + i * 0.07 + 0.25);
      });
    }
  } catch (err) {
    // Graceful fallback
  }
}

// Universal ban-list for all female voices across Web Speech synthesis implementations
const FEMALE_KEYWORDS = [
  'female', 'woman', 'girl', 'zira', 'samantha', 'victoria', 'karen', 'hazel',
  'catherine', 'linda', 'mary', 'jenny', 'aria', 'susan', 'serena',
  'stephanie', 'zoe', 'clara', 'alice', 'fiona', 'allison', 'ava',
  'siri female', 'laila', 'salma', 'hoda', 'zehra', 'mariam', 'fatima',
  'nour', 'mona', 'najat', 'leila', 'sara', 'sarah', 'ayanda', 'yara',
  'helena', 'elena', 'eva', 'claudia', 'laura', 'anna', 'julie', 'joanna',
  'salli', 'ivy', 'kendra', 'kimberly', 'nicole', 'emma', 'amy', 'olivia',
  'daria', 'ar-eg-female', 'en-us-female', 'google us english', 'google uk english female',
  'google العربية', 'google arabic'
];

// High-confidence male voice identifiers across Windows, Android, Chrome OS, macOS, iOS, Linux
const MALE_EN_KEYWORDS = [
  'male', 'david', 'george', 'guy', 'mark', 'daniel', 'oliver', 'alex',
  'fred', 'richard', 'james', 'brian', 'andrew', 'thomas', 'matthew',
  'tom', 'steffan', 'paul', 'ryan', 'microsoft david', 'microsoft guy',
  'microsoft mark', 'google uk english male', 'en-us-male',
  'natural male', '#male', 'en-us-x-iol#male', 'en-us-x-sfg#male', 'en-us-x-iob#male'
];

const MALE_AR_KEYWORDS = [
  'male', 'naayf', 'maged', 'tariq', 'hamed', 'shakir', 'tarik', 'omarr',
  'zein', 'youssef', 'khalid', 'hassan', 'mustafa', 'ahmed', 'karim',
  'microsoft shakur', 'microsoft hamed', 'google ar male', 'ar-male', 'tarik',
  '#male', 'ar-xa-x-arc#male'
];

/**
 * Pronounce English text using a distinct, natural MALE voice
 */
export function speakEnglish(text: string, rate: number = 0.88): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }
    // Only speak during active app usage
    if (typeof document !== 'undefined' && document.hidden) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;

      const voices = window.speechSynthesis.getVoices();

      const isEnglish = (v: SpeechSynthesisVoice) =>
        v.lang.startsWith('en-US') || v.lang.startsWith('en-GB') || v.lang.startsWith('en');

      const isStrictlyNotFemale = (v: SpeechSynthesisVoice) => {
        const lowerName = v.name.toLowerCase();
        return !FEMALE_KEYWORDS.some((kw) => lowerName.includes(kw));
      };

      // 1. First priority: English voice with explicit male identifier and not female
      let selectedVoice = voices.find(
        (v) => isEnglish(v) && isStrictlyNotFemale(v) && MALE_EN_KEYWORDS.some((kw) => v.name.toLowerCase().includes(kw))
      );

      // 2. Second priority: Any voice that explicitly says "male" regardless of locale prefix
      if (!selectedVoice) {
        selectedVoice = voices.find(
          (v) => isEnglish(v) && v.name.toLowerCase().includes('male') && isStrictlyNotFemale(v)
        );
      }

      // 3. Third priority: Any English voice that is strictly not in the female keywords list
      if (!selectedVoice) {
        selectedVoice = voices.find((v) => isEnglish(v) && isStrictlyNotFemale(v));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        const voiceNameLower = selectedVoice.name.toLowerCase();
        if (MALE_EN_KEYWORDS.some((kw) => voiceNameLower.includes(kw))) {
          utterance.pitch = 0.82; // Deep dignified male teacher pitch
        } else {
          utterance.pitch = 0.70; // Force deep masculine formant on neutral/system voices
        }
      } else {
        // Fallback default: deep pitch ensures masculine tone
        utterance.pitch = 0.68;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      resolve();
    }
  });
}

/**
 * Pronounce Arabic text using a distinct MALE voice
 */
export function speakArabic(text: string, rate: number = 0.90): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }
    // Only speak during active app usage
    if (typeof document !== 'undefined' && document.hidden) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = rate;

      const voices = window.speechSynthesis.getVoices();

      const isStrictlyNotFemale = (v: SpeechSynthesisVoice) => {
        const lowerName = v.name.toLowerCase();
        return !FEMALE_KEYWORDS.some((kw) => lowerName.includes(kw));
      };

      // Find male Arabic voice
      let arabicVoice = voices.find(
        (v) =>
          v.lang.startsWith('ar') &&
          isStrictlyNotFemale(v) &&
          MALE_AR_KEYWORDS.some((kw) => v.name.toLowerCase().includes(kw))
      );

      if (!arabicVoice) {
        arabicVoice = voices.find((v) => v.lang.startsWith('ar') && isStrictlyNotFemale(v));
      }

      if (arabicVoice) {
        utterance.voice = arabicVoice;
        const voiceNameLower = arabicVoice.name.toLowerCase();
        if (MALE_AR_KEYWORDS.some((kw) => voiceNameLower.includes(kw))) {
          utterance.pitch = 0.82;
        } else {
          utterance.pitch = 0.70; // Deep masculine pitch
        }
      } else {
        utterance.pitch = 0.70;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      resolve();
    }
  });
}

/**
 * Vocalize both English text and Arabic meaning sequentially in a dignified male voice
 */
export async function speakWordWithExplanation(
  english: string,
  arabic: string,
  rate: number = 0.9
): Promise<void> {
  playUiSound('tap');
  await speakEnglish(english, rate);
  await new Promise((r) => setTimeout(r, 260));
  await speakArabic(arabic, 0.95);
}

/**
 * Vocalize Islamic Duas & Hadiths in a solemn, calm male voice
 */
export async function speakIslamicItem(
  englishText: string,
  arabicText?: string
): Promise<void> {
  playUiSound('tap');
  await speakEnglish(englishText, 0.88);
  if (arabicText) {
    await new Promise((r) => setTimeout(r, 320));
    await speakArabic(arabicText, 0.92);
  }
}

/**
 * Vocalize tab transition in male voice directly
 */
export async function speakTabTransition(tabName: string, lang: 'ar' | 'en' = 'ar'): Promise<void> {
  playUiSound('tap');
  if (lang === 'ar') {
    await speakArabic(tabName, 1.05);
  } else {
    await speakEnglish(tabName, 1.05);
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
