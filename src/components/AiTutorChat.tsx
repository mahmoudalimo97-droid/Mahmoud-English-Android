import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Volume2,
  Sparkles,
  Trash2,
  Mic,
  MicOff,
  RotateCcw,
  BookMarked,
} from 'lucide-react';
import { ChatMessage, VocabWord } from '../types';
import { speakEnglish, speakArabic } from '../utils/speech';

interface AiTutorChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onClearChat: () => void;
  isLoading: boolean;
  onSaveWord: (word: VocabWord) => void;
}

const QUICK_PROMPTS = [
  'صحح لي هذه الجملة: "I am agree with you because it is good"',
  'علمني كيف أطلب وجبة قهوة وإفطار بالإنجليزية بطريقة مهذبة',
  'ما الفرق بين Look و See و Watch ومتى أستخدم كل واحدة؟',
  'اشرح لي نطق كلمة Door وحروفها وكلمات شبيهة بها',
  'اختبرني في 3 أسئلة بسيطة لقياس مستواي اليوم',
];

export const AiTutorChat: React.FC<AiTutorChatProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  isLoading,
  onSaveWord,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText('');
    onSendMessage(text);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  // Speech-to-Text via Web Speech API
  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('المتصفح الحالي لا يدعم التعرف الصوتي المباشر. يمكنك الكتابة مباشرة في المربع.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA'; // user can speak arabic or english
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // Speech audio for AI reply (detects if English or Arabic and reads)
  const handleReadMessage = (text: string) => {
    // If predominantly English, speak with English TTS, else Arabic
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
    const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;

    if (englishChars > arabicChars) {
      speakEnglish(text.replace(/[*#_`]/g, ''));
    } else {
      speakArabic(text.replace(/[*#_`]/g, ''));
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-900 text-sm">أستاذ محمود الذكي</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-stone-500">
              معلمك الشخصي للإجابة وتصحيح القواعد والنطق
            </p>
          </div>
        </div>

        <button
          onClick={onClearChat}
          title="مسح المحادثة وبدء محادثة جديدة"
          className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors text-xs flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">محادثة جديدة</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 space-y-4">
            <div className="w-14 h-14 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="max-w-md">
              <h4 className="font-bold text-stone-900 text-base mb-1">
                مرحباً بك! أنا أستاذ محمود، معلمك الذكي للغة الإنجليزية
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                اكتب لي أي جملة تريد تصحيحها، أو اسألني عن معاني الكلمات، أو تدرب معي على محادثة يومية!
              </p>
            </div>

            {/* Quick prompts */}
            <div className="w-full max-w-md space-y-2 pt-2 text-right">
              <span className="text-[11px] font-semibold text-stone-400 block px-1">
                أفكار سريعة للبدء:
              </span>
              <div className="flex flex-col gap-1.5">
                {QUICK_PROMPTS.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickPrompt(qp)}
                    className="p-2.5 rounded-2xl bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 text-xs border border-stone-200/80 transition-all text-right font-medium"
                  >
                    💬 {qp}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                    isMe
                      ? 'bg-stone-800 text-white'
                      : 'bg-emerald-700 text-white shadow-2xs'
                  }`}
                >
                  {isMe ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-3xl p-4 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-stone-800 text-white rounded-tr-xs'
                      : 'bg-[#F9FAF6] border border-stone-200 text-stone-900 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans space-y-1.5">
                    {msg.content}
                  </div>

                  {/* Read Message Button */}
                  {!isMe && (
                    <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => handleReadMessage(msg.content)}
                        title="استمع للرد"
                        className="flex items-center gap-1 text-emerald-800 hover:text-emerald-900 font-semibold p-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>استمع</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-3xl rounded-tl-xs bg-stone-50 border border-stone-200 text-xs text-stone-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></div>
              <div
                className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"
                style={{ animationDelay: '0.4s' }}
              ></div>
              <span className="text-[11px] mr-1">أستاذ محمود يكتب لك الرد...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-stone-50 border-t border-stone-200 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={toggleListening}
          title={isListening ? 'إيقاف التسجيل الصوتي' : 'تحدث بصوتك'}
          className={`p-2.5 rounded-2xl transition-all ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="اكتب سؤالك أو جملتك بالإنجليزية أو العربية..."
          className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 shadow-2xs"
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white shadow-xs transition-all active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
