/**
 * Site content adapter (homepage texts, contacts, SEO).
 *
 * Returns `null` when the CMS is not configured or unreachable, so the UI can
 * keep using its built-in locale strings — wiring this in is non-breaking.
 *
 * NOTE: server-only (ISR fetch). Call from a Server Component.
 */
import { absolutize, cmsFetch, firstBlock, resolveTenantId } from './_payload'
import { isCmsConfigured } from './config'
import type { Locale, SiteContent, SocialLink } from './types'

// --- Minimal local view of the Payload `siteContent` doc ----------------------
// hero/about/cta now come from the `hero` and `about` blocks in `layout`;
// contacts/socials/SEO are site-level fixed fields.
type RawMedia = { url?: string | null; sizes?: Record<string, { url?: string | null } | undefined> }
type RawSiteContentDoc = {
  layout?: unknown
  contacts?: { telegram?: string | null; whatsapp?: string | null; email?: string | null } | null
  socials?: Array<{ platform?: string | null; url?: string | null }> | null
  seo?: {
    metaTitle?: string | null
    metaDescription?: string | null
    ogImage?: RawMedia | string | null
  } | null
}
type RawList<T> = { docs?: T[] }

/**
 * Minimal lexical → plain text. Walks the rich-text node tree collecting `text`
 * nodes, paragraphs separated by blank lines. Enough to display copy; a proper
 * HTML renderer is a later upgrade and would only change this function + the
 * `about.body` type, not its consumers.
 */
function lexicalToText(value: unknown): string {
  const root = (value as { root?: { children?: unknown[] } } | null)?.root
  if (!root?.children) return ''
  const walk = (node: unknown): string => {
    const n = node as { text?: string; children?: unknown[] }
    if (typeof n.text === 'string') return n.text
    if (Array.isArray(n.children)) return n.children.map(walk).join('')
    return ''
  }
  return root.children
    .map(walk)
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n\n')
}

const mapDoc = (doc: RawSiteContentDoc): SiteContent => {
  const hero = firstBlock(doc.layout, 'hero')
  const about = firstBlock(doc.layout, 'about')
  const ogImage = doc.seo?.ogImage
  const ogMedia = typeof ogImage === 'object' && ogImage !== null ? ogImage : null
  return {
    hero: { title: (hero?.title as string) ?? '', subtitle: (hero?.subtitle as string) ?? '' },
    about: { heading: (about?.heading as string) ?? '', body: lexicalToText(about?.body) },
    cta: { label: (hero?.ctaLabel as string) ?? '' },
    contacts: {
      telegram: doc.contacts?.telegram ?? null,
      whatsapp: doc.contacts?.whatsapp ?? null,
      email: doc.contacts?.email ?? null,
    },
    socials: (doc.socials ?? [])
      .map((s): SocialLink | null =>
        s.platform && s.url ? { platform: s.platform, url: s.url } : null,
      )
      .filter((s): s is SocialLink => s !== null),
    seo: {
      metaTitle: doc.seo?.metaTitle ?? null,
      metaDescription: doc.seo?.metaDescription ?? null,
      ogImageUrl: ogMedia ? absolutize(ogMedia.sizes?.card?.url ?? ogMedia.url) : null,
    },
  }
}

export async function getSiteContent(locale: Locale): Promise<SiteContent | null> {
  if (!isCmsConfigured()) return null

  try {
    const tenantId = await resolveTenantId()
    if (!tenantId) return null

    const params = new URLSearchParams({
      'where[tenant][equals]': tenantId,
      locale,
      depth: '1',
      limit: '1',
    })
    const data = await cmsFetch<RawList<RawSiteContentDoc>>(`/api/siteContent?${params}`)
    const doc = data.docs?.[0]
    return doc ? mapDoc(doc) : null
  } catch (error) {
    // Non-breaking: fall back to the site's built-in locale strings.
    console.warn('[content] getSiteContent unavailable, using built-in copy:', error)
    return null
  }
}
