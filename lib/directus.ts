/**
 * Directus content layer.
 *
 * The site fetches all editable content from a self-hosted Directus instance
 * (server-side, with ISR via the `content` cache tag). Everything degrades
 * gracefully: if `DIRECTUS_URL` is unset or the request fails, we fall back to
 * the bundled `locales/*.json` so the site renders exactly as before and the
 * build never depends on a live CMS.
 *
 * Configured via env (set in Coolify):
 *   DIRECTUS_URL    e.g. https://cms.doomp.ink
 *   DIRECTUS_TOKEN  read-only static token (optional if collections are public)
 */
import en from '@/locales/en.json'
import cs from '@/locales/cs.json'
import ru from '@/locales/ru.json'

export type Locale = 'en' | 'cs' | 'ru'
export const LOCALES: Locale[] = ['en', 'cs', 'ru']

// Widen the JSON's literal types (e.g. "TATTOOS") to plain `string` so all
// three locales share one structural type.
type DeepWiden<T> = T extends string
  ? string
  : T extends object
    ? { [K in keyof T]: DeepWiden<T[K]> }
    : T
export type Translations = DeepWiden<typeof en>

export type LocalizedString = Record<Locale, string>

export interface PortfolioItem {
  id: string | number
  image: string
  category: string | null
  label: LocalizedString
}
export interface Faq {
  id: string | number
  question: LocalizedString
  answer: LocalizedString
}
export interface Testimonial {
  id: string | number
  author: string
  text: LocalizedString
  work: LocalizedString
}
export interface Service {
  id: string | number
  price: string
  name: LocalizedString
  description: LocalizedString
}
export interface Settings {
  phone: string
  email: string
  instagram_url: string
  telegram_url: string
  archive_url: string
}

export interface SiteContent {
  translations: Record<Locale, Translations>
  portfolio: PortfolioItem[]
  faqs: Faq[]
  testimonials: Testimonial[]
  services: Service[]
  settings: Settings
}

// ---------------------------------------------------------------------------
// Fallback content derived from the bundled locale files (canonical defaults).
// ---------------------------------------------------------------------------

function localized(pick: (t: Translations) => string): LocalizedString {
  return { en: pick(en), cs: pick(cs), ru: pick(ru) }
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

const fallbackTranslations: Record<Locale, Translations> = {
  en: deepClone(en) as Translations,
  cs: deepClone(cs) as Translations,
  ru: deepClone(ru) as Translations,
}

const fallbackPortfolio: PortfolioItem[] = [
  { id: 'spine', image: '/images/spine-tattoo.webp', category: 'ornamental', label: localized((t) => t.portfolio.items.spine) },
  { id: 'arm', image: '/images/arm-tattoo.webp', category: 'lineWork', label: localized((t) => t.portfolio.items.arm) },
  { id: 'back', image: '/images/back-tattoo.webp', category: 'abstract', label: localized((t) => t.portfolio.items.back) },
]

const fallbackFaqs: Faq[] = (['q1', 'q2', 'q3', 'q4', 'q5'] as const).map((q) => ({
  id: q,
  question: localized((t) => t.faq[q].question),
  answer: localized((t) => t.faq[q].answer),
}))

const fallbackTestimonials: Testimonial[] = (['t1', 't2', 't3'] as const).map((k) => ({
  id: k,
  author: en.testimonials[k].author,
  text: localized((t) => t.testimonials[k].text),
  work: localized((t) => t.testimonials[k].work),
}))

const fallbackServices: Service[] = []

const fallbackSettings: Settings = {
  phone: '+420774685187',
  email: 'doompynooo@gmail.com',
  instagram_url: 'https://www.instagram.com/doompink',
  telegram_url: 'https://t.me/doompink',
  archive_url: 'https://www.instagram.com/doompink',
}

export const fallbackContent: SiteContent = {
  translations: fallbackTranslations,
  portfolio: fallbackPortfolio,
  faqs: fallbackFaqs,
  testimonials: fallbackTestimonials,
  services: fallbackServices,
  settings: fallbackSettings,
}

// ---------------------------------------------------------------------------
// Directus fetch helpers
// ---------------------------------------------------------------------------

interface TranslationRow {
  languages_code?: string
  [field: string]: unknown
}

/** Fold a Directus translations array into `{ en, cs, ru }`. */
function fold(rows: TranslationRow[] | undefined, field: string): LocalizedString {
  const out: LocalizedString = { en: '', cs: '', ru: '' }
  for (const row of rows ?? []) {
    const code = String(row.languages_code ?? '').slice(0, 2) as Locale
    if (code === 'en' || code === 'cs' || code === 'ru') {
      out[code] = (row[field] as string) ?? ''
    }
  }
  return out
}

function setDeep(obj: Record<string, unknown>, dottedKey: string, value: string): void {
  const parts = dottedKey.split('.')
  let cursor = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (typeof cursor[part] !== 'object' || cursor[part] === null) cursor[part] = {}
    cursor = cursor[part] as Record<string, unknown>
  }
  cursor[parts[parts.length - 1]] = value
}

