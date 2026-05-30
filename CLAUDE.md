@AGENTS.md

# Z Natural Foods Customer Feedback Survey — Project Status

Last updated: 2026-05-31.

## What this project is

Two parallel customer-feedback surveys (v1 and v2) deployed on Vercel,
collecting structured + free-text responses into Supabase. Each respondent
can be tagged with a segment (`buyer-30`, `buyer-180`, `non-buyer`) carried
in the URL. Completing the survey grants the customer a $10 coupon
(`THANKYOU10`) that auto-applies on znaturalfoods.com's headless Shopify
checkout.

v1 is the "reference" version (kept intact for comparison).
v2 is the **active** survey we iterate on.

Local folder: `C:\Users\Milos-PC\Desktop\Claude Code\znf-survey`
(Renamed from `find-your-best-papaya-ritual` on 2026-05-25 — only the
local folder. GitHub repo + Vercel project still use the old name as
their identifier.)
Frozen backup: `C:\Users\Milos-PC\Desktop\Claude Code\znf-survey-backup`

## Live URLs

### Surveys (what you share with customers)

URLs carry a **segment code as the path**: `/3`, `/18`, `/0`.
Middleware rewrites this to the right page + `?segment=<code>` so the
client picks it up. Customer just sees a digit in the URL.

| Segment | DB value | v1 | v2 |
|---|---|---|---|
| Buyers 30 Day | `buyer-30` | …-1.vercel.app/3 | …-2.vercel.app/3 |
| Buyers 30-180 Day | `buyer-180` | …-1.vercel.app/18 | …-2.vercel.app/18 |
| Non Buyers | `non-buyer` | …-1.vercel.app/0 | …-2.vercel.app/0 |
| Untagged | null | …-1.vercel.app/ | …-2.vercel.app/ |

Subdomain bases: `help-us-to-serve-you-better-1.vercel.app` (v1),
`help-us-to-serve-you-better-2.vercel.app` (v2).
Old fallback: `find-your-best-papaya-ritual.vercel.app/` (v1) and `/v2`.

### Email pre-fill

Append `?q1=<answer_id>` (or `&q1=...` if URL already has params) and the
survey pre-selects that answer at Q1, fires an immediate partial save
tagged with the segment, and shows Q1 with the answer highlighted (so
the customer can confirm or add a free-text comment before continuing).

Customer also gets pre-filled email: append `&email=...`.

Example email button URL: `…-2.vercel.app/3?email={{ person.email }}&q1=mostly_ok`

For multi-select prefills, use comma-separated IDs: `?q2=home_nav,cart`.

### Admin dashboards

- v1 dashboard: https://help-us-to-serve-you-better-1.vercel.app/admin
- v2 dashboard: https://help-us-to-serve-you-better-2.vercel.app/admin/v2
- Password: `MilossurveyZNF1` (env var `ADMIN_PASSWORD`)

Dashboard features:
- Summary cards: Completed / Partial / With email / Without email
- **Segment filter pills**: All segments / Buyers 30 Day / Buyers 30-180 Day / Non Buyers
- **Completed / Partial tabs** — Partial tab shows where customers
  abandoned (reached column shows Q1, Q2, …) instead of email/coupon
- Question-by-question chart breakdown with vote counts and percentages
- **CSV Download**: one column per question (NOT raw JSON), human-readable
  in Excel/Sheets, includes segment column with friendly label
- **Reset all data**: wipes that table only

## Architecture

**One Supabase project, two tables:**
- `submissions` — v1 data (`path_id = 'main_v2'`)
- `submissions_v2` — v2 data (`path_id = 'v2'`)

Both tables share the same schema. Key columns:

- `session_id` (text, unique) — generated client-side per visit, kept in
  sessionStorage so refreshes don't break the row. Cleared on completion
  so a fresh survey starts a new session.
- `completed` (boolean) — flips to true on final submit
- `last_step` (int) — furthest question the visitor reached
- `segment` (text) — `buyer-30` / `buyer-180` / `non-buyer` / null
- `answers` (jsonb) — array of answer objects per question
- standard fields: email, coupon_code, discount_label, submitted_via, etc.

**Sticky-completion trigger** is installed on both tables — once a row's
`completed=true`, no later upsert can demote it back to false (protects
against the fire-and-forget race where the final-step save and the last
partial save arrive out of order). See
`supabase/protect-completed-trigger.sql`.

## URL → segment translation

