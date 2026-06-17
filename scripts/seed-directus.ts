/**
 * One-time seed: import the existing bundled content into Directus so the
 * client starts with today's site, not a blank CMS.
 *
 * Prerequisites:
 *   1. Directus is running and the collections from directus/README.md exist
 *      (site_texts, portfolio_items, faqs, testimonials, services, site_settings)
 *      with i18n translations and languages en / cs / ru.
 *   2. Env: DIRECTUS_URL and DIRECTUS_ADMIN_TOKEN (an admin/static token).
 *
 * Run:  DIRECTUS_URL=... DIRECTUS_ADMIN_TOKEN=... npx tsx scripts/seed-directus.ts
 *
 * Idempotency: this performs plain creates. Run it once on an empty instance.
 */
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import en from '../locales/en.json' assert { type: 'json' }
import cs from '../locales/cs.json' assert { type: 'json' }
import ru from '../locales/ru.json' assert { type: 'json' }

type Locale = 'en' | 'cs' | 'ru'
const LOCALES: Locale[] = ['en', 'cs', 'ru']
const dict: Record<Locale, Record<string, unknown>> = { en, cs, ru }

const BASE = process.env.DIRECTUS_URL?.replace(/\/+$/, '')
const TOKEN = process.env.DIRECTUS_ADMIN_TOKEN
const __dirname = dirname(fileURLToPath(import.meta.url))

if (!BASE || !TOKEN) {
  console.error('Set DIRECTUS_URL and DIRECTUS_ADMIN_TOKEN before running.')
  process.exit(1)
}

const authHeaders = { Authorization: `Bearer ${TOKEN}` }

async function api(path: string, init: RequestInit = {}): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...authHeaders, ...(init.headers ?? {}) },
  })
  if (!res.ok) {
    throw new Error(`${init.method ?? 'GET'} ${path} → ${res.status}: ${await res.text()}`)
  }
  return res.status === 204 ? null : ((await res.json()) as { data: unknown }).data
}

/** Flatten a nested object into dotted keys ("hero.title" → "TATTOOS"). */
function flatten(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object') {
      Object.assign(out, flatten(value as Record<string, unknown>, path))
    } else {
      out[path] = String(value)
    }
  }
  return out
}

function valueAt(locale: Locale, dottedKey: string): string {
  let cursor: unknown = dict[locale]
  for (const part of dottedKey.split('.')) {
    cursor = (cursor as Record<string, unknown> | undefined)?.[part]
  }
  return typeof cursor === 'string' ? cursor : ''
}

// Keys handled by dedicated collections — keep them out of site_texts.
const SKIP_PREFIXES = ['faq.', 'testimonials.', 'portfolio.items.']

async function ensureLanguages(): Promise<void> {
  for (const code of LOCALES) {
    try {
      await api('/items/languages', { method: 'POST', body: JSON.stringify({ code, name: code.toUpperCase() }) })
    } catch {
      // Already exists or the languages collection uses different fields — ignore.
    }
  }
}

async function seedSiteTexts(): Promise<void> {
  const flat = flatten(en)
  for (const key of Object.keys(flat)) {
    if (SKIP_PREFIXES.some((p) => key.startsWith(p))) continue
    const translations = LOCALES.map((code) => ({ languages_code: code, value: valueAt(code, key) }))
    await api('/items/site_texts', { method: 'POST', body: JSON.stringify({ key, translations }) })
  }
  console.log('✓ site_texts seeded')
}

async function seedFaqs(): Promise<void> {
  const ids = Object.keys(en.faq).filter((k) => k !== 'title') // q1..q5
  let sort = 1
  for (const id of ids) {
    const translations = LOCALES.map((code) => ({
      languages_code: code,
      question: valueAt(code, `faq.${id}.question`),
      answer: valueAt(code, `faq.${id}.answer`),
    }))
    await api('/items/faqs', { method: 'POST', body: JSON.stringify({ status: 'published', sort: sort++, translations }) })
  }
  console.log('✓ faqs seeded')
}

async function seedTestimonials(): Promise<void> {
  const ids = Object.keys(en.testimonials) // t1..t3
  let sort = 1
  for (const id of ids) {
    const author = valueAt('en', `testimonials.${id}.author`)
    const translations = LOCALES.map((code) => ({
      languages_code: code,
      text: valueAt(code, `testimonials.${id}.text`),
      work: valueAt(code, `testimonials.${id}.work`),
    }))
    await api('/items/testimonials', { method: 'POST', body: JSON.stringify({ status: 'published', sort: sort++, author, translations }) })
  }
  console.log('✓ testimonials seeded')
}

async function uploadImage(filename: string): Promise<string> {
  const buffer = await readFile(join(__dirname, '..', 'public', 'images', filename))
  const form = new FormData()
  form.append('file', new Blob([buffer]), filename)
  const res = await fetch(`${BASE}/files`, { method: 'POST', headers: authHeaders, body: form })
  if (!res.ok) throw new Error(`upload ${filename} → ${res.status}: ${await res.text()}`)
  return ((await res.json()) as { data: { id: string } }).data.id
}

async function seedPortfolio(): Promise<void> {
  const items: Array<{ key: 'spine' | 'arm' | 'back'; file: string; category: string }> = [
    { key: 'spine', file: 'spine-tattoo.webp', category: 'ornamental' },
    { key: 'arm', file: 'arm-tattoo.webp', category: 'lineWork' },
    { key: 'back', file: 'back-tattoo.webp', category: 'abstract' },
  ]
  let sort = 1
  for (const item of items) {
    const image = await uploadImage(item.file)
    const translations = LOCALES.map((code) => ({ languages_code: code, label: valueAt(code, `portfolio.items.${item.key}`) }))
    await api('/items/portfolio_items', {
      method: 'POST',
      body: JSON.stringify({ status: 'published', sort: sort++, category: item.category, image, translations }),
    })
  }
  console.log('✓ portfolio_items seeded')
}

async function seedSettings(): Promise<void> {
  await api('/items/site_settings', {
    method: 'PATCH',
    body: JSON.stringify({
      phone: '+420774685187',
      email: 'doompynooo@gmail.com',
      instagram_url: 'https://www.instagram.com/doompink',
      telegram_url: 'https://t.me/doompink',
      archive_url: 'https://www.instagram.com/doompink',
    }),
  })
  console.log('✓ site_settings seeded')
}

async function main(): Promise<void> {
  await ensureLanguages()
  await seedSiteTexts()
  await seedFaqs()
  await seedTestimonials()
  await seedPortfolio()
  await seedSettings()
  console.log('\nDone. Review the content in the Directus admin UI.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
