import type { NextConfig } from 'next'

// Allow next/image to optimize assets served by the Directus instance
// (hostname derived from DIRECTUS_URL so nothing is hardcoded).
const directusUrl = process.env.DIRECTUS_URL
const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = []
if (directusUrl) {
  try {
    const { protocol, hostname, port } = new URL(directusUrl)
    remotePatterns.push({
      protocol: protocol.replace(':', '') as 'http' | 'https',
      hostname,
      port: port || undefined,
      pathname: '/assets/**',
    })
  } catch {
    // Invalid DIRECTUS_URL — skip remote images, local fallback still works.
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
}

export default nextConfig
