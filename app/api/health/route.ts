import { NextResponse } from 'next/server'
import { cmsConfig, isCmsConfigured } from '@/lib/content/config'

/**
 * This site has no database of its own — when CMS_URL is unreachable it
 * silently falls back to local seed content (by design, see lib/content/README.md),
 * so a failed CMS fetch does NOT mean the site is down and must not fail this
 * check. Instead this reports cms: "reachable" | "unreachable" | "not_configured"
 * so a "reachable" keyword monitor can catch "quietly serving stale content"
 * without conflating it with a real outage.
 */
export async function GET() {
  if (!isCmsConfigured()) {
    return NextResponse.json({ status: 'ok', cms: 'not_configured', source: 'local_seed' })
  }

  try {
    const res = await fetch(`${cmsConfig.baseUrl}/api/health`, {
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    })
    return NextResponse.json({
      status: 'ok',
      cms: res.ok ? 'reachable' : 'unreachable',
    })
  } catch {
    return NextResponse.json({ status: 'ok', cms: 'unreachable' })
  }
}
