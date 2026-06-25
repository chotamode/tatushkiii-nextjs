/**
 * Payload CMS content layer.
 *
 * The site fetches all editable content from a self-hosted, multi-tenant
 * Payload instance (server-side, with ISR via the `content` cache tag).
 * Everything degrades gracefully: if `PAYLOAD_URL` is unset or the request
 * fails, we fall back to the bundled `locales/*.json` so the site renders
 * exactly as before and the build never depends on a live CMS.
 *
 * Configured via env (set in Coolify):
 *   PAYLOAD_URL     e.g. https://cms.tzhk.dev
 *   PAYLOAD_TOKEN   users API-Key for read access (optional if collections are public)
 *   PAYLOAD_TENANT  this site's tenant slug, e.g. "tatushka"
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
  portfolio_url: string
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
  portfolio_url: '',
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
// Payload REST helpers
// ---------------------------------------------------------------------------

/** Read a localized Payload field (returned as `{en,cs,ru}` when locale=all). */
function loc(value: unknown): LocalizedString {
  const out: LocalizedString = { en: '', cs: '', ru: '' }
  if (value && typeof value === 'object') {
    const v = value as Record<string, unknown>
    for (const code of LOCALES) if (typeof v[code] === 'string') out[code] = v[code] as string
  } else if (typeof value === 'string') {
    out.en = out.cs = out.ru = value
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

/** Rebuild the nested `{en,cs,ru}` translation tree from flat key/value rows. */
function buildTranslations(rows: Array<{ key?: string; value?: unknown }>): Record<Locale, Translations> {
  const result: Record<Locale, Translations> = {
    en: deepClone(en) as Translations,
    cs: deepClone(cs) as Translations,
    ru: deepClone(ru) as Translations,
  }
  for (const row of rows ?? []) {
    if (!row?.key) continue
    const values = loc(row.value)
    for (const locale of LOCALES) {
      if (values[locale]) setDeep(result[locale] as Record<string, unknown>, row.key, values[locale])
    }
  }
  return result
}

/** Resolve a Payload media upload field to an absolute URL. */
function mediaUrl(base: string, image: unknown): string {
  if (!image || typeof image !== 'object') return ''
  const url = (image as { url?: string }).url
  if (!url) return ''
  if (/^https?:\/\//.test(url)) return url
  return `${base.replace(/\/+$/, '')}${url.startsWith('/') ? '' : '/'}${url}`
}

interface PayloadList<T> {
  docs: T[]
}

/**
 * Read the CMS config from env, accepting both the canonical PAYLOAD_* names
 * and the legacy CMS_* aliases (some deployments were set up with the latter).
 */
export function payloadEnv() {
  return {
    base: (process.env.PAYLOAD_URL || process.env.CMS_URL || '').replace(/\/+$/, ''),
    token: process.env.PAYLOAD_TOKEN || process.env.CMS_TOKEN || '',
    tenant: process.env.PAYLOAD_TENANT || process.env.CMS_TENANT_SLUG || '',
  }
}

async function pGet(base: string, collection: string, params: Record<string, string | number>): Promise<unknown[]> {
  const { token, tenant } = payloadEnv()
  const qs = new URLSearchParams()
  qs.set('locale', 'all')
  qs.set('depth', '1')
  qs.set('limit', '200')
  if (tenant) qs.set('where[tenant.slug][equals]', tenant)
  for (const [k, v] of Object.entries(params)) qs.set(k, String(v))

  const res = await fetch(`${base.replace(/\/+$/, '')}/api/${collection}?${qs.toString()}`, {
    headers: token ? { Authorization: `users API-Key ${token}` } : {},
    // Never let an unreachable CMS hang a build/request — fall back instead.
    signal: AbortSignal.timeout(8000),
    // Cache + on-demand revalidation: the /api/revalidate webhook calls
    // revalidateTag('content') whenever the client edits anything in Payload.
    next: { tags: ['content'], revalidate: 60 },
  })
  if (!res.ok) throw new Error(`Payload ${collection} responded ${res.status}`)
  const json = (await res.json()) as PayloadList<unknown>
  return json.docs ?? []
}

/**
 * Fetch all site content from Payload, or return the bundled fallback when
 * Payload is not configured / unreachable.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const { base } = payloadEnv()
  if (!base) return fallbackContent

  try {
    const [texts, portfolio, faqs, testimonials, services, settings] = await Promise.all([
      pGet(base, 'site_texts', { sort: 'key' }) as Promise<Array<{ key?: string; value?: unknown }>>,
      pGet(base, 'portfolio', { sort: 'sort' }) as Promise<Array<Record<string, unknown>>>,
      pGet(base, 'faqs', { sort: 'sort' }) as Promise<Array<Record<string, unknown>>>,
      pGet(base, 'testimonials', { sort: 'sort' }) as Promise<Array<Record<string, unknown>>>,
      pGet(base, 'services', { sort: 'sort' }) as Promise<Array<Record<string, unknown>>>,
      pGet(base, 'site_settings', { limit: 1 }) as Promise<Array<Record<string, unknown>>>,
    ])

    const s = settings[0]

    return {
      translations: buildTranslations(texts),
      portfolio: portfolio.map((r) => ({
        id: r.id as string | number,
        image: mediaUrl(base, r.image),
        category: (r.category as string | null) ?? null,
        label: loc(r.label),
      })),
      faqs: faqs.map((r) => ({
        id: r.id as string | number,
        question: loc(r.question),
        answer: loc(r.answer),
      })),
      testimonials: testimonials.map((r) => ({
        id: r.id as string | number,
        author: (r.author as string) ?? '',
        text: loc(r.text),
        work: loc(r.work),
      })),
      services: services.map((r) => ({
        id: r.id as string | number,
        price: (r.price as string) ?? '',
        name: loc(r.name),
        description: loc(r.description),
      })),
      settings: {
        phone: (s?.phone as string) ?? fallbackSettings.phone,
        email: (s?.email as string) ?? fallbackSettings.email,
        instagram_url: (s?.instagram_url as string) ?? fallbackSettings.instagram_url,
        telegram_url: (s?.telegram_url as string) ?? fallbackSettings.telegram_url,
        archive_url: (s?.archive_url as string) ?? fallbackSettings.archive_url,
        portfolio_url: (s?.portfolio_url as string) ?? fallbackSettings.portfolio_url,
      },
    }
  } catch (error) {
    console.error('[payload] content fetch failed — using bundled fallback:', error)
    return fallbackContent
  }
}
