/**
 * Builds the embeddable URL for the self-hosted OpnForm booking form.
 *
 * Both values are supplied at build time via Coolify env vars (no hardcoding):
 *   NEXT_PUBLIC_OPNFORM_BASE_URL  e.g. https://opnform.tzhk.dev
 *   NEXT_PUBLIC_OPNFORM_FORM_SLUG e.g. contact-form-imvqis
 *
 * Returns null when either is missing so the UI can degrade gracefully
 * instead of rendering a broken iframe.
 */
export function getOpnFormUrl(): string | null {
  const base = process.env.NEXT_PUBLIC_OPNFORM_BASE_URL?.replace(/\/+$/, '')
  const slug = process.env.NEXT_PUBLIC_OPNFORM_FORM_SLUG?.trim()

  if (!base || !slug) return null

  return `${base}/forms/${slug}`
}
