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
      // 0.88 pitch gives a confident, warm, masculine voice
      utterance.pitch = 0.88;

      const voices = window.speechSynthesis.getVoices();
      
      // Strict exclusion of female voices to guarantee a male speaker
      const femaleKeywords = [
        'female', 'woman', 'zira', 'samantha', 'victoria', 'karen', 'hazel',
        'catherine', 'linda', 'mary', 'jenny', 'aria', 'susan', 'serena',
        'stephanie', 'zoe', 'clara', 'alice', 'fiona', 'allison', 'ava'
      ];
      
      // Prioritize recognized high quality male voice identifiers
      const maleKeywords = [
        'male', 'david', 'george', 'guy', 'mark', 'daniel', 'oliver', 'alex',
        'fred', 'richard', 'james', 'brian', 'andrew', 'thomas', 'matthew',
        'tom', 'steffan', 'paul', 'ryan', 'natural'
      ];

      const isEnglish = (v: SpeechSynthesisVoice) =>
        v.lang.startsWith('en-US') || v.lang.startsWith('en-GB') || v.lang.startsWith('en');

      const isNotFemale = (v: SpeechSynthesisVoice) =>
        !femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw));

      // 1. First priority: English voice with explicit male identifier and not female
      let selectedVoice = voices.find(
        (v) => isEnglish(v) && isNotFemale(v) && maleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
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
      // Masculine pitch tuning
      utterance.pitch = 0.88;

      const voices = window.speechSynthesis.getVoices();
      const femaleArKeywords = ['female', 'laila', 'salma', 'hoda', 'zehra', 'mariam', 'fatima', 'nour'];
      const maleArKeywords = ['male', 'naayf', 'maged', 'tariq', 'hamed', 'shakir', 'tarik', 'omarr'];

      // Find male Arabic voice
      let arabicVoice = voices.find(
        (v) =>
          v.lang.startsWith('ar') &&
          !femaleArKeywords.some((kw) => v.name.toLowerCase().includes(kw)) &&
          maleArKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      );

      if (!arabicVoice) {
        arabicVoice = voices.find(
          (v) => v.lang.startsWith('ar') && !femaleArKeywords.some((kw) => v.name.toLowerCase().includes(kw))
        );
      }

      if (!arabicVoice) {
        arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
      }

      if (arabicVoice) {
        utterance.voice = arabicVoice;
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

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