/** Rebuild the nested `{ en, cs, ru }` translation tree from flat key/value rows. */
function buildTranslations(rows: Array<{ key?: string; translations?: TranslationRow[] }>): Record<Locale, Translations> {
  const result: Record<Locale, Translations> = {
    en: deepClone(en) as Translations,
    cs: deepClone(cs) as Translations,
    ru: deepClone(ru) as Translations,
  }
  for (const row of rows ?? []) {
    if (!row?.key) continue
    const values = fold(row.translations, 'value')
    for (const locale of LOCALES) {
      if (values[locale]) setDeep(result[locale] as Record<string, unknown>, row.key, values[locale])
    }
  }
  return result
}

function assetUrl(base: string, id: string | null | undefined): string {
  return id ? `${base.replace(/\/+$/, '')}/assets/${id}` : ''
}

async function dGet(
  base: string,
  collection: string,
  params: Record<string, string | number>,
): Promise<unknown> {
  const token = process.env.DIRECTUS_TOKEN
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) qs.set(k, String(v))
  const res = await fetch(`${base.replace(/\/+$/, '')}/items/${collection}?${qs.toString()}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    // Never let an unreachable CMS hang a build/request — fall back instead.
    signal: AbortSignal.timeout(8000),
    // Cache + on-demand revalidation: the /api/revalidate webhook calls
    // revalidateTag('content') whenever the client edits anything in Directus.
    next: { tags: ['content'], revalidate: 60 },
  })
  if (!res.ok) throw new Error(`Directus ${collection} responded ${res.status}`)
  const json = (await res.json()) as { data: unknown }
  return json.data
}

const PUBLISHED = JSON.stringify({ status: { _eq: 'published' } })

/**
 * Fetch all site content from Directus, or return the bundled fallback when
 * Directus is not configured / unreachable.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const base = process.env.DIRECTUS_URL
  if (!base) return fallbackContent

  try {
    const [texts, portfolio, faqs, testimonials, services, settings] = await Promise.all([
      dGet(base, 'site_texts', { fields: 'key,translations.languages_code,translations.value', limit: -1 }) as Promise<Array<{ key?: string; translations?: TranslationRow[] }>>,
      dGet(base, 'portfolio_items', { fields: 'id,image,category,sort,translations.languages_code,translations.label', filter: PUBLISHED, sort: 'sort', limit: -1 }) as Promise<Array<Record<string, unknown>>>,
      dGet(base, 'faqs', { fields: 'id,sort,translations.languages_code,translations.question,translations.answer', filter: PUBLISHED, sort: 'sort', limit: -1 }) as Promise<Array<Record<string, unknown>>>,
      dGet(base, 'testimonials', { fields: 'id,author,sort,translations.languages_code,translations.text,translations.work', filter: PUBLISHED, sort: 'sort', limit: -1 }) as Promise<Array<Record<string, unknown>>>,
      dGet(base, 'services', { fields: 'id,price,sort,translations.languages_code,translations.name,translations.description', filter: PUBLISHED, sort: 'sort', limit: -1 }) as Promise<Array<Record<string, unknown>>>,
      dGet(base, 'site_settings', { fields: '*' }) as Promise<Record<string, unknown> | null>,
    ])

    return {
      translations: buildTranslations(texts),
      portfolio: portfolio.map((r) => ({
        id: r.id as string | number,
        image: assetUrl(base, r.image as string | null),
        category: (r.category as string | null) ?? null,
        label: fold(r.translations as TranslationRow[] | undefined, 'label'),
      })),
      faqs: faqs.map((r) => ({
        id: r.id as string | number,
        question: fold(r.translations as TranslationRow[] | undefined, 'question'),
        answer: fold(r.translations as TranslationRow[] | undefined, 'answer'),
      })),
      testimonials: testimonials.map((r) => ({
        id: r.id as string | number,
        author: (r.author as string) ?? '',
        text: fold(r.translations as TranslationRow[] | undefined, 'text'),
        work: fold(r.translations as TranslationRow[] | undefined, 'work'),
      })),
      services: services.map((r) => ({
        id: r.id as string | number,
        price: (r.price as string) ?? '',
        name: fold(r.translations as TranslationRow[] | undefined, 'name'),
        description: fold(r.translations as TranslationRow[] | undefined, 'description'),
      })),
      settings: {
        phone: (settings?.phone as string) ?? fallbackSettings.phone,
        email: (settings?.email as string) ?? fallbackSettings.email,
        instagram_url: (settings?.instagram_url as string) ?? fallbackSettings.instagram_url,
        telegram_url: (settings?.telegram_url as string) ?? fallbackSettings.telegram_url,
        archive_url: (settings?.archive_url as string) ?? fallbackSettings.archive_url,
      },
    }
  } catch (error) {
    console.error('[directus] content fetch failed — using bundled fallback:', error)
    return fallbackContent
  }
}
