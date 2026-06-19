import { getSiteContent } from '@/lib/payload'
import { ContentProvider } from '@/components/ContentProvider'
import PageClient from './PageClient'

// Revalidate the static render periodically; the /api/revalidate webhook
// (called by Payload on content change) refreshes it on demand via the
// 'content' cache tag.
export const revalidate = 60

export default async function HomePage() {
  const content = await getSiteContent()

  return (
    <ContentProvider content={content}>
      <PageClient />
    </ContentProvider>
  )
}
