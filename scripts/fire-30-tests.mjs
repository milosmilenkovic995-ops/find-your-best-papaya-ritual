// Wipes both submission tables, then fires 30 simulated v2 visitors:
// 5 full + 5 partial per segment × 3 segments = 30 rows in submissions_v2.
//
// Usage (PowerShell / Bash):
//   node scripts/fire-30-tests.mjs
//
// Requires env vars (read from .env.local automatically — Next.js style):
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
// Optional:
//   SURVEY_BASE — defaults to https://help-us-to-serve-you-better-2.vercel.app
//
// Safe to run repeatedly. Wipe is destructive — review before running on
// production data. Do NOT commit secrets to the script body.

import { readFileSync, existsSync } from "node:fs";

// Crude .env.local loader so the script works without dotenv.
const envFile = new URL("../.env.local", import.meta.url);
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const SK = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPA_URL = process.env.SUPABASE_URL;
const SURVEY_BASE = process.env.SURVEY_BASE || "https://help-us-to-serve-you-better-2.vercel.app";

if (!SK || !SUPA_URL) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL env var.");
  console.error("Put them in .env.local at the project root and re-run.");
  process.exit(1);
}

const SUPA = `${SUPA_URL}/rest/v1`;
const API = `${SURVEY_BASE}/api/subscribe-v2`;

const SEGMENTS = ["buyer-30", "buyer-180", "non-buyer"];

const Q1_OPTS = [
  { id: "very_easy", label: "Very easy — everything worked smoothly" },
  { id: "mostly_ok", label: "Mostly okay, with a few small issues" },
  { id: "harder", label: "Harder than it should have been" },
  { id: "very_frustrating", label: "Very frustrating" },
  { id: "gave_up", label: "I gave up before finishing" },
];
const Q2_OPTS = [
  { id: "home_nav", label: "Homepage and navigation" },
  { id: "search_category", label: "Search or category pages" },
  { id: "product_pages", label: "Product pages" },
  { id: "cart", label: "Shopping cart" },
  { id: "login_account", label: "Login or creating an account" },
  { id: "checkout_payment", label: "Checkout and payment" },
];
const Q3_OPTS = [
  { id: "real_photos", label: "Real photos" },
  { id: "short_desc", label: "Shorter description" },
  { id: "health_benefits", label: "Health benefits" },
  { id: "how_to_use", label: "How to use" },
  { id: "comparison", label: "Comparison" },
  { id: "lab_tests", label: "Lab tests" },
];
const Q4_OPTS = [
  { id: "shipping_late", label: "Shipping shown too late" },
  { id: "forced_account", label: "Forced to create account" },
  { id: "login_broken", label: "Login didn't work" },
  { id: "too_many_fields", label: "Too many form fields" },
  { id: "discount_rewards", label: "Couldn't apply discount" },
  { id: "page_errors", label: "Page errors" },
];
const Q5_OPTS = [
  { id: "faster", label: "Make the site faster" },
  { id: "easier_find", label: "Easier to find products" },
  { id: "better_product_pages", label: "Better product pages" },
  { id: "simpler_checkout", label: "Simpler checkout" },
  { id: "fix_login", label: "Fix login" },
  { id: "mobile", label: "Better mobile" },
];

function buildAnswers(stopStep, visitorIdx) {
  const a = [];
  const q1 = Q1_OPTS[visitorIdx % Q1_OPTS.length];
  if (stopStep >= 1) a.push({
    questionId: "q1", questionTitle: "ease", questionType: "single",
    answerId: q1.id, answerLabel: q1.label,
    answerIds: [q1.id], answerLabels: [q1.label],
    freeText: visitorIdx === 0 ? `simulated visitor ${visitorIdx}` : null,
  });
  const multiPick = (pool, idx) => {
    const k = (idx % 3) + 1;
    const picks = [];
    for (let i = 0; i < k; i++) picks.push(pool[(idx + i) % pool.length]);
    return picks;
  };
  if (stopStep >= 2) {
    const p = multiPick(Q2_OPTS, visitorIdx);
    a.push({ questionId: "q2", questionTitle: "parts", questionType: "multi",
      answerId: p[0].id, answerLabel: p[0].label,
      answerIds: p.map(x => x.id), answerLabels: p.map(x => x.label), freeText: null });
  }
  if (stopStep >= 3) {
    const p = multiPick(Q3_OPTS, visitorIdx + 1);
    a.push({ questionId: "q3", questionTitle: "product page", questionType: "multi",
      answerId: p[0].id, answerLabel: p[0].label,
      answerIds: p.map(x => x.id), answerLabels: p.map(x => x.label), freeText: null });
  }
  if (stopStep >= 4) {
    const p = multiPick(Q4_OPTS, visitorIdx + 2);
    a.push({ questionId: "q4", questionTitle: "checkout", questionType: "multi",
      answerId: p[0].id, answerLabel: p[0].label,
      answerIds: p.map(x => x.id), answerLabels: p.map(x => x.label), freeText: null });
  }
  if (stopStep >= 5) {
    const p = multiPick(Q5_OPTS, visitorIdx + 3).slice(0, 3);
    a.push({ questionId: "q5", questionTitle: "fix one", questionType: "multi",
      answerId: p[0].id, answerLabel: p[0].label,
      answerIds: p.map(x => x.id), answerLabels: p.map(x => x.label), freeText: null });
  }
  return a;
}

