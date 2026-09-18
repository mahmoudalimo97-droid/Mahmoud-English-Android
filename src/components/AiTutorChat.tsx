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
  CheckCircle2,
  GraduationCap,
  MessageSquare,
} from 'lucide-react';
import { ChatMessage, VocabWord } from '../types';
import { speakEnglish, speakArabic, playUiSound } from '../utils/speech';
import { useLanguage } from '../context/LanguageContext';

interface AiTutorChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onClearChat: () => void;
  isLoading: boolean;
  onSaveWord: (word: VocabWord) => void;
}

export const AiTutorChat: React.FC<AiTutorChatProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  isLoading,
  onSaveWord,
}) => {
  const { language, t } = useLanguage();
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
    playUiSound('pop');
    onSendMessage(text);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    playUiSound('tap');
    onSendMessage(prompt);
  };

  // Speech-to-Text via Web Speech API
  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        language === 'ar'
          ? 'المتصفح الحالي لا يدعم التعرف الصوتي المباشر. يمكنك الكتابة مباشرة في المربع.'
          : 'Speech recognition is not supported in this browser. You can type directly in the box.'
      );
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      playUiSound('tap');
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
        playUiSound('chime');
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

  // Speech audio for AI reply
  const handleReadMessage = (text: string) => {
    playUiSound('tap');
    const cleanText = text.replace(/[*#_`]/g, '');
    const englishChars = (cleanText.match(/[a-zA-Z]/g) || []).length;
    const arabicChars = (cleanText.match(/[\u0600-\u06FF]/g) || []).length;

    if (englishChars > arabicChars) {
      speakEnglish(cleanText);
    } else {
      speakArabic(cleanText);
    }
  };

  const quickPrompts = [
    t('prompt1'),
    t('prompt2'),
    t('prompt3'),
    t('prompt4'),
    t('prompt5'),
  ];

  return (
    <div className="flex flex-col h-[650px] bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Chat Top Banner with Teacher Avatar */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-blue-50/30 to-teal-50/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Illustrated Teacher Avatar */}
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {t('tutorName')}
              </h3>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full border border-emerald-200">
                {language === 'ar' ? 'متصل الآن' : 'Online'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-xs truncate">
              {t('tutorRole')}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playUiSound('tap');
            onClearChat();
          }}
          title={t('clearChatBtn')}
          className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-all text-xs font-semibold flex items-center gap-1.5 border border-slate-200/70 shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">{t('clearChatBtn')}</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 text-slate-500 space-y-4">
            {/* Illustrated Welcome Hero Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Bot className="w-8 h-8 text-amber-300" />
              </div>
              <span className="absolute -top-1 -right-1 text-base">✨</span>
            </div>

            <div className="max-w-md">
              <h4 className="font-bold text-slate-900 text-base mb-1">
                {t('chatHeroTitle')}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('tutorGreeting')}
              </p>
            </div>

            {/* Quick Suggested Practice Prompts */}
            <div className="w-full max-w-md space-y-2 pt-2">
              <span className="text-[11px] font-bold text-slate-500 block text-start px-1">
                {t('quickPromptsTitle')}
              </span>
              <div className="flex flex-col gap-2">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickPrompt(qp)}
                    className="p-3 rounded-2xl bg-white hover:bg-blue-50/70 text-slate-800 hover:text-blue-900 text-xs border border-slate-200/90 shadow-2xs transition-all text-start font-medium flex items-center gap-2 active:scale-98"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="leading-snug">{qp}</span>
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
                className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end`}
              >
                {/* Visual Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl shrink-0 flex items-center justify-center text-xs font-bold shadow-2xs ${
                    isMe
                      ? 'bg-gradient-to-tr from-slate-800 to-slate-900 text-white'
                      : 'bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-600 text-white'
                  }`}
                  title={isMe ? t('userRole') : t('tutorName')}
                >
                  {isMe ? (
                    <User className="w-4 h-4 text-slate-100" />
                  ) : (
                    <GraduationCap className="w-4 h-4 text-amber-300" />
                  )}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200/90 text-slate-900 rounded-bl-xs'
                  }`}
                >
                  {/* Name label */}
                  <div
                    className={`text-[10px] font-bold mb-1.5 flex items-center justify-between gap-2 ${
                      isMe ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    <span>{isMe ? t('userRole') : t('tutorName')}</span>
                    <span className="text-[9px] opacity-75">{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-wrap space-y-1.5 leading-relaxed text-sm">
                    {msg.content}
                  </div>

                  {/* Speech button on AI response */}
                  {!isMe && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => handleReadMessage(msg.content)}
                        title={t('listenWord')}
                        className="flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-bold text-xs p-1 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{t('listenWord')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex gap-3 items-end">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-700 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Bot className="w-4 h-4 text-amber-300" />
            </div>
            <div className="p-3.5 rounded-3xl rounded-bl-xs bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2 shadow-2xs">
              <span className="text-slate-600 font-medium">{t('typingIndicator')}</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
                <span
                  className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"
                  style={{ animationDelay: '0.15s' }}
                ></span>
                <span
                  className="w-2 h-2 rounded-full bg-teal-600 animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                ></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
      >
        <button
          type="button"
          onClick={toggleListening}
          title={isListening ? t('voiceStopBtn') : t('voiceInputBtn')}
          className={`p-2.5 rounded-2xl transition-all active:scale-95 shrink-0 ${
            isListening
              ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t('chatPlaceholder')}
          disabled={isLoading}
          className="flex-1 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder:text-slate-400 px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-blue-500 focus:outline-none text-xs sm:text-sm transition-all shadow-inner"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          title={t('sendMsgBtn')}
          className={`p-2.5 sm:px-4 sm:py-2.5 rounded-2xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 shrink-0 ${
            inputText.trim() && !isLoading
              ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 hover:from-blue-800 hover:to-teal-700 shadow-blue-500/20'
              : 'bg-slate-300 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{t('sendMsgBtn')}</span>
        </button>
      </form>
    </div>
  );
};
