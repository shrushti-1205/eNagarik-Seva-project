import React, { createContext, useState, useEffect, useCallback, ReactNode, useContext } from 'react';
import { translations } from '../locales';

type Translations = { [key: string]: string | Translations };
type LanguageKey = keyof typeof translations;

interface LanguageContextType {
  language: LanguageKey;
  setLanguage: (lang: LanguageKey) => void;
  t: (key: string, params?: { [key: string]: string | number }) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageKey>(
    (localStorage.getItem('language') as LanguageKey) || 'en'
  );

  const setLanguage = (lang: LanguageKey) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  };

  const t = useCallback((key: string, params?: { [key: string]: string | number }): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    let fallbackResult: any = translations['en']; 

    for (const k of keys) {
      result = result?.[k];
      fallbackResult = fallbackResult?.[k];
      if (result === undefined) {
        // Fallback to English if key not found in current language, then to key itself
        return fallbackResult || key;
      }
    }
    
    let text = typeof result === 'string' ? result : key;

    if (params) {
        Object.keys(params).forEach(pKey => {
            text = text.replace(new RegExp(`{{${pKey}}}`, 'g'), String(params[pKey]));
        });
    }

    return text;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
