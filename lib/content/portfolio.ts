/**
 * Portfolio content adapter.
 *
 * The ONLY function the UI calls for portfolio data. Payload-specific shapes
 * stay inside this file (+ _payload.ts). To migrate to a different CMS, rewrite
 * the body and keep the signature + the PortfolioItem return type.
 *
 * NOTE: server-only (uses ISR `fetch`). Call from a Server Component and pass
 * the result to client components as props.
 */
import { absolutize, cmsFetch, resolveTenantId } from './_payload'
import { isCmsConfigured } from './config'
import { portfolioSeed } from './portfolio.seed'
import type { Locale, PortfolioItem } from './types'

// --- Minimal local view of the Payload REST response --------------------------
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
    const data = await cmsFetch<RawList<RawPortfolioDoc>>(`/api/portfolio?${params}`)
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
