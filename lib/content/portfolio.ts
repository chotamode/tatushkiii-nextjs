/**
 * Portfolio content adapter.
 *
 * This is the ONLY function the UI calls for portfolio data, and the ONLY place
 * in the app that knows the CMS is Payload. To migrate to a different CMS,
 * rewrite the body of getPortfolio() and keep the signature + the PortfolioItem
 * return type — components stay untouched.
 *
 * NOTE: server-only. It uses `fetch(..., { next: { revalidate } })` (ISR), which
 * is meaningful only in Server Components / route handlers. Call it from a
 * server component and pass the result down to client components as props.
 */
import { cmsConfig, isCmsConfigured } from './config'
import { portfolioSeed } from './portfolio.seed'
import type { Locale, PortfolioItem } from './types'

// --- Minimal local view of the Payload REST response --------------------------
// Kept private so Payload-specific shapes never leak past this file.
type RawMediaSize = { url?: string | null; width?: number | null; height?: number | null }
type RawMedia = {
  url?: string | null
  width?: number | null
  height?: number | null
  sizes?: Record<string, RawMediaSize | undefined>
}
type RawPortfolioDoc = {
  id: string | number
  label?: string | null
  category?: string | null
  image?: RawMedia | string | null
}
type RawList<T> = { docs?: T[] }

const absolutize = (url: string | null | undefined): string | null => {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  return `${cmsConfig.baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

const pickImageUrls = (media: RawMedia): { imageUrl: string | null; thumbnailUrl: string | null } => {
  const sizes = media.sizes ?? {}
  return {
    imageUrl: absolutize(sizes.card?.url ?? sizes.full?.url ?? media.url),
    thumbnailUrl: absolutize(sizes.thumbnail?.url ?? sizes.card?.url ?? media.url),
  }
}

const mapDoc = (doc: RawPortfolioDoc): PortfolioItem | null => {
  const media = typeof doc.image === 'object' && doc.image !== null ? doc.image : null
  const { imageUrl, thumbnailUrl } = media
    ? pickImageUrls(media)
    : { imageUrl: null, thumbnailUrl: null }
  // An item without a usable image is not renderable — drop it rather than ship a broken card.
  if (!imageUrl) return null
  return {
    id: String(doc.id),
    label: doc.label ?? '',
    category: (doc.category as PortfolioItem['category']) ?? null,
    imageUrl,
    thumbnailUrl: thumbnailUrl ?? undefined,
    width: media?.width ?? undefined,
    height: media?.height ?? undefined,
  }
}

// Typed explicitly so it does not rely on Next's ambient RequestInit augmentation.
type NextFetchInit = RequestInit & { next?: { revalidate?: number; tags?: string[] } }
const fetchInit: NextFetchInit = { next: { revalidate: cmsConfig.revalidateSeconds } }

async function resolveTenantId(): Promise<string | null> {
  if (cmsConfig.tenantId) return cmsConfig.tenantId
  const params = new URLSearchParams({
    'where[slug][equals]': cmsConfig.tenantSlug,
    limit: '1',
    depth: '0',
  })
  const res = await fetch(`${cmsConfig.baseUrl}/api/tenants?${params}`, fetchInit)
  if (!res.ok) throw new Error(`tenant lookup failed: ${res.status}`)
  const data = (await res.json()) as RawList<{ id: string | number }>
  const id = data.docs?.[0]?.id
  return id != null ? String(id) : null
}

export async function getPortfolio(locale: Locale): Promise<PortfolioItem[]> {
  if (!isCmsConfigured()) return portfolioSeed

  try {
    const tenantId = await resolveTenantId()
    if (!tenantId) return portfolioSeed

    const params = new URLSearchParams({
      'where[tenant][equals]': tenantId,
      locale,
      depth: '1',
      sort: 'sort',
      limit: '100',
    })
    const res = await fetch(`${cmsConfig.baseUrl}/api/portfolio?${params}`, fetchInit)
    if (!res.ok) throw new Error(`portfolio fetch failed: ${res.status}`)

    const data = (await res.json()) as RawList<RawPortfolioDoc>
    const items = (data.docs ?? [])
      .map(mapDoc)
      .filter((item): item is PortfolioItem => item !== null)

    return items.length ? items : portfolioSeed
  } catch (error) {
    // Never break the site on CMS trouble — log and fall back to local data.
    console.warn('[content] getPortfolio fell back to seed:', error)
    return portfolioSeed
  }
}