| URL path | Middleware rewrites to | DB segment value | Dashboard label |
|---|---|---|---|
| `/3` | `/?segment=3` or `/v2?segment=3` | `buyer-30` | Buyers 30 Day |
| `/18` | `/?segment=18` or `/v2?segment=18` | `buyer-180` | Buyers 30-180 Day |
| `/0` | `/?segment=0` or `/v2?segment=0` | `non-buyer` | Non Buyers |

Code translation map: `SEGMENT_URL_MAP` in `MiddleSection.tsx` and
`MiddleSectionV2.tsx`. Dashboard label map: `SEGMENT_LABELS` in
`app/admin/page.tsx` and `app/admin/v2/page.tsx`.

## Key files

```
app/
  page.tsx               — v1 survey entry (passes initialSegment prop)
  v2/page.tsx            — v2 survey entry (passes initialSegment prop)
  admin/page.tsx         — v1 dashboard
  admin/v2/page.tsx      — v2 dashboard
  api/
    subscribe/route.ts       — v1 API (upsert by session_id, segment-aware)
    subscribe-v2/route.ts    — v2 API (same)
    admin/export/route.ts    — v1 CSV export (per-question columns, friendly segment labels)
    admin/export-v2/route.ts — v2 CSV export (same)
    admin/reset{,-v2}        — wipe respective table
    admin/login + logout     — cookie-based admin auth

components/
  MiddleSection.tsx      — v1 client survey component
  MiddleSectionV2.tsx    — v2 client survey component (different questions)
  Header.tsx / Footer.tsx — shared

lib/
  questions.ts           — v1 questions + COUPON_CODE = "THANKYOU10"
  questions-v2.ts        — v2 questions + COUPON_CODE_V2 = "THANKYOU10"
  supabase.ts            — Supabase client (service-role key from env)

middleware.ts            — /3 /18 /0 path rewrites + host-based v2 routing

email-templates/         — Klaviyo HTML blocks (paste into custom HTML editor)
  v1-q1-buyers-30-day.html
  v1-q1-buyers-30-180-day.html
  v1-q1-non-buyers.html
  v2-q1-buyers-30-day.html     ← uses new card+grid look (mimics survey)
  v2-q1-buyers-30-180-day.html ← still the OLD stacked-button look (TODO)
  v2-q1-non-buyers.html        ← still the OLD stacked-button look (TODO)

supabase/
  partial-capture-schema.sql   — full DROP+CREATE of both tables (DON'T re-run on prod data!)
  add-segment-column.sql       — additive: adds segment column. Safe to re-run.
  protect-completed-trigger.sql — sticky-completion trigger. Idempotent.
  v2-schema.sql                — historical (initial v2 table create)

scripts/
  fire-30-tests.mjs      — wipes both tables + fires 30 simulated v2 visitors
                           (5 full + 5 partial per segment). Reads .env.local.

public/images/
  fruit-powders.jpg      — used on final-step category card
  protein-powders.jpg
  seasonings-spices.jpg
  (plus the original v1 papaya/logo assets)
```

## Deployment

- **GitHub** (auto-deploy source of truth):
  `milosmilenkovic995-ops/find-your-best-papaya-ritual` on `main` branch.
  Every push to `main` triggers a Vercel deploy in ~30s.
- **Vercel project**: `find-your-best-papaya-ritual`
  - Aliases:
    - `find-your-best-papaya-ritual.vercel.app` (default, kept for backwards compat)
    - `help-us-to-serve-you-better-1.vercel.app` (v1 primary)
    - `help-us-to-serve-you-better-2.vercel.app` (v2 primary)
  - Env vars (set in Vercel dashboard):
    `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
    `ADMIN_PASSWORD`, `KLAVIYO_PRIVATE_API_KEY`, `KLAVIYO_LIST_ID`
- **Local `.env.local`** in project root has the same values for `npm run dev`.

History note: a remote Claude agent reverted the GitHub main branch to a
pre-survey "papaya ritual quiz" state on 2026-05-22. The local feedback
survey work was preserved and re-pushed. Recovery points:
- Git tag `backup-2026-05-23-v1-v2-restored`
- Local folder `znf-survey-backup` (frozen snapshot of the restored state)
Don't touch these unless rolling back.

## Pending / future work

- **Shopify coupon code**: `THANKYOU10` is currently the placeholder.
  When the user's mentor creates the real coupon in Shopify, swap the
  string in `lib/questions.ts` and `lib/questions-v2.ts`
  (`COUPON_CODE` and `COUPON_CODE_V2`). Single source of truth.
- **Headless storefront caveat**: znaturalfoods.com is headless Shopify
  (www.* doesn't expose `/discount/CODE`). All discount URLs go to
  `checkout.znaturalfoods.com/discount/CODE` instead. Main CTA and
  category cards on the final page use this pattern.
- **Email templates not yet updated to the new card+grid design**:
  Only `v2-q1-buyers-30-day.html` was redesigned to mimic the in-survey
  question card (white card, 2-col grid, radio circles, optional
  textarea-look helper below). The other 5 templates still use the
  earlier stacked green-button design. Mirror the new design to:
    - `v1-q1-buyers-30-day.html`
    - `v1-q1-buyers-30-180-day.html`
    - `v1-q1-non-buyers.html`
    - `v2-q1-buyers-30-180-day.html`
    - `v2-q1-non-buyers.html`
  Use sed substitution from the v2-30-day file as a starting point.
  KEY: do NOT nest `<table>` inside `<a>` tags — Klaviyo strips them
  out. Use `<a>` with display:block, padding, border styling, and
  inline text content only (Unicode `&#9675;` for the radio circle).
