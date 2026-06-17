import { NextResponse, type NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'

/**
 * On-demand revalidation endpoint for Directus.
 *
 * Configure a Directus Flow (trigger: items create/update/delete on the content
 * collections) with a "Webhook / Request URL" operation pointing at:
 *   POST https://<site>/api/revalidate?secret=<REVALIDATE_SECRET>
 *
 * It clears the 'content' fetch cache tag so the homepage re-fetches the latest
 * content on the next request — no full redeploy needed.
 */
export async function POST(request: NextRequest) {
  const secret =
    request.nextUrl.searchParams.get('secret') ?? request.headers.get('x-revalidate-secret')

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: 'Invalid revalidation secret' }, { status: 401 })
  }

  revalidateTag('content')
  return NextResponse.json({ ok: true, revalidated: true, now: Date.now() })
}
