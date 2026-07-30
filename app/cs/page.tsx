import type { Metadata } from 'next'
import HomeClient from '@/components/HomeClient'
import { getPortfolio, getSiteContent } from '@/lib/content'
import { LOCALE_META, localeAlternates, localeUrl } from '@/lib/locale-meta'

const LOCALE = 'cs' as const

export async function generateMetadata(): Promise<Metadata> {
  const meta = LOCALE_META[LOCALE]
  const sc = await getSiteContent(LOCALE)
  const ogImage = sc?.seo.ogImageUrl || '/og-image.jpg'

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: localeUrl(LOCALE),
      languages: localeAlternates(),
    },
    openGraph: {
      type: 'website',
      locale: meta.ogLocale,
      url: localeUrl(LOCALE),
      siteName: 'SANDU Tattoo',
      title: meta.title,
      description: meta.description,
      images: [{ url: ogImage, alt: meta.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [ogImage],
    },
  }
}

export default async function Page() {
  const [portfolio, siteContent] = await Promise.all([
    getPortfolio(LOCALE),
    getSiteContent(LOCALE),
  ])

  return <HomeClient locale={LOCALE} portfolio={portfolio} siteContent={siteContent} />
}
