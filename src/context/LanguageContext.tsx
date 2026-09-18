import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationKey, getTranslation } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  direction: 'rtl' | 'ltr';
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('mahmoud_app_lang');
      if (saved === 'ar' || saved === 'en') {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return 'ar';
  });

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    try {
      localStorage.setItem('mahmoud_app_lang', language);
    } catch (e) {
      // ignore
    }
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    return getTranslation(language, key, params);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
