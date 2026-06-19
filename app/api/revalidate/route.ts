import { NextResponse, type NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'

/**
 * On-demand revalidation endpoint for Payload.
 *
 * Add a Payload afterChange/afterDelete hook (or webhook) on the content
 * collections that sends:
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
