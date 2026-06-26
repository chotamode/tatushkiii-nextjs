/**
 * Portfolio content adapter.
 *
 * The ONLY function the UI calls for portfolio data. Reads the first `gallery`
 * block in the page's `layout` and returns items that each carry their tags, so
 * the UI can render a filter bar. Two block sources:
 *  - `curated` — the block's hand-picked `items`.
 *  - `byTags`  — every media tagged with the block's `filterTags`, fetched live.
 *
 * NOTE: server-only (uses ISR `fetch`). Call from a Server Component and pass
 * the result to client components as props.
 */
import { absolutize, cmsFetch, firstBlock, resolveTenantId } from './_payload'
import { isCmsConfigured } from './config'
import { portfolioSeed } from './portfolio.seed'
import type { Locale, PortfolioItem, TagRef } from './types'

// --- Minimal local view of the Payload REST response --------------------------
type RawMediaSize = { url?: string | null; width?: number | null; height?: number | null }
type RawTag = { slug?: string | null; name?: string | null }
type RawMedia = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  sizes?: Record<string, RawMediaSize | undefined>
  tags?: Array<RawTag | string | number> | null
}
type RawGalleryItem = { id?: string | number; label?: string | null; image?: RawMedia | string | null }
type RawGalleryBlock = {
  source?: string | null
  items?: RawGalleryItem[] | null
  filterTags?: Array<{ slug?: string | null } | string | number> | null
  limit?: number | null
}
type RawSiteContentDoc = { layout?: unknown }
type RawList<T> = { docs?: T[] }

const pickImageUrls = (media: RawMedia): { imageUrl: string | null; thumbnailUrl: string | null } => {
  const sizes = media.sizes ?? {}
  return {
    imageUrl: absolutize(sizes.card?.url ?? sizes.full?.url ?? media.url),
    thumbnailUrl: absolutize(sizes.thumbnail?.url ?? sizes.card?.url ?? media.url),
  }
}

const mapTags = (tags: RawMedia['tags']): TagRef[] =>
  (Array.isArray(tags) ? tags : [])
    .map((t): TagRef | null =>
      typeof t === 'object' && t && t.slug ? { slug: t.slug, label: t.name ?? t.slug } : null,
    )
    .filter((t): t is TagRef => t !== null)

const mediaToItem = (media: RawMedia, label: string, index: number): PortfolioItem | null => {
  const { imageUrl, thumbnailUrl } = pickImageUrls(media)
  // An item without a usable image is not renderable — drop it.
  if (!imageUrl) return null
  return {
    id: `item-${index}`,
    label,
    category: null,
    imageUrl,
    thumbnailUrl: thumbnailUrl ?? undefined,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
    tags: mapTags(media.tags),
  }
}

// byTags: fetch every media for this tenant tagged with any of `slugs`.
async function fetchByTags(
  tenantId: string,
  slugs: string[],
  locale: Locale,
  limit: number,
): Promise<PortfolioItem[]> {
  if (!slugs.length) return []
  const params = new URLSearchParams()
  params.set('where[and][0][tenant][equals]', tenantId)
  params.set('where[and][1][tags.slug][in]', slugs.join(','))
  params.set('depth', '1')
  params.set('locale', locale)
  params.set('limit', String(limit))
  const data = await cmsFetch<RawList<RawMedia>>(`/api/media?${params}`)
  return (data.docs ?? [])
    .map((media, i) => mediaToItem(media, media.alt ?? '', i))
    .filter((item): item is PortfolioItem => item !== null)
}

export async function getPortfolio(locale: Locale): Promise<PortfolioItem[]> {
  if (!isCmsConfigured()) return portfolioSeed

  try {
    const tenantId = await resolveTenantId()
    if (!tenantId) return portfolioSeed

    const params = new URLSearchParams({
      'where[tenant][equals]': tenantId,
      locale,
      // depth 2 so each curated item's image → media → tags are populated.
      depth: '2',
      limit: '1',
    })
    const data = await cmsFetch<RawList<RawSiteContentDoc>>(`/api/siteContent?${params}`)
    const gallery = firstBlock(data.docs?.[0]?.layout, 'gallery') as RawGalleryBlock | undefined

    let items: PortfolioItem[]
    if (gallery?.source === 'byTags') {
      const slugs = (gallery.filterTags ?? [])
        .map((t) => (typeof t === 'object' && t ? t.slug : null))
        .filter((s): s is string => Boolean(s))
      items = await fetchByTags(tenantId, slugs, locale, gallery.limit ?? 24)
    } else {
      items = (gallery?.items ?? [])
        .map((it, i) => {
          const media = typeof it.image === 'object' && it.image !== null ? it.image : null
          return media ? mediaToItem(media, it.label ?? '', i) : null
        })
        .filter((item): item is PortfolioItem => item !== null)
    }

    return items.length ? items : portfolioSeed
  } catch (error) {
    // Never break the site on CMS trouble — log and fall back to local data.
    console.warn('[content] getPortfolio fell back to seed:', error)
    return portfolioSeed
  }
}
