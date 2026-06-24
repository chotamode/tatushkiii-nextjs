# Content layer

A thin **adapter between the CMS and the UI** so the site is portable: the rest
of the app depends on our own domain types, never on the CMS. Swapping the CMS
(or moving infrastructure) touches only this folder.

```
components / pages  ─►  @/lib/content  ─►  [ adapter: portfolio.ts ]  ─►  Payload REST
                         (our types)          the only Payload-aware code
```

## Files

| File | Role |
|------|------|
| `types.ts` | App-owned domain types (`PortfolioItem`, `Locale`). The contract the UI depends on. |
| `index.ts` | Public API — import from `@/lib/content`, never from the files below. |
| `config.ts` | Reads server-only env (`CMS_URL`, tenant, revalidate). |
| `portfolio.ts` | **The adapter.** Fetches Payload, maps its shape → `PortfolioItem`. Falls back to seed on any failure. |
| `portfolio.seed.ts` | Local fallback data so the site renders with no CMS at all. |

## How to use (from a Server Component)

`getPortfolio()` is server-side (ISR). Fetch in a server component and pass the
plain data down to client components as props:

```tsx
// app/page.tsx (server component)
import { getPortfolio } from '@/lib/content'
import HomePageClient from '@/components/HomePageClient'

export default async function Page() {
  const portfolio = await getPortfolio('en') // locale wired up later
  return <HomePageClient portfolio={portfolio} />
}
```

The current `app/page.tsx` is a client component; the next step is to split it
into a server wrapper (data) + a client component (interaction), then feed
`portfolio` into `PortfolioSection`.

## Configuration

Set in the environment (see `.env.example`):

```
CMS_URL=https://cms.tzhk.dev
CMS_TENANT_SLUG=tatushka      # or CMS_TENANT_ID=... to skip the lookup
CMS_REVALIDATE_SECONDS=60
```

Leave `CMS_URL` blank to run entirely on `portfolio.seed.ts` — the site works
without any CMS.

## Swapping the CMS later

1. Rewrite the body of `getPortfolio()` in `portfolio.ts` for the new backend.
2. Keep the signature and the `PortfolioItem` return type identical.
3. Done — components, pages and types are untouched.
