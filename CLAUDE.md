@AGENTS.md

# Z Natural Foods Customer Feedback Survey — Project Status

Last updated: 2026-05-25.

## What this project is

Two parallel customer-feedback surveys (v1 and v2) deployed on Vercel,
collecting structured + free-text responses into Supabase. Each respondent
can be tagged with a segment (`buyer-30`, `buyer-180`, `non-buyer`) carried
in the URL. Completing the survey grants the customer a $10 coupon
(`THANKYOU10`) that auto-applies on znaturalfoods.com's Shopify checkout.

v1 is the "reference" version (kept intact for comparison).
v2 is the **active** survey we iterate on.

## Live URLs

| Segment | v1 | v2 |
|---|---|---|
| Buyers 30 Day | https://help-us-to-serve-you-better-1.vercel.app/3 | https://help-us-to-serve-you-better-2.vercel.app/3 |
| Buyers 30-180 Day | https://help-us-to-serve-you-better-1.vercel.app/18 | https://help-us-to-serve-you-better-2.vercel.app/18 |
| Non Buyers | https://help-us-to-serve-you-better-1.vercel.app/0 | https://help-us-to-serve-you-better-2.vercel.app/0 |
| Untagged | https://help-us-to-serve-you-better-1.vercel.app/ | https://help-us-to-serve-you-better-2.vercel.app/ |

Old fallback domain still works: `find-your-best-papaya-ritual.vercel.app/`
(v1) and `.../v2` (v2).

## Admin dashboards

- v1: https://help-us-to-serve-you-better-1.vercel.app/admin → reads `submissions`
- v2: https://help-us-to-serve-you-better-2.vercel.app/admin/v2 → reads `submissions_v2`
- Password: `MilossurveyZNF1` (env var `ADMIN_PASSWORD`)

Dashboard features: segment filter pills, Completed/Partial tabs,
question-by-question breakdown, CSV download (one column per question),
Reset button (wipes that table only).

## Architecture

**One Supabase project, two tables:**
- `submissions` — v1 data (`path_id = 'main_v2'`)
- `submissions_v2` — v2 data (`path_id = 'v2'`)

Both tables share the same schema (see `supabase/partial-capture-schema.sql`
and `supabase/add-segment-column.sql`). Key columns:

- `session_id` (text, unique) — generated client-side per visit, kept in
  sessionStorage so refreshes don't break the row
- `completed` (boolean) — flips to true on final submit
- `last_step` (int) — furthest question the visitor reached
- `segment` (text) — `buyer-30` / `buyer-180` / `non-buyer` / null
- `answers` (jsonb) — array of answer objects per question
- standard fields: email, coupon_code, submitted_via, etc.

**Sticky-completion trigger** is installed on both tables — once a row's
`completed=true`, no later upsert can demote it. Protects against the
fire-and-forget race where the last partial save and the completion save
arrive out of order. See `supabase/protect-completed-trigger.sql`.

## URL → segment translation

Customer sees a bare digit in the URL (e.g. `/3`). Middleware rewrites it
to `/v2?segment=3` (or `/?segment=3` for v1 host). The page reads
`segment=3`, maps via `SEGMENT_URL_MAP` to `buyer-30`, stores that string
in the DB. So:

- URL: `/3` → DB segment: `buyer-30` → dashboard label: `Buyers 30 Day`
- URL: `/18` → DB: `buyer-180` → label: `Buyers 30-180 Day`
- URL: `/0` → DB: `non-buyer` → label: `Non Buyers`

The translation map lives in `components/MiddleSection.tsx` (v1) and
`components/MiddleSectionV2.tsx` (v2). The dashboard label map lives in
`app/admin/page.tsx` and `app/admin/v2/page.tsx` (`SEGMENT_LABELS`).

## Key files

```
app/
  page.tsx               — v1 survey entry (/ → v1 form)
  v2/page.tsx            — v2 survey entry (/v2 → v2 form)
  admin/page.tsx         — v1 dashboard
  admin/v2/page.tsx      — v2 dashboard
  api/
    subscribe/route.ts       — v1 API (POST → submissions table, upsert)
    subscribe-v2/route.ts    — v2 API (POST → submissions_v2 table, upsert)
    admin/export/route.ts    — v1 CSV export (one column per question)
    admin/export-v2/route.ts — v2 CSV export
    admin/reset{,-v2}        — wipe respective table
    admin/login + logout     — cookie-based admin auth

components/
  MiddleSection.tsx      — v1 client survey component
  MiddleSectionV2.tsx    — v2 client survey component (identical wiring, different questions)
  Header.tsx / Footer.tsx — shared

lib/
  questions.ts           — v1 question definitions + COUPON_CODE = "THANKYOU10"
  questions-v2.ts        — v2 question definitions + COUPON_CODE_V2 = "THANKYOU10"
  supabase.ts            — Supabase client (service-role key from env)

middleware.ts            — handles /3 /18 /0 path rewrites + host-based v2 routing

supabase/
  partial-capture-schema.sql   — full DROP+CREATE of both tables (DON'T re-run on prod data!)
  add-segment-column.sql       — additive: adds segment column. Safe to re-run.
  protect-completed-trigger.sql — sticky-completion trigger. Idempotent.
  v2-schema.sql                — historical (initial v2 table create)
```

