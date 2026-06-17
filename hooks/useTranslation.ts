import { useContentContext } from '@/components/ContentProvider'
import type { Locale } from '@/lib/directus'

export type { Locale }

/**
 * Returns the translation object for the active locale plus the locale state.
 * Content now comes from Directus via <ContentProvider> (with the bundled
 * locale JSON as fallback); the return shape is unchanged so existing
 * `t.*` call sites keep working as-is.
 */
export function useTranslation() {
  const { content, locale, changeLocale } = useContentContext()
  return { t: content.translations[locale], locale, changeLocale }
}
