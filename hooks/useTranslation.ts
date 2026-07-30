import { useEffect } from 'react';
import en from '../locales/en.json';
import cs from '../locales/cs.json';
import ru from '../locales/ru.json';

const translations = { en, cs, ru };

export type Locale = 'en' | 'cs' | 'ru';

// Locale is now a real per-route thing (`/`, `/cs`, `/ru`), not client state —
// each page passes the locale it was rendered for. This just resolves the
// copy for it and keeps <html lang> in sync for screen readers (the shared
// root layout can't set it dynamically since these are sibling routes, not a
// [locale] segment).
export function useTranslation(locale: Locale) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return { t: translations[locale], locale };
}
