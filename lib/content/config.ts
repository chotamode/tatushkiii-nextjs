/**
 * Content-layer configuration.
 *
 * The CMS is queried from the server at build / ISR time, so none of this needs
 * to be a public (NEXT_PUBLIC_*) variable. Moving to different infrastructure is
 * just changing CMS_URL — nothing in the app code hardcodes a host.
 */

const stripTrailingSlash = (value: string): string => value.replace(/\/+$/, '')

export const cmsConfig = {
  /** Base URL of the CMS, e.g. https://cms.tzhk.dev. Empty → use local fallback. */
  baseUrl: stripTrailingSlash(process.env.CMS_URL ?? ''),
  /** Which tenant's content to load. Resolve by slug, or set CMS_TENANT_ID to skip the lookup. */
  tenantSlug: (process.env.CMS_TENANT_SLUG ?? '').trim(),
  tenantId: (process.env.CMS_TENANT_ID ?? '').trim(),
  /** ISR cache window (seconds) for CMS fetches. */
  revalidateSeconds: Number(process.env.CMS_REVALIDATE_SECONDS ?? 60),
}

/** True when enough config is present to attempt a real CMS fetch. */
export const isCmsConfigured = (): boolean =>
  Boolean(cmsConfig.baseUrl && (cmsConfig.tenantSlug || cmsConfig.tenantId))
