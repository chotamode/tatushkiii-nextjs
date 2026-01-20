import type { Metadata } from 'next'
import './globals.css'

// SEO Metadata - критично для поисковых систем
export const metadata: Metadata = {
  metadataBase: new URL('http://128.140.45.14'), // Замените на ваш домен когда будет

  // Основные мета-теги
  title: {
    default: 'Тату Мастер | Графический Дизайнер для Твоей Кожи ✨',
    template: '%s | Тату Мастер',
  },
  description: 'Профессиональные татуировки в уютной атмосфере. Индивидуальные эскизы, стерильные инструменты, безопасность и качество. Записывайся на сеанс!',
  keywords: ['татуировки', 'тату мастер', 'графический дизайнер', 'эскизы тату', 'татуировки на заказ', 'тату салон', 'безопасные татуировки'],
  authors: [{ name: 'Тату Мастер' }],
  creator: 'Тату Мастер',
  publisher: 'Тату Мастер',

  // Языковые настройки
  alternates: {
    canonical: 'https://your-domain.com',
    languages: {
      'ru-RU': 'https://your-domain.com',
    },
  },

  // Open Graph для социальных сетей (VK, Facebook, Telegram)
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://your-domain.com',
    siteName: 'Тату Мастер',
    title: 'Тату Мастер | Графический Дизайнер для Твоей Кожи',
    description: 'Профессиональные татуировки в уютной атмосфере. Индивидуальные эскизы, стерильные инструменты, безопасность и качество.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Тату Мастер - Профессиональные татуировки',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Тату Мастер | Графический Дизайнер для Твоей Кожи',
    description: 'Профессиональные татуировки в уютной атмосфере. Индивидуальные эскизы и безопасность.',
    images: ['/og-image.jpg'],
  },

  // Иконки и манифест
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',

  // Настройки роботов
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

  // Verification для поисковых систем
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
    <html lang="ru">
      <head>
        {/* Schema.org разметка для Google Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TattooParlor',
              name: 'Тату Мастер',
              description: 'Профессиональные татуировки в уютной атмосфере',
              url: 'https://your-domain.com',
              telephone: '+7-XXX-XXX-XX-XX',
              priceRange: '$$',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Москва',
                addressCountry: 'RU',
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '10:00',
                closes: '20:00',
              },
              sameAs: [
                'https://t.me/tattoo_master',
                'https://vk.com/tattoo_master',
                'https://instagram.com/tattoo_master',
              ],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5',
                reviewCount: '50',
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

              Cal("init", "обсуждение-тату-в-тг", {origin:"https://calcom.tzhk.dev"});
              Cal.ns["обсуждение-тату-в-тг"]("floatingButton", {
                "calLink":"chotamode/обсуждение-тату-в-тг",
                "config":{"layout":"month_view","theme":"light"},
                "buttonTextColor":"#000000",
                "buttonColor":"#ffffff"
              });
              Cal.ns["обсуждение-тату-в-тг"]("ui", {
                "theme":"light",
                "hideEventTypeDetails":false,
                "layout":"month_view"
              });
            `,
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
