import type { Metadata } from 'next'
import { Bebas_Neue, Crimson_Text, Space_Mono, Noto_Sans_Symbols_2 } from 'next/font/google'
import { Toaster } from 'sonner'
import Script from 'next/script'
import CookieNotice from '@/components/CookieNotice'
import './globals.css'

// Font configuration
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const crimsonText = Crimson_Text({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
})

// Decorative sigil glyphs (★⫘♰☠︎︎ etc. via .sigil-text) — previously loaded
// from fonts.googleapis.com via a render-blocking @import, which also sends
// EU visitors' IP addresses to Google without consent. Self-hosted instead.
const notoSansSymbols2 = Noto_Sans_Symbols_2({
  weight: '400',
  subsets: ['symbols'],
  variable: '--font-symbols',
  display: 'swap',
})

// SEO Metadata for Sandu Tattoo Artist
export const metadata: Metadata = {
  metadataBase: new URL('https://doomp.ink'),

  // Main meta tags
  title: {
    default: 'SANDU | Tattoo Artist Prague - Ornamental & Abstract Tattoos',
    template: '%s | SANDU Tattoo',
  },
  description: 'Custom tattoo designs in Prague. Specializing in ornamental, linework, abstract and cybersigilism styles. 4 years experience. Book your session now.',
  keywords: ['tattoo artist prague', 'ornamental tattoo', 'linework tattoo', 'abstract tattoo', 'cybersigilism', 'custom tattoo design', 'prague tattoo'],
  authors: [{ name: 'Sandu' }],
  creator: 'Sandu',
  publisher: 'Sandu Ink',

  // Language settings
  alternates: {
    canonical: 'https://doomp.ink',
    languages: {
      'en': 'https://doomp.ink',
    },
  },

  // Open Graph for social networks
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://doomp.ink',
    siteName: 'SANDU Tattoo',
    title: 'SANDU | Tattoo Artist Prague',
    description: 'Custom tattoo designs. Ornamental, linework, abstract styles. Prague-based artist with 4 years experience.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SANDU - Tattoo Artist Prague',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'SANDU | Tattoo Artist Prague',
    description: 'Custom tattoo designs. Ornamental, linework, abstract styles.',
    images: ['/og-image.jpg'],
  },

  // Icons and manifest — icon.tsx/apple-icon.tsx (app/) generate the actual
  // favicon/apple-touch-icon at build time, no manual metadata.icons needed.
  manifest: '/manifest.webmanifest',

  // Robot settings
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Search engine verification: add real codes here once the domain is
  // verified in Google Search Console / Yandex Webmaster (removed the
  // placeholder values — a fake code is worse than no tag).
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${crimsonText.variable} ${spaceMono.variable} ${notoSansSymbols2.variable}`}>
      <head>
        {/* Schema.org markup for Google Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'TattooParlor',
                  name: 'SANDU Tattoo',
                  description: 'Custom tattoo designs in Prague. Ornamental, linework, abstract styles.',
                  url: 'https://doomp.ink',
                  telephone: '+420774685187',
                  email: 'doompynooo@gmail.com',
                  // Real price floor from the site's own FAQ, not a "$$"
                  // placeholder that says nothing to a searcher.
                  priceRange: 'from 2000 CZK',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Korunni 859/18',
                    addressLocality: 'Prague',
                    postalCode: '120 00',
                    addressCountry: 'CZ',
                  },
                  openingHoursSpecification: {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    opens: '10:00',
                    closes: '20:00',
                  },
                  sameAs: [
                    'https://t.me/doompink',
                    'https://www.instagram.com/doompink',
                  ],
                  // No aggregateRating here — there is no real review source
                  // backing a rating (the 3 testimonials on the page are
                  // unattributed first names, and "300" was borrowed from a
                  // "300+ clients" stat, not review count). A fabricated
                  // rating risks a Google manual action and contradicts the
                  // guideline's own "only real ratings" rule.
                },
                {
                  '@type': 'FAQPage',
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'Does it hurt to get a tattoo?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: "It depends on the placement! But I work gently and always take breaks. Many clients say it was much easier than they expected. Don't worry, I also have numbing cream if needed.",
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'How much does a tattoo cost?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: "Prices start from 2,000 CZK and depend on the size and complexity. Message me with your idea and I'll calculate the price for free!",
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'How do I take care of it after the session?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: "I'll give you detailed aftercare instructions and stay in touch. In short: after the session I apply a healing film for free, you'll need to remove it after 3–5 days (I'll tell you exactly when). After that, just use the cream and don't scratch it!",
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'Can I come with my own design?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: "Of course! Bring a reference and we'll adapt it, or I can draw something similar in my style.",
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'What if I change my mind at the last minute?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'No worries! We can reschedule, just please let me know at least 12 hours in advance.',
                      },
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Toaster position="bottom-right" richColors />
        <CookieNotice />
        <Script
          src="https://umami-rbei0p6e70gv9f6i2iopxc9f.tzhk.dev/script.js"
          data-website-id="92425852-a08c-4d62-bfa0-0f7a459e33aa"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
