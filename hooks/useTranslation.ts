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

  // <html lang> is server-rendered as "en" and otherwise never updates —
  // switching to cs/ru left screen readers announcing Russian/Czech text as
  // English. All three locale codes (en/cs/ru) are already valid BCP-47.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = translations[locale];

  return { t, locale, changeLocale };
}
