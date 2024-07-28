'use client';

import { useSearchParams } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';

export type Language = 'en' | 'ru';

interface LanguageContextProps {
  language: Language;
  changeLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') as Language | null;

  useEffect(() => {
    if (lang && (lang === 'ru' || lang === 'en')) {
      changeLanguage(lang);
    }
  }, [lang]);

  useEffect(() => {
    const storedLang = localStorage.getItem('language') as Language | null;
    if (storedLang) {
      setLanguage(storedLang);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
export default LanguageProvider;
