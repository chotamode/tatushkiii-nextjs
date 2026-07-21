import { NextResponse } from 'next/server'
import { cmsConfig, isCmsConfigured } from '@/lib/content/config'
import { getOpnFormUrl } from '@/lib/opnform'

/**
 * The booking form here is a self-hosted OpnForm iframe, not a server-side
 * send — if the OpnForm instance is down the form silently fails to submit
 * with no error visible on this site, so this check fetches the form URL
 * directly to catch that.
 */
async function checkOpnForm(): Promise<{ configured: boolean; ok: boolean }> {
  const url = getOpnFormUrl()
  if (!url) return { configured: false, ok: false }

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000), cache: 'no-store' })
    return { configured: true, ok: res.ok }
  } catch {
    return { configured: true, ok: false }
  }
}

/**
 * This site has no database of its own — when CMS_URL is unreachable it
 * silently falls back to local seed content (by design, see lib/content/README.md),
 * so a failed CMS fetch does NOT mean the site is down and must not fail this
 * check. Instead this reports cms: "reachable" | "unreachable" | "not_configured"
 * so a "reachable" keyword monitor can catch "quietly serving stale content"
 * without conflating it with a real outage.
 */
export async function GET() {
  const notifications = { opnform: await checkOpnForm() }

  if (!isCmsConfigured()) {
    return NextResponse.json({ status: 'ok', cms: 'not_configured', source: 'local_seed', notifications })
  }

  try {
    const res = await fetch(`${cmsConfig.baseUrl}/api/health`, {
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    })
    return NextResponse.json({
      status: 'ok',
      cms: res.ok ? 'reachable' : 'unreachable',
      notifications,
    })
  } catch {
    return NextResponse.json({ status: 'ok', cms: 'unreachable', notifications })
  }
}
