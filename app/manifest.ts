import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SANDU | Tattoo Artist Prague',
    short_name: 'SANDU Tattoo',
    description: 'Custom tattoo designs in Prague. Ornamental, linework, abstract and cybersigilism styles.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f8f8',
    theme_color: '#0a0a0a',
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
