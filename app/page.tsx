import HomeClient from '@/components/HomeClient'
import { getPortfolio, type Locale, type PortfolioItem } from '@/lib/content'

// Server Component: fetches CMS content (ISR) and hands plain data to the client
// component. Portfolio is fetched per locale because labels are localized while
// images are shared; the client picks the active locale. Empty (no CMS / no
// items / CMS down) → HomeClient falls back to its built-in grid.
const LOCALES: Locale[] = ['en', 'cs', 'ru']

export default async function Page() {
  const lists = await Promise.all(LOCALES.map((locale) => getPortfolio(locale)))
  const portfolioByLocale = Object.fromEntries(
    LOCALES.map((locale, i) => [locale, lists[i]]),
  ) as Record<Locale, PortfolioItem[]>

  return <HomeClient portfolioByLocale={portfolioByLocale} />
}
