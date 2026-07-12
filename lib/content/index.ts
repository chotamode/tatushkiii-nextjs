/**
 * Public API of the content layer.
 *
 * The rest of the app imports from `@/lib/content` only — never from the
 * adapter files directly. This keeps the surface small and the CMS swappable.
 */
export { getPortfolio } from './portfolio'
export { getSiteContent } from './siteContent'
export type {
  LightboxImage,
  Locale,
  PortfolioCategory,
  PortfolioItem,
  SiteContent,
  SocialLink,
  TagRef,
} from './types'
