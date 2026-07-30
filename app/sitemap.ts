import { MetadataRoute } from 'next'
import { localeAlternates, localeUrl } from '@/lib/locale-meta'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const languages = localeAlternates()

  return (['en', 'cs', 'ru'] as const).map((locale) => ({
    url: localeUrl(locale),
    lastModified,
    changeFrequency: 'monthly',
    priority: locale === 'en' ? 1 : 0.8,
    alternates: { languages },
  }))
}
