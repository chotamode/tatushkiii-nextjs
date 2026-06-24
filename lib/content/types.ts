/**
 * App-owned domain types for content.
 *
 * Components and pages depend on THESE types, never on the CMS response shape.
 * This is the contract that makes the CMS swappable: changing the backend must
 * not change this file. Only the adapter (portfolio.ts) maps a backend's shape
 * into these types.
 */

export type Locale = 'en' | 'cs' | 'ru'

export type PortfolioCategory =
  | 'ornamental'
  | 'lineWork'
  | 'abstract'
  | 'whipShading'
  | 'freehand'

export type PortfolioItem = {
  id: string
  label: string
  category: PortfolioCategory | null
  /** Absolute URL to the display image (already resolved against the CMS host). */
  imageUrl: string
  /** Optional smaller variant for grids/thumbnails. */
  thumbnailUrl?: string
  width?: number
  height?: number
}

export type SocialLink = { platform: string; url: string }

/**
 * Editable landing-page content for the tenant. `getSiteContent()` returns this
 * (or `null` when the CMS is not configured/unavailable, so the UI can fall back
 * to its built-in locale strings). `about.body` is plain text for now — rich
 * formatting is a later upgrade and would not change this shape's consumers.
 */
export type SiteContent = {
  hero: { title: string; subtitle: string }
  about: { heading: string; body: string }
  cta: { label: string }
  contacts: { telegram: string | null; whatsapp: string | null; email: string | null }
  socials: SocialLink[]
  seo: { metaTitle: string | null; metaDescription: string | null; ogImageUrl: string | null }
}
