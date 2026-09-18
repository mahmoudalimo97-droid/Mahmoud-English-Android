/**
 * Web Speech API helper for Athkar application
 * Enforces:
 * 1. Strictly MALE voice only (filters out any female voice, lowers pitch to 0.85 for reverent tone)
 * 2. Never overlaps multiple utterances (cancels previous speech immediately)
 * 3. Supports word-by-word and full-sentence recitation
 * 4. Announces menu navigation transitions
 */

export interface SpeechState {
  isSpeaking: boolean;
  activeId: string | null;
  activeWord: string | null;
  activeText: string | null;
}

type SpeechListener = (state: SpeechState) => void;

class AthkarSpeechEngine {
  private currentVoice: SpeechSynthesisVoice | null = null;
  private listeners: Set<SpeechListener> = new Set();
  private state: SpeechState = {
    isSpeaking: false,
    activeId: null,
    activeWord: null,
    activeText: null,
  };

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoice();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoice();
      };
    }
  }

  private initVoice(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      const femaleKeywords = [
        'female', 'woman', 'laila', 'salma', 'hoda', 'zehra', 'mariam',
        'fatima', 'nour', 'yasmin', 'zira', 'samantha', 'victoria', 'karen',
        'hazel', 'catherine', 'jenny', 'aria', 'susan'
      ];

      const maleKeywords = [
        'male', 'man', 'naayf', 'maged', 'tarik', 'tariq', 'hamed',
        'shakir', 'shaker', 'omar', 'omarr', 'youssef', 'hassan', 'ahmed',
        'khalid', 'natural', 'guy', 'david'
      ];

      const isArabic = (v: SpeechSynthesisVoice) =>
        v.lang.toLowerCase().startsWith('ar');

      const isNotFemale = (v: SpeechSynthesisVoice) =>
        !femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw));

      const isExplicitMale = (v: SpeechSynthesisVoice) =>
        maleKeywords.some((kw) => v.name.toLowerCase().includes(kw));

      // 1. Arabic voice explicitly marked male and not female
      let selected = voices.find((v) => isArabic(v) && isNotFemale(v) && isExplicitMale(v));

      // 2. Arabic voice not marked female
      if (!selected) {
        selected = voices.find((v) => isArabic(v) && isNotFemale(v));
      }

      // 3. Fallback to any Arabic voice
      if (!selected) {
        selected = voices.find((v) => isArabic(v));
      }

      this.currentVoice = selected || null;
    } catch {
      this.currentVoice = null;
    }
  }

  public getVoice(): SpeechSynthesisVoice | null {
    if (!this.currentVoice && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoice();
    }
    return this.currentVoice;
  }

  public subscribe(listener: SpeechListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(newState: Partial<SpeechState>): void {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((fn) => {
      try {
        fn(this.state);
      } catch (err) {
        console.error('Error in speech listener', err);
      }
    });
  }

  /**
   * Stop any ongoing speech immediately to prevent audio overlap
   */
  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Safe fallback
      }
    }
    this.notify({
      isSpeaking: false,
      activeId: null,
      activeWord: null,
      activeText: null,
    });
  }

  /**
   * Cleans text for speech synthesis (removes symbols or bracket annotations)
   */
  private cleanText(rawText: string): string {
    return rawText
      .replace(/[۝۞۩]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\(.*?\)/g, (match) => {
        // Keep simple Arabic text inside parentheses, but avoid citation numbers
        if (/\d/.test(match)) return '';
        return match;
      })
      .trim();
  }

  /**
   * Speak a text passage (full dhikr, sentence, or word) using strictly a MALE voice
   */
  public speak(
    text: string,
    id: string | null = null,
    specificWord: string | null = null,
    rate: number = 0.88
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // Rule: Cancel previous audio immediately
    this.stop();

    const printableText = this.cleanText(text);
    if (!printableText) return;

    try {
      const utterance = new SpeechSynthesisUtterance(printableText);
      utterance.lang = 'ar-SA';
      // Low masculine pitch for a calm, reverent male voice (0.84 - 0.88)
      utterance.pitch = 0.85;
      utterance.rate = rate;

      const voice = this.getVoice();
      if (voice) {
        utterance.voice = voice;
      }

      this.notify({
        isSpeaking: true,
        activeId: id,
        activeWord: specificWord,
        activeText: printableText,
      });

      utterance.onboundary = (event) => {
        if (event.name === 'word' && !specificWord) {
          const charIndex = event.charIndex;
          const remaining = printableText.slice(charIndex);
          const nextSpace = remaining.search(/[\s.,;!?]/);
          const word = nextSpace === -1 ? remaining : remaining.slice(0, nextSpace);
          if (word.trim()) {
            this.notify({ activeWord: word.trim() });
          }
        }
      };

      utterance.onend = () => {
        this.notify({
          isSpeaking: false,
          activeId: null,
          activeWord: null,
          activeText: null,
        });
      };

      utterance.onerror = () => {
        this.notify({
          isSpeaking: false,
          activeId: null,
          activeWord: null,
          activeText: null,
        });
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.notify({
        isSpeaking: false,
        activeId: null,
        activeWord: null,
        activeText: null,
      });
    }
  }

  /**
   * Pronounce a single word clicked by the user
   */
  public speakWord(word: string, id: string | null = null): void {
    const cleaned = word.replace(/[.,;!?،:()"]/g, '').trim();
    if (!cleaned) return;
    this.speak(cleaned, id, cleaned, 0.86);
  }

  /**
   * Pronounce a full dhikr when clicking the dhikr card or play button
   */
  public speakDhikr(text: string, id: string): void {
    this.speak(text, id, null, 0.88);
  }

  /**
   * Pronounce navigation transition (e.g. "أذكار الصباح", "القائمة الرئيسية")
   */
  public speakNavigation(title: string): void {
    // Quick, clean announcement
    this.speak(title, 'nav', null, 0.95);
  }
}

export const athkarSpeech = new AthkarSpeechEngine();
