import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Тату Мастер | Графический Дизайнер для Твоей Кожи',
    short_name: 'Тату Мастер',
    description: 'Профессиональные татуировки в уютной атмосфере',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4169E1',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
