/**
 * Shared Payload-specific helpers used by the adapters in this folder.
 *
 * This (plus the individual adapters) is the only Payload-aware code. Keeping
 * the HTTP/tenant logic here means switching CMS touches a small, contained set
 * of files. Not re-exported from index.ts — internal to the content layer.
 */
import { cmsConfig } from './config'

// Typed explicitly so it does not rely on Next's ambient RequestInit augmentation.
type NextFetchInit = RequestInit & { next?: { revalidate?: number; tags?: string[] } }
// Time-based ISR + the 'content' cache tag, so the /api/revalidate webhook
// (POST from Payload on content change → revalidateTag('content')) refreshes
// the site on demand without waiting for the revalidate window.
const fetchInit: NextFetchInit = {
  next: { revalidate: cmsConfig.revalidateSeconds, tags: ['content'] },
}

type RawList<T> = { docs?: T[] }

/** GET `${CMS_URL}${path}` as JSON with ISR caching; throws on non-2xx. */
export async function cmsFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${cmsConfig.baseUrl}${path}`, fetchInit)
  if (!res.ok) throw new Error(`CMS fetch failed (${res.status}): ${path}`)
  return res.json() as Promise<T>
}

/** Resolve a relative CMS URL (e.g. /api/media/...) to absolute; pass through absolute URLs. */
export const absolutize = (url: string | null | undefined): string | null => {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  return `${cmsConfig.baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

/** The tenant id to scope queries by — from CMS_TENANT_ID, or resolved from the slug. */
export async function resolveTenantId(): Promise<string | null> {
  if (cmsConfig.tenantId) return cmsConfig.tenantId
  if (!cmsConfig.tenantSlug) return null
  const params = new URLSearchParams({
    'where[slug][equals]': cmsConfig.tenantSlug,
    limit: '1',
    depth: '0',
  })
  const data = await cmsFetch<RawList<{ id: string | number }>>(`/api/tenants?${params}`)
  const id = data.docs?.[0]?.id
  return id != null ? String(id) : null
}