- **Category card slugs** (verified live):
  - `/collections/fruit-powders`
  - `/collections/protein-powders` (label: "Protein & Collagens")
  - `/collections/seasonings-spices` (label: "Seasoning & Spices")

## Testing

`scripts/fire-30-tests.mjs` wipes both tables and fires 30 simulated v2
visitors (5 full + 5 partial per segment). Use for populating the
dashboard for demos or screenshots:
```
node scripts/fire-30-tests.mjs
```

Quick smoke test (probe all routes):
```bash
for u in https://help-us-to-serve-you-better-{1,2}.vercel.app/{,3,18,0,admin}; do
  echo "$u → $(curl -s -o /dev/null -w "%{http_code}" "$u")"
done
```

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
- **Change the coupon code**: one line in `lib/questions.ts` and one in
  `lib/questions-v2.ts` (`COUPON_CODE`/`COUPON_CODE_V2`). Everything
  downstream — coupon box display, redirect URL, admin labels — uses
  these constants.
- **Wipe data**: dashboard "Reset all data" button OR Supabase SQL
  `delete from submissions_v2 where id is not null;`
- **Deploy a change**: `git add -A && git commit -m "..." && git push`.
  Vercel auto-deploys in ~30s.

## UX details that have been deliberately set

- **Scroll behavior**: clicking Continue or Back does NOT scroll to the
  top of the page. The customer stays at their current scroll position
  while the question content swaps. (Earlier we tried sticky bottom
  buttons — user hated it. Reverted. Don't bring it back without asking.)
- **Email-prefill stays on Q1**: when the customer arrives via an
  email-click URL (e.g. `?q1=very_easy`), we pre-fill the answer and
  immediately save a partial row, but the UI **stays on Q1** so they
  can confirm, change, or add a free-text comment before continuing.
  (Earlier we auto-advanced past Q1; user wanted Q1 visible.)
- **Final step has no Back button**: only the single centered
  "Use My $10 Coupon" button. Clicking it fires the completion save
  (keepalive:true so it survives navigation) AND redirects to
  `checkout.znaturalfoods.com/discount/${COUPON}`.
- **Confetti** runs for 6 seconds when the final step appears. Subtle
  burst from both top corners.
- **3 category cards** under the final-step CTA, each linking to its
  collection on znaturalfoods.com via the same discount URL pattern.

## Don't break these

- Postgres sticky-completion trigger on both tables. Re-running the SQL
  is safe (idempotent).
- Middleware matcher pattern — don't make it too greedy or you'll
  intercept API routes / static assets.
- `keepalive: true` on the survey `fetch()` calls — required so the
  final write completes even when the visitor is redirected to Shopify.
- The session_id is unique per browser sessionStorage. Wiping it
  mid-survey would create a duplicate row.

## Verifying things work after a change

```bash
# Probe all 10 customer + admin URLs
for u in https://help-us-to-serve-you-better-{1,2}.vercel.app/{,3,18,0,admin,admin/v2}; do
  echo "$u → $(curl -s -o /dev/null -w "%{http_code}" "$u")"
done

# End-to-end write + read-back on v2
curl -s -X POST https://help-us-to-serve-you-better-2.vercel.app/api/subscribe-v2 \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"smoke","completed":false,"lastStep":1,"segment":"buyer-30","path":"v2","answers":[]}'

# Confirm the row landed
curl -s "https://kujqsxhcghtlbmlgjzoo.supabase.co/rest/v1/submissions_v2?session_id=eq.smoke&select=*" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
```