## Deployment

- **GitHub** (auto-deploy source of truth):
  `milosmilenkovic995-ops/find-your-best-papaya-ritual` on `main` branch.
  Every push to `main` triggers a Vercel deploy.
- **Vercel project**: `find-your-best-papaya-ritual`
  - Aliases: `find-your-best-papaya-ritual.vercel.app` (default),
    `help-us-to-serve-you-better-1.vercel.app`,
    `help-us-to-serve-you-better-2.vercel.app`
  - Env vars (already set in Vercel dashboard):
    `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
    `ADMIN_PASSWORD`, `KLAVIYO_PRIVATE_API_KEY`, `KLAVIYO_LIST_ID`
- **Local `.env.local`** in project root has the same values for `npm run dev`.

History note: a remote Claude agent ran wild and reverted the GitHub main
branch to a pre-survey "papaya ritual quiz" state. The local feedback
survey work was preserved and re-pushed. There's a backup tag on GitHub:
`backup-2026-05-23-v1-v2-restored` and a folder copy at
`Desktop/Claude Code/find-your-best-papaya-ritual-backup-2026-05-23-restored/`.
Don't touch these unless rolling back.

## Pending / future work

- **Shopify coupon code**: `THANKYOU10` is currently the placeholder.
  When the user's mentor creates the real coupon in Shopify, swap the
  string in `lib/questions.ts` and `lib/questions-v2.ts`
  (`COUPON_CODE` and `COUPON_CODE_V2`). Single source of truth.
- **Headless storefront caveat**: znaturalfoods.com is headless Shopify
  (www.* doesn't expose `/discount/CODE`). The discount URLs go to
  `checkout.znaturalfoods.com/discount/CODE` instead. The main CTA and
  category cards on the final page use this pattern.
- **Category card slugs** (verified live):
  - `/collections/fruit-powders` (Fruit Powders)
  - `/collections/protein-powders` (Protein & Collagens)
  - `/collections/seasonings-spices` (Seasoning & Spices)

## Testing

`scripts/fire-30-tests.mjs` (when added to repo) wipes both tables and
fires 30 simulated visitors on v2: 5 full + 5 partial per segment. Use
when you want a populated dashboard for design/screenshots.

`scripts/preflight-check.mjs` (when added) verifies schema, end-to-end
write, sticky trigger, and route status. Run before a real send.

## Common operations cheat sheet

- **Change a survey question**: edit `lib/questions.ts` (v1) or
  `lib/questions-v2.ts` (v2). Build + push. No DB migration needed —
  legacy answer rows for removed questions just won't render.
- **Change visible copy**: page-level copy is in `app/page.tsx` /
  `app/v2/page.tsx` (passed as JSX props). Component-internal copy
  (CouponBox, final step, etc.) is in `components/MiddleSection*.tsx`.
- **Change segment labels in dashboard**: `SEGMENT_LABELS` map in
  `app/admin/page.tsx` and `app/admin/v2/page.tsx`. Display-only.
- **Add a new segment**:
  1. Pick a digit code, add to `SEGMENT_URL_MAP` in both
     MiddleSection components: `"99": "your-new-segment"`.
  2. Add to `KNOWN_SEGMENTS` and `SEGMENT_LABELS` in both admin pages.
  3. Add the digit to `SEGMENT_PATHS` in `middleware.ts`.
  4. No DB change needed (segment is just a text column).
- **Wipe data**: dashboard "Reset all data" button OR Supabase SQL
  `delete from submissions_v2 where id is not null;`
- **Deploy a change**: `git add -A && git commit -m "..." && git push`.
  Vercel auto-deploys in ~30s.

## Don't break these

- The Postgres trigger on both tables (race protection). It's installed
  via `supabase/protect-completed-trigger.sql`. Re-running is fine.
- The middleware matcher pattern — don't make it too greedy or you'll
  intercept API routes / static assets.
- `keepalive: true` on the survey `fetch()` calls — required so the
  final write completes even when the visitor is redirected to Shopify.

## Verifying things work after a change

Quick smoke test before declaring "done":
```bash
# Probe all six segment URLs return 200
for u in https://help-us-to-serve-you-better-{1,2}.vercel.app/{,3,18,0,admin}; do
  echo "$u → $(curl -s -o /dev/null -w "%{http_code}" "$u")"
done

# End-to-end write + read-back on v2
curl -s -X POST https://help-us-to-serve-you-better-2.vercel.app/api/subscribe-v2 \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"smoke","completed":false,"lastStep":1,"segment":"buyer-30","path":"v2","answers":[]}'
```
