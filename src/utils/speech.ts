/**
 * Web Speech API and Sound Effects engine for Mahmoud English
 * Provides crisp audio pronunciation, Arabic translation vocalization,
 * and synthesized interactive tactile sounds.
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
    // Graceful fallback if audio is blocked
  }
}

// Universal ban-list for all female voices across Web Speech synthesis implementations
const FEMALE_KEYWORDS = [
  'female', 'woman', 'zira', 'samantha', 'victoria', 'karen', 'hazel',
  'catherine', 'linda', 'mary', 'jenny', 'aria', 'susan', 'serena',
  'stephanie', 'zoe', 'clara', 'alice', 'fiona', 'allison', 'ava',
  'siri female', 'laila', 'salma', 'hoda', 'zehra', 'mariam', 'fatima',
  'nour', 'mona', 'najat', 'leila', 'sara', 'sarah', 'ayanda', 'yara',
  'helena', 'elena', 'eva', 'claudia', 'laura', 'anna', 'julie'
];

// High-confidence male voice names across Windows, Android, Chrome OS, macOS, iOS, Linux
const MALE_EN_KEYWORDS = [
  'male', 'david', 'george', 'guy', 'mark', 'daniel', 'oliver', 'alex',
  'fred', 'richard', 'james', 'brian', 'andrew', 'thomas', 'matthew',
  'tom', 'steffan', 'paul', 'ryan', 'natural', 'microsoft david', 'microsoft guy',
  'microsoft mark', 'google us english male', 'google uk english male', 'en-us-x-'
];

const MALE_AR_KEYWORDS = [
  'male', 'naayf', 'maged', 'tariq', 'hamed', 'shakir', 'tarik', 'omarr',
  'zein', 'youssef', 'khalid', 'hassan', 'mustafa', 'ahmed', 'karim',
  'microsoft shakur', 'microsoft hamed', 'google ar male'
];

/**
 * Pronounce English text using a distinct, natural MALE voice
 */
export function speakEnglish(text: string, rate: number = 0.92): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
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

      const isNotFemale = (v: SpeechSynthesisVoice) =>
        !FEMALE_KEYWORDS.some((kw) => v.name.toLowerCase().includes(kw));

      // 1. First priority: English voice with explicit male identifier and not female
      let selectedVoice = voices.find(
        (v) => isEnglish(v) && isNotFemale(v) && MALE_EN_KEYWORDS.some((kw) => v.name.toLowerCase().includes(kw))
      );

      // 2. Second priority: Any English voice that is explicitly not female
      if (!selectedVoice) {
        selectedVoice = voices.find((v) => isEnglish(v) && isNotFemale(v));
      }

      // 3. Fallback: Any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find((v) => isEnglish(v));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        const voiceNameLower = selectedVoice.name.toLowerCase();
        // If the voice is known male, use natural rich pitch 0.85
        if (MALE_EN_KEYWORDS.some((kw) => voiceNameLower.includes(kw))) {
          utterance.pitch = 0.85;
        } else {
          // If fallback voice might be neutral or generic, lower pitch to 0.78 to guarantee deep male tone
          utterance.pitch = 0.78;
        }
      } else {
        // No custom voice assigned: default to masculine pitch
        utterance.pitch = 0.80;
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
export function speakArabic(text: string, rate: number = 0.92): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = rate;

      const voices = window.speechSynthesis.getVoices();

      // Find male Arabic voice
      let arabicVoice = voices.find(
        (v) =>
          v.lang.startsWith('ar') &&
          !FEMALE_KEYWORDS.some((kw) => v.name.toLowerCase().includes(kw)) &&
          MALE_AR_KEYWORDS.some((kw) => v.name.toLowerCase().includes(kw))
      );

      if (!arabicVoice) {
        arabicVoice = voices.find(
          (v) => v.lang.startsWith('ar') && !FEMALE_KEYWORDS.some((kw) => v.name.toLowerCase().includes(kw))
        );
      }

      if (!arabicVoice) {
        arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
      }

      if (arabicVoice) {
        utterance.voice = arabicVoice;
        const voiceNameLower = arabicVoice.name.toLowerCase();
        if (MALE_AR_KEYWORDS.some((kw) => voiceNameLower.includes(kw))) {
          utterance.pitch = 0.85;
        } else {
          // Ensure deep masculine tone
          utterance.pitch = 0.78;
        }
      } else {
        utterance.pitch = 0.80;
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
 * Vocalize both English word and Arabic meaning sequentially with icon audio feedback
 */
export async function speakWordWithExplanation(
  english: string,
  arabic: string,
  rate: number = 0.9
): Promise<void> {
  playUiSound('tap');
  await speakEnglish(english, rate);
  // Short pause before Arabic translation
  await new Promise((r) => setTimeout(r, 260));
  await speakArabic(arabic, 0.95);
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
