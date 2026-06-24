/**
 * One-time seed: import the bundled site content into a Payload tenant so the
 * client starts with today's site, not a blank CMS.
 *
 * Prerequisites:
 *   1. Payload (tzhk-cms) is deployed with the collections: tenants, site_texts,
 *      faqs, testimonials, services, portfolio, site_settings, media.
 *   2. A super-admin user with an API key (Users.useAPIKey).
 *
 * Run:
 *   PAYLOAD_URL=https://cms.tzhk.dev \
 *   PAYLOAD_TOKEN=<super-admin api key> \
 *   PAYLOAD_TENANT=tatushka \
 *   npx tsx scripts/seed-payload.ts
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

const BASE = process.env.PAYLOAD_URL?.replace(/\/+$/, '')
const TOKEN = process.env.PAYLOAD_TOKEN
const TENANT_SLUG = process.env.PAYLOAD_TENANT || 'tatushka'
const __dirname = dirname(fileURLToPath(import.meta.url))

if (!BASE || !TOKEN) {
  console.error('Set PAYLOAD_URL and PAYLOAD_TOKEN before running.')
  process.exit(1)
}

const authHeaders = { Authorization: `users API-Key ${TOKEN}` }

async function api(path: string, init: RequestInit = {}): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...authHeaders, ...(init.headers ?? {}) },
  })
  if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${path} → ${res.status}: ${await res.text()}`)
  return res.status === 204 ? null : await res.json()
}

/** Create a doc (en), then write the cs/ru translations onto it. */
async function createLocalized(
  collection: string,
  base: Record<string, unknown>,
  localizedFields: (locale: Locale) => Record<string, unknown>,
): Promise<string> {
  const created = await api(`/api/${collection}?locale=en`, {
    method: 'POST',
    body: JSON.stringify({ ...base, tenant: tenantId, ...localizedFields('en') }),
  })
  const id = created?.doc?.id ?? created?.id
  for (const locale of LOCALES.filter((l) => l !== 'en')) {
    await api(`/api/${collection}/${id}?locale=${locale}`, {
      method: 'PATCH',
      body: JSON.stringify(localizedFields(locale)),
    })
  }
  return id
}

function flatten(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object') Object.assign(out, flatten(value as Record<string, unknown>, path))
    else out[path] = String(value)
  }
  return out
}

function valueAt(locale: Locale, dottedKey: string): string {
  let cursor: unknown = dict[locale]
  for (const part of dottedKey.split('.')) cursor = (cursor as Record<string, unknown> | undefined)?.[part]
  return typeof cursor === 'string' ? cursor : ''
}

// Keys owned by dedicated collections — keep them out of site_texts.
const SKIP_PREFIXES = ['faq.', 'testimonials.', 'portfolio.items.']

let tenantId = ''

async function ensureTenant(): Promise<void> {
  const found = await api(`/api/tenants?where[slug][equals]=${TENANT_SLUG}&limit=1`)
  if (found?.docs?.length) {
    tenantId = found.docs[0].id
  } else {
    const created = await api('/api/tenants', {
      method: 'POST',
      body: JSON.stringify({ name: TENANT_SLUG, slug: TENANT_SLUG }),
    })
    tenantId = created?.doc?.id ?? created?.id
  }
  console.log(`✓ tenant "${TENANT_SLUG}" → ${tenantId}`)
}

async function seedSiteTexts(): Promise<void> {
  const flat = flatten(en)
  for (const key of Object.keys(flat)) {
    if (SKIP_PREFIXES.some((p) => key.startsWith(p))) continue
    await createLocalized('site_texts', { key }, (locale) => ({ value: valueAt(locale, key) }))
  }
  console.log('✓ site_texts seeded')
}

async function seedFaqs(): Promise<void> {
  const ids = Object.keys(en.faq).filter((k) => k !== 'title') // q1..q5
  let sort = 1
  for (const id of ids) {
    await createLocalized('faqs', { sort: sort++ }, (locale) => ({
      question: valueAt(locale, `faq.${id}.question`),
      answer: valueAt(locale, `faq.${id}.answer`),
    }))
  }
  console.log('✓ faqs seeded')
}

async function seedTestimonials(): Promise<void> {
  const ids = Object.keys(en.testimonials) // t1..t3
  let sort = 1
  for (const id of ids) {
    await createLocalized(
      'testimonials',
      { sort: sort++, author: valueAt('en', `testimonials.${id}.author`) },
      (locale) => ({ text: valueAt(locale, `testimonials.${id}.text`), work: valueAt(locale, `testimonials.${id}.work`) }),
    )
  }
  console.log('✓ testimonials seeded')
}

async function uploadImage(filename: string, alt: string): Promise<string> {
  const buffer = await readFile(join(__dirname, '..', 'public', 'images', filename))
  const form = new FormData()
  form.append('file', new Blob([buffer]), filename)
  form.append('alt', alt)
  form.append('tenant', tenantId)
  const res = await fetch(`${BASE}/api/media`, { method: 'POST', headers: authHeaders, body: form })
  if (!res.ok) throw new Error(`upload ${filename} → ${res.status}: ${await res.text()}`)
  const json = await res.json()
  return json?.doc?.id ?? json?.id
}

async function seedPortfolio(): Promise<void> {
  const items = [
    { key: 'spine', file: 'spine-tattoo.webp', category: 'ornamental' },
    { key: 'arm', file: 'arm-tattoo.webp', category: 'lineWork' },
    { key: 'back', file: 'back-tattoo.webp', category: 'abstract' },
  ] as const
  let sort = 1
  for (const item of items) {
    const image = await uploadImage(item.file, valueAt('en', `portfolio.items.${item.key}`))
    await createLocalized('portfolio', { sort: sort++, category: item.category, image }, (locale) => ({
      label: valueAt(locale, `portfolio.items.${item.key}`),
    }))
  }
  console.log('✓ portfolio seeded')
}

async function seedSettings(): Promise<void> {
  await api('/api/site_settings', {
    method: 'POST',
    body: JSON.stringify({
      tenant: tenantId,
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
  await ensureTenant()
  await seedSiteTexts()
  await seedFaqs()
  await seedTestimonials()
  await seedPortfolio()
  await seedSettings()
  console.log('\nDone. Review the content in the Payload admin UI.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
