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
