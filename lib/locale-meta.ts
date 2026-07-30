import type { Locale } from '@/lib/content'

export const BASE_URL = 'https://doomp.ink'

// Real per-locale SEO copy — translations of the same facts already
// approved in the English metadata (Prague, ornamental/linework/abstract/
// cybersigilism, 4 years), using the exact vocabulary already used elsewhere
// in each locale's own translation file (locales/{cs,ru}.json), not invented
// marketing copy.
export const LOCALE_META: Record<
  Locale,
  { path: string; ogLocale: string; title: string; description: string }
> = {
  en: {
    path: '',
    ogLocale: 'en_US',
    title: 'SANDU | Tattoo Artist Prague - Ornamental & Abstract Tattoos',
    description:
      'Custom tattoo designs in Prague. Specializing in ornamental, linework, abstract and cybersigilism styles. 4 years experience. Book your session now.',
  },
  cs: {
    path: '/cs',
    ogLocale: 'cs_CZ',
    title: 'SANDU | Tatérka Praha – Ornamentální a abstraktní tetování',
    description:
      'Autorská tetování v Praze. Specializace na ornamentální, linkové a abstraktní styly a kybersigilismus. 4 roky zkušeností. Rezervujte si termín.',
  },
  ru: {
    path: '/ru',
    ogLocale: 'ru_RU',
    title: 'SANDU | Тату-мастер в Праге — орнаментал и абстрактные тату',
    description:
      'Авторские тату в Праге. Специализация: орнаментал, лайнворк, абстракция, киберсигилизм. 4 года опыта. Запишись на сеанс.',
  },
}

export function localeUrl(locale: Locale): string {
  return `${BASE_URL}${LOCALE_META[locale].path}`
}

// Same map on every locale's page — one source of truth for the hreflang
// alternates instead of three hand-copied blocks that could drift apart.
export function localeAlternates(): Record<string, string> {
  return {
    en: localeUrl('en'),
    cs: localeUrl('cs'),
    ru: localeUrl('ru'),
    'x-default': localeUrl('en'),
  }
}
