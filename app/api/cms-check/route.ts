import { NextResponse } from 'next/server'
import { payloadEnv } from '@/lib/payload'

/**
 * Diagnostic endpoint — checks the Payload CMS connection step by step.
 * Hit GET /api/cms-check to see exactly what's misconfigured.
 * No auth required (only exposes config/connectivity info, no content).
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  const { base, token, tenant } = payloadEnv()

  const steps: Record<string, unknown> = {}

  // 1. Env vars (accepts PAYLOAD_* or legacy CMS_* aliases)
  steps.env = {
    url: base || '(not set)',
    token: token ? `set (${token.slice(0, 6)}…)` : '(not set — collections must be public-readable)',
    tenant: tenant || '(not set)',
  }

  if (!base) {
    return NextResponse.json({ ok: false, error: 'PAYLOAD_URL is not set — site uses bundled fallback content', steps })
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `users API-Key ${token}`

  // 2. Hit a real collection endpoint (Payload has no bare /api route).
  // This doubles as the connectivity + auth check.
  try {
    const tenantRes = await fetch(
      `${base}/api/tenants?where[slug][equals]=${encodeURIComponent(tenant ?? '')}&limit=1&depth=0`,
      { headers, signal: AbortSignal.timeout(8000) },
    )
    const contentType = tenantRes.headers.get('content-type') ?? ''
    const isJson = contentType.includes('application/json')
    const raw = await tenantRes.text()

    if (!isJson) {
      // Got HTML instead of JSON → this URL isn't serving Payload's REST API.
      return NextResponse.json({
        ok: false,
        error: `${base}/api/tenants returned ${tenantRes.status} as ${contentType || 'unknown type'} (not JSON). This URL is probably not the Payload API, or the API base path differs.`,
        steps: { ...steps, tenants: { status: tenantRes.status, contentType, bodyStart: raw.slice(0, 120) } },
      })
    }

    const tenantJson = JSON.parse(raw)
    steps.tenants = {
      status: tenantRes.status,
      docs: tenantJson?.docs?.length ?? 0,
      first: tenantJson?.docs?.[0]?.slug,
    }
    if (tenantRes.status === 403) {
      return NextResponse.json({
        ok: false,
        error: 'Payload returned 403 — tenants collection is not public-readable. Set a CMS_TOKEN (API key) in Coolify.',
        steps,
      })
    }
    if (!tenantJson?.docs?.length) {
      return NextResponse.json({ ok: false, error: `Tenant "${tenant}" not found in Payload (check the slug)`, steps })
    }
  } catch (err) {
    steps.tenants = { error: String(err) }
    return NextResponse.json({ ok: false, error: `Cannot reach Payload API at ${base}/api/tenants`, steps })
  }

  // 4. Can we fetch content (site_texts sample)?
  try {
    const textRes = await fetch(
      `${base}/api/site_texts?locale=all&depth=0&limit=3${tenant ? `&where[tenant.slug][equals]=${encodeURIComponent(tenant)}` : ''}`,
      { headers, signal: AbortSignal.timeout(8000) },
    )
    const textJson = await textRes.json().catch(() => ({}))
    steps.site_texts = { status: textRes.status, total: textJson?.totalDocs ?? 0, sample: textJson?.docs?.slice(0, 2) }
  } catch (err) {
    steps.site_texts = { error: String(err) }
    return NextResponse.json({ ok: false, error: 'Failed to query site_texts', steps })
  }

  // 5. Settings
  try {
    const settRes = await fetch(
      `${base}/api/site_settings?limit=1${tenant ? `&where[tenant.slug][equals]=${encodeURIComponent(tenant)}` : ''}`,
      { headers, signal: AbortSignal.timeout(8000) },
    )
    const settJson = await settRes.json().catch(() => ({}))
    steps.site_settings = { status: settRes.status, found: (settJson?.docs?.length ?? 0) > 0 }
  } catch (err) {
    steps.site_settings = { error: String(err) }
  }

  return NextResponse.json({ ok: true, message: 'Payload CMS reachable and content accessible', steps })
}
