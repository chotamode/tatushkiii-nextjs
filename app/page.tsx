import type { Metadata } from 'next'
import HomeClient from '@/components/HomeClient'
import {
  getPortfolio,
  getSiteContent,
  type Locale,
  type PortfolioItem,
  type SiteContent,
} from '@/lib/content'

// Server Component: fetches CMS content (ISR) and hands plain data to the client
// component. Both portfolio and the editable texts are fetched per locale (text
// fields are localized; the client picks the active locale). Anything null/empty
// (no CMS / no items / CMS down) → HomeClient falls back to its built-in copy.
const LOCALES: Locale[] = ['en', 'cs', 'ru']

// Only 'en' is actually served (see hreflang backlog item) — the site's
// static og:image 404s, and the CMS already has a real photo uploaded for
// this. Next doesn't deep-merge nested metadata objects between layout and
// page, so openGraph/twitter here must restate the layout's other fields,
// not just add images.
export async function generateMetadata(): Promise<Metadata> {
  const sc = await getSiteContent('en')
  const ogImage = sc?.seo.ogImageUrl
  if (!ogImage) return {}

  return {
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://doomp.ink',
      siteName: 'SANDU Tattoo',
      title: 'SANDU | Tattoo Artist Prague',
      description: 'Custom tattoo designs. Ornamental, linework, abstract styles. Prague-based artist with 4 years experience.',
      images: [{ url: ogImage, alt: 'SANDU - Tattoo Artist Prague' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SANDU | Tattoo Artist Prague',
      description: 'Custom tattoo designs. Ornamental, linework, abstract styles.',
      images: [ogImage],
    },
  }
}

export default async function Page() {
  const [lists, contents] = await Promise.all([
    Promise.all(LOCALES.map((locale) => getPortfolio(locale))),
    Promise.all(LOCALES.map((locale) => getSiteContent(locale))),
  ])
  const portfolioByLocale = Object.fromEntries(
    LOCALES.map((locale, i) => [locale, lists[i]]),
  ) as Record<Locale, PortfolioItem[]>
  const siteContentByLocale = Object.fromEntries(
    LOCALES.map((locale, i) => [locale, contents[i]]),
  ) as Record<Locale, SiteContent | null>

  return (
    <HomeClient
      portfolioByLocale={portfolioByLocale}
      siteContentByLocale={siteContentByLocale}
    />
  )
}
