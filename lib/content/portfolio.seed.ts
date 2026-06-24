import type { PortfolioItem } from './types'

/**
 * Local fallback portfolio.
 *
 * Used when the CMS is not configured or unreachable, so the site always
 * renders (this is the "hardcode as a safety net" path). Add a few entries here
 * pointing at images in /public if you want the site to show real work without
 * a CMS — the shape is identical to what the CMS adapter returns, so the UI
 * cannot tell the difference.
 *
 * Example:
 *   {
 *     id: 'seed-1',
 *     label: 'Ornamental sleeve',
 *     category: 'ornamental',
 *     imageUrl: '/portfolio/sleeve.webp', // a file in /public
 *   }
 */
export const portfolioSeed: PortfolioItem[] = []
