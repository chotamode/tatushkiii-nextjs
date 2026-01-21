import type { Metadata } from 'next'
import './globals.css'

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

  // Icons and manifest
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',

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

  // Verification for search engines
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Schema.org markup for Google Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TattooParlor',
              name: 'SANDU Tattoo',
              description: 'Custom tattoo designs in Prague. Ornamental, linework, abstract styles.',
              url: 'https://doomp.ink',
              telephone: '+420774685187',
              email: 'doompynooo@gmail.com',
              priceRange: '$$',
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
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5',
                reviewCount: '300',
              },
            }),
          }}
        />

        {/* Cal.com embed script */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function (C, A, L) {
                let p = function (a, ar) { a.q.push(ar); };
                let d = C.document;
                C.Cal = C.Cal || function () {
                  let cal = C.Cal;
                  let ar = arguments;
                  if (!cal.loaded) {
                    cal.ns = {};
                    cal.q = cal.q || [];
                    d.head.appendChild(d.createElement("script")).src = A;
                    cal.loaded = true;
                  }
                  if (ar[0] === L) {
                    const api = function () { p(api, arguments); };
                    const namespace = ar[1];
                    api.q = api.q || [];
                    if(typeof namespace === "string"){
                      cal.ns[namespace] = cal.ns[namespace] || api;
                      p(cal.ns[namespace], ar);
                      p(cal, ["initNamespace", namespace]);
                    } else p(cal, ar);
                    return;
                  }
                  p(cal, ar);
                };
              })(window, "https://calcom.tzhk.dev/embed/embed.js", "init");

              Cal("init", "book-session", {origin:"https://calcom.tzhk.dev"});
              Cal.ns["book-session"]("ui", {
                "hideEventTypeDetails": false,
                "layout": "month_view"
              });
            `,
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
