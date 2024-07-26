'use client';

import { useContext } from 'react';

import { LanguageContext } from 'providers/language';

import en from '../translations/en.json';
import ru from '../translations/ru.json';

const translations = {
  en,
  ru,
};

type TranslationKeys = keyof typeof en;

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }

  const { language } = context;
  const t = (key: TranslationKeys): string => translations[language][key] || key;
  return { t };
};
