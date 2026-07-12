import type { NextConfig } from 'next'

// Allow next/image to optimize media served by the CMS (hostname derived from
// CMS_URL — the same env var lib/content/config.ts uses to build absolute
// media URLs, so this can't drift out of sync with what the app actually
// fetches from).
const cmsUrl = process.env.CMS_URL
const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = []
if (cmsUrl) {
  try {
    const { protocol, hostname, port } = new URL(cmsUrl)
    remotePatterns.push({
      protocol: protocol.replace(':', '') as 'http' | 'https',
      hostname,
      port: port || undefined,
      // Payload serves uploaded media under /api/media/file/** (and /media/**).
      pathname: '/**',
    })
  } catch {
    // Invalid CMS_URL — skip remote images, local fallback still works.
  }
}

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns,
  },

  // Enable compression
  compress: true,

  // Increase body size limit for photo uploads (Base64)
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },

  // Generate standalone build for better performance
  output: 'standalone',

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