async function post(payload) {
  const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  return r.json();
}

async function wipe() {
  for (const table of ["submissions", "submissions_v2"]) {
    const r = await fetch(`${SUPA}/${table}?id=not.is.null`, {
      method: "DELETE",
      headers: { apikey: SK, Authorization: `Bearer ${SK}`, Prefer: "return=representation" },
    });
    const arr = await r.json();
    console.log(`  ${table}: deleted ${Array.isArray(arr) ? arr.length : 0} rows`);
  }
}

async function countRows() {
  for (const table of ["submissions", "submissions_v2"]) {
    const r = await fetch(`${SUPA}/${table}?select=id`, {
      headers: { apikey: SK, Authorization: `Bearer ${SK}`, Prefer: "count=exact", Range: "0-0" },
    });
    console.log(`  ${table}: ${r.headers.get("content-range")}`);
  }
}

async function summary() {
  const r = await fetch(`${SUPA}/submissions_v2?select=segment,completed,last_step&order=submitted_at.desc`, {
    headers: { apikey: SK, Authorization: `Bearer ${SK}` },
  });
  const rows = await r.json();
  const grid = {};
  for (const s of SEGMENTS) grid[s] = { completed: 0, partial: 0, partial_steps: {} };
  for (const row of rows) {
    if (!grid[row.segment]) continue;
    if (row.completed) grid[row.segment].completed++;
    else {
      grid[row.segment].partial++;
      grid[row.segment].partial_steps[row.last_step] = (grid[row.segment].partial_steps[row.last_step] || 0) + 1;
    }
  }
  console.log(`\n  ${"Segment".padEnd(12)} | Completed | Partial | Partials by step`);
  console.log(`  ${"-".repeat(12)}-+-----------+---------+-----------------`);
  for (const s of SEGMENTS) {
    const stepsStr = Object.entries(grid[s].partial_steps).sort((a,b)=>a[0]-b[0]).map(([k,v])=>`Q${k}:${v}`).join(", ");
    console.log(`  ${s.padEnd(12)} | ${String(grid[s].completed).padStart(9)} | ${String(grid[s].partial).padStart(7)} | ${stepsStr || "—"}`);
  }
  console.log(`  Total rows in submissions_v2: ${rows.length}`);
}

(async () => {
  console.log("=== 1. Wipe both tables ===");
  await wipe();

  console.log("\n=== 2. Fire 30 simulated visitors (5 full + 5 partial × 3 segments) ===");
  let fired = 0;
  const ts = Date.now();
  for (const segment of SEGMENTS) {
    for (let i = 1; i <= 5; i++) {
      const fullSession = `sim_full_${segment}_${i}_${ts}`;
      await post({
        sessionId: fullSession, completed: true, lastStep: 6, segment,
        path: "v2", pathName: "Customer Feedback Survey v2",
        submittedVia: "skip", coupon: "THANKYOU10", discount: "$10 OFF",
        answers: buildAnswers(5, i),
        submittedAt: new Date(ts + fired * 1000).toISOString(),
      });
      fired++;

      const partSession = `sim_partial_${segment}_${i}_${ts}`;
      await post({
        sessionId: partSession, completed: false, lastStep: i, segment,
        path: "v2", pathName: "Customer Feedback Survey v2",
        answers: buildAnswers(i, i + 5),
        submittedAt: new Date(ts + fired * 1000).toISOString(),
      });
      fired++;
    }
    process.stdout.write(`  ${segment}: 5 full + 5 partial fired\n`);
  }

  console.log("\n=== 3. Verify counts ===");
  await countRows();

  console.log("\n=== 4. Per-segment / per-state summary ===");
  await summary();
})();
