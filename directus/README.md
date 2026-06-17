# Directus CMS setup

The site fetches editable content from a self-hosted Directus instance. If
`DIRECTUS_URL` is unset (or Directus is down), it falls back to the bundled
`locales/*.json` — so nothing breaks before this is wired up.

## 1. Deploy Directus on Coolify

Add a new resource → Docker Compose, using the official Directus + Postgres
stack (https://docs.directus.io/self-hosted/docker-guide). Expose it at e.g.
`https://cms.doomp.ink`. Create an admin user.

## 2. Add languages (i18n)

Create a **`languages`** collection (Settings → Data Model) with a string
primary key `code`, and add three rows: `en`, `cs`, `ru`.
(Directus uses this for the Translations interface.)

## 3. Create the content collections

For every "translated" field below, add a **Translations** field on the
collection (interface: Translations, related to `languages`). Add a `status`
field (dropdown: `draft` / `published`) and a `sort` field where noted.

| Collection | Singleton? | Plain fields | Translated fields |
|---|---|---|---|
| `site_texts` | no | `key` (string, unique), `sort` | `value` (text) |
| `portfolio_items` | no | `image` (file), `category` (dropdown: `ornamental`,`lineWork`,`abstract`,`whipShading`,`freehand`), `status`, `sort` | `label` (string) |
| `faqs` | no | `status`, `sort` | `question` (string), `answer` (text) |
| `testimonials` | no | `author` (string), `status`, `sort` | `text` (text), `work` (string) |
| `services` | no | `price` (string), `status`, `sort` | `name` (string), `description` (text) |
| `site_settings` | **yes** | `phone`, `email`, `instagram_url`, `telegram_url`, `archive_url` (all string) | — |

The `category` values must match the keys used on the site
(`ornamental`, `lineWork`, `abstract`, `whipShading`, `freehand`).

## 4. Read access for the site

Either make the six collections **public-readable** (Settings → Roles →
Public → grant read), or create a read-only role + static token and set it as
`DIRECTUS_TOKEN`. The site only ever reads.

## 5. Seed existing content

From the repo root, with an admin token:

```bash
DIRECTUS_URL=https://cms.doomp.ink \
DIRECTUS_ADMIN_TOKEN=xxxxxxxx \
npx tsx scripts/seed-directus.ts
```

This imports all current EN/CS/RU text, the 3 FAQ/testimonial/portfolio
entries, uploads the 3 portfolio images, and fills `site_settings`.
(`services` starts empty — the client adds prices in the UI.)

## 6. Instant updates (on-demand revalidation)

Create a Directus **Flow**:
- Trigger: *Event Hook* → Action (non-blocking) → `items.create`, `items.update`,
  `items.delete` on the content collections.
- Operation: *Webhook / Request URL* →
  `POST https://<site>/api/revalidate?secret=<REVALIDATE_SECRET>`

Now any content change refreshes the site within seconds — no redeploy.

## 7. Site env (Coolify)

```
DIRECTUS_URL=https://cms.doomp.ink
DIRECTUS_TOKEN=            # optional, if collections aren't public
REVALIDATE_SECRET=<random-string>
```

`next.config.ts` derives the `next/image` remote host from `DIRECTUS_URL`
automatically.
