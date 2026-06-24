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
