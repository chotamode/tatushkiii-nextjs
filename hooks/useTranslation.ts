import { useState, useEffect } from 'react';
import en from '../locales/en.json';
import cs from '../locales/cs.json';
import ru from '../locales/ru.json';

const translations = { en, cs, ru };

export type Locale = 'en' | 'cs' | 'ru';

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    // Get saved language from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && translations[savedLocale]) {
      setLocale(savedLocale);
    }
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = translations[locale];

  return { t, locale, changeLocale };
}
