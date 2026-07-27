import { withSentryConfig } from '@sentry/nextjs'
import type { NextConfig } from 'next'

const UMAMI_HOST = 'https://umami-rbei0p6e70gv9f6i2iopxc9f.tzhk.dev'
const GLITCHTIP_HOST = 'https://glitchtip-de4z03xi1roztp0sxzniv68o.tzhk.dev'
const OPNFORM_HOST = 'https://opnform.tzhk.dev'

// Allow next/image to optimize media served by the CMS (hostname derived from
// CMS_URL) and by the CMS's media storage (hostname derived from CMS_MEDIA_URL
// — Payload's S3/R2 adapter returns already-absolute URLs on that host, not
// under CMS_URL, so both need whitelisting independently).
const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = []
for (const url of [process.env.CMS_URL, process.env.CMS_MEDIA_URL]) {
  if (!url) continue
  try {
    const { protocol, hostname, port } = new URL(url)
    remotePatterns.push({
      protocol: protocol.replace(':', '') as 'http' | 'https',
      hostname,
      port: port || undefined,
      // Payload serves uploaded media under /api/media/file/** (and /media/**);
      // the R2 bucket serves it at the object key root.
      pathname: '/**',
    })
  } catch {
    // Invalid URL — skip, local fallback / other pattern still works.
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
    // img-src mirrors the same CMS/media hostnames whitelisted for next/image
    // above, so a CMS host change only needs updating in one place.
    const imgHosts = remotePatterns.map((p) => `${p.protocol}://${p.hostname}`).join(' ')

    const csp = [
      `default-src 'self'`,
      `script-src 'self' 'unsafe-inline' ${UMAMI_HOST}`,
      `style-src 'self' 'unsafe-inline'`,
      `img-src 'self' data: ${imgHosts}`.trim(),
      `font-src 'self' data:`,
      `connect-src 'self' ${UMAMI_HOST} ${GLITCHTIP_HOST}`,
      `frame-src ${OPNFORM_HOST}`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `frame-ancestors 'self'`,
    ].join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  silent: true,
  telemetry: false,
  sourcemaps: { disable: true },
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
    excludeReplayShadowDom: true,
    excludeReplayIframe: true,
    excludeReplayWorker: true,
  },
})
