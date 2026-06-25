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

  // 2. Can we reach Payload at all?
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `users API-Key ${token}`

  try {
    const pingRes = await fetch(`${base}/api`, { headers, signal: AbortSignal.timeout(8000) })
    steps.ping = { status: pingRes.status, ok: pingRes.ok }
    if (!pingRes.ok) {
      const body = await pingRes.text().catch(() => '')
      return NextResponse.json({ ok: false, error: `Payload /api responded ${pingRes.status}`, body, steps })
    }
  } catch (err) {
    steps.ping = { error: String(err) }
    return NextResponse.json({ ok: false, error: `Cannot reach Payload at ${base}`, steps })
  }

  // 3. Can we fetch the tenant?
  try {
    const tenantRes = await fetch(
      `${base}/api/tenants?where[slug][equals]=${encodeURIComponent(tenant ?? '')}&limit=1`,
      { headers, signal: AbortSignal.timeout(8000) },
    )
    const tenantJson = await tenantRes.json().catch(() => ({}))
    steps.tenant = { status: tenantRes.status, docs: tenantJson?.docs?.length ?? 0, first: tenantJson?.docs?.[0]?.slug }
    if (!tenantJson?.docs?.length) {
      return NextResponse.json({ ok: false, error: `Tenant "${tenant}" not found in Payload`, steps })
    }
  } catch (err) {
    steps.tenant = { error: String(err) }
    return NextResponse.json({ ok: false, error: 'Failed to query tenants collection', steps })
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
