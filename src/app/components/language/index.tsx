'use client';

import { useSearchParams } from 'next/navigation';
import { Language, LanguageContext } from 'providers/language';
import { useContext, useEffect } from 'react';

import Button from 'components/button';

import styles from './styles.module.scss';

const LanguageSwitcher = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('LanguageSwitcher must be used within a LanguageProvider');
  }

  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') as Language | null;

  const { changeLanguage, language } = context;

  useEffect(() => {
    if (lang) {
      changeLanguage(lang);
    }
  }, [lang]);

  return (
    <div className={styles.language_switcher}>
      {language === 'en' ? (
        <Button
          width={110}
          onClick={() => changeLanguage('ru')}
          small
          style={{
            opacity: '0.4',
          }}
        >
          Русский
        </Button>
      ) : (
        <Button
          width={110}
          onClick={() => changeLanguage('en')}
          small
          style={{
            opacity: '0.4',
          }}
        >
          English
        </Button>
      )}
    </div>
  );
};
export default LanguageSwitcher;
