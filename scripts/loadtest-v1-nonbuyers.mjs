// Load/mix test: simulate ~4000 NON-BUYER recipients taking the v1 survey.
// Populates the v1 `submissions` table with a realistic completion funnel and
// weighted answer distributions, so the /admin dashboard shows what 4000 real
// non-buyer responses would look like.
//
// Usage:
//   node scripts/loadtest-v1-nonbuyers.mjs          # insert ~4000 rows
//   node scripts/loadtest-v1-nonbuyers.mjs --clean  # delete only the load-test rows
//
// Safety:
//   - Every row's session_id is prefixed "loadtest_v1_nb_" so --clean removes
//     exactly these and nothing else (real submissions are untouched).
//   - No email is set and submitted_via="skip", so NO Klaviyo profiles are created.
//   - Writes to the LIVE submissions table — run --clean before the real campaign.
//
// Reads SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local.

import { readFileSync, existsSync } from "node:fs";

const envFile = new URL("../.env.local", import.meta.url);
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const SK = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPA_URL = process.env.SUPABASE_URL;
if (!SK || !SUPA_URL) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL in .env.local");
  process.exit(1);
}
const SUPA = `${SUPA_URL}/rest/v1`;
const TABLE = "submissions";
const TAG = "loadtest_v1_nb_";
const SEGMENT = "non-buyer";

// ---- v1 questions (mirror of lib/questions.ts) ----
const Q = {
  q1: { title: "What are the biggest areas where we can improve?", type: "multi",
    opts: [
      ["quality", "Quality of product", 5], ["price", "Price", 10], ["ux", "User experience on the website", 5],
      ["checkout", "Checkout process", 3], ["payment", "Payment process", 2], ["shipping", "Shipping and delivery", 9],
      ["packaging", "Packaging", 2], ["customer_service", "Customer service", 5], ["speed", "Website speed / loading times", 4],
      ["info", "Product information and descriptions", 7], ["other", "Other (please specify)", 1],
    ] },
  q2: { title: "Which of these have made browsing our website harder for you?", type: "multi",
    opts: [
      ["slow", "Slow loading times", 7], ["navigate", "Hard to navigate between pages", 6], ["menu", "Confusing menu structure", 4],
      ["search", "Search results aren't helpful", 6], ["mobile", "Poor mobile experience", 5], ["popups", "Distracting pop-ups or banners", 4],
      ["media", "Images or videos don't load properly", 2], ["crash", "Site crashes or shows errors", 2], ["nothing", "Nothing — it works well for me", 6],
      ["other", "Other (please specify)", 1],
    ] },
  q3: { title: "What's missing or unclear on our product pages?", type: "multi",
    opts: [
      ["real_use_photos", "Photos of the product in real use", 8], ["short_desc", "A shorter, benefit-focused description as an alternative to the long one", 5],
      ["shipping_upfront", "Upfront shipping cost and delivery time", 9], ["stock", "Clear stock availability", 4], ["compare", "Easier way to compare products", 5],
      ["other", "Other (please specify)", 1],
    ] },
  q4: { title: "If you've ever started a checkout but didn't finish, what stopped you?", type: "multi",
    opts: [
      ["shipping_cost", "Shipping cost was too high", 10], ["shipping_time", "Shipping time was too long", 6], ["payment_options", "Limited payment options", 3],
      ["account", "Had to create an account", 5], ["form", "Checkout form was too long or complicated", 4], ["error", "Site crashed or had an error", 2],
      ["discount", "Couldn't apply a discount code", 4], ["not_ready", "I just wasn't ready to buy yet", 7], ["never", "I've never abandoned a checkout", 5],
      ["other", "Other (please specify)", 1],
    ] },
  q7: { title: "If there's one thing you could change about our website to make it better, what would it be?", type: "text" },
};

const FREE_TEXTS = [
  "Lower the shipping costs please.", "Make the site faster on mobile.", "Add more real product photos.",
  "Clearer info on health benefits.", "Bundle deals would be great.", "Easier to find what I need.",
  "Show stock availability upfront.", "More payment options at checkout.", "Loved the product, just pricey.",
  "Let me apply discounts more easily.",
];

const rand = (n) => Math.floor(Math.random() * n);
function weightedPick(opts) {
  const total = opts.reduce((s, o) => s + o[2], 0);
  let r = Math.random() * total;
  for (const o of opts) { r -= o[2]; if (r <= 0) return o; }
  return opts[opts.length - 1];
}
function pickMulti(opts, maxSel) {
  const k = 1 + rand(maxSel); // 1..maxSel selections
  const chosen = new Map();
  let guard = 0;
  while (chosen.size < k && guard++ < 20) { const o = weightedPick(opts); chosen.set(o[0], o); }
  return [...chosen.values()];
}
function multiAnswer(qid) {
  const q = Q[qid];
  const picks = pickMulti(q.opts, qid === "q1" ? 3 : 2);
  const hasOther = picks.some((p) => p[0] === "other");
  return {
    questionId: qid, questionTitle: q.title, questionType: "multi",
    answerId: picks[0][0], answerLabel: picks[0][1],
    answerIds: picks.map((p) => p[0]), answerLabels: picks.map((p) => p[1]),
    freeText: hasOther ? FREE_TEXTS[rand(FREE_TEXTS.length)] : null,
  };
}
function textAnswer(withText) {
  return {
    questionId: "q7", questionTitle: Q.q7.title, questionType: "text",
    answerIds: [], answerLabels: [], answerId: "", answerLabel: "",
    freeText: withText ? FREE_TEXTS[rand(FREE_TEXTS.length)] : null,
  };
}
// Build the answers array for a visitor who reached `stopStep` (1..6).
// step1=q1, step2=q2, step3=q3, step4=q4, step5=q7(text), step6=completed.
function buildAnswers(stopStep) {
  const a = [];
  if (stopStep >= 1) a.push(multiAnswer("q1"));
  if (stopStep >= 2) a.push(multiAnswer("q2"));
  if (stopStep >= 3) a.push(multiAnswer("q3"));
  if (stopStep >= 4) a.push(multiAnswer("q4"));
  if (stopStep >= 5) a.push(textAnswer(Math.random() < 0.35));
  return a;
}

// Realistic funnel for 4000 non-buyers who landed on the survey.
const FUNNEL = {
  completed: 2280,
  partial: { 1: 760, 2: 430, 3: 250, 4: 170, 5: 110 }, // by last_step reached
};

function buildRows() {
  const rows = [];
  const now = Date.now();
  const WINDOW = 1000 * 60 * 60 * 48; // spread over last 48h
  let i = 0;
  const stamp = () => new Date(now - Math.floor(Math.random() * WINDOW)).toISOString();

  for (let c = 0; c < FUNNEL.completed; c++) {
    rows.push({
      session_id: `${TAG}${i++}`, submitted_at: stamp(), completed: true, last_step: 6,
      segment: SEGMENT, path_id: "main_v2", path_name: "Customer Feedback Survey",
      submitted_via: "skip", coupon_code: "THANKYOU10", discount_label: "$10 OFF",
      answers: buildAnswers(6),
    });
  }
  for (const [stepStr, count] of Object.entries(FUNNEL.partial)) {
    const step = Number(stepStr);
    for (let p = 0; p < count; p++) {
      rows.push({
        session_id: `${TAG}${i++}`, submitted_at: stamp(), completed: false, last_step: step,
        segment: SEGMENT, path_id: "main_v2", path_name: "Customer Feedback Survey",
        submitted_via: null, coupon_code: null, discount_label: null,
        answers: buildAnswers(step),
      });
    }
  }
  return rows;
}

async function insertBatch(batch) {
  const r = await fetch(`${SUPA}/${TABLE}`, {
    method: "POST",
    headers: { apikey: SK, Authorization: `Bearer ${SK}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(batch),
  });
  if (!r.ok) { const t = await r.text(); throw new Error(`Insert failed ${r.status}: ${t.slice(0, 300)}`); }
}

async function clean() {
  const r = await fetch(`${SUPA}/${TABLE}?session_id=like.${TAG}*`, {
    method: "DELETE",
    headers: { apikey: SK, Authorization: `Bearer ${SK}`, Prefer: "return=representation,count=exact" },
  });
  const arr = await r.json().catch(() => []);
  console.log(`Deleted ${Array.isArray(arr) ? arr.length : 0} load-test rows (session_id like ${TAG}*).`);
}

// Exact row count for a PostgREST filter, via the Content-Range header.
async function countWhere(qs) {
  const r = await fetch(`${SUPA}/${TABLE}?${qs}&select=id`, {
    headers: { apikey: SK, Authorization: `Bearer ${SK}`, Prefer: "count=exact", Range: "0-0" },
  });
  return Number((r.headers.get("content-range") || "*/0").split("/")[1]) || 0;
}

async function summary() {
  // Use exact counts (PostgREST caps row reads at 1000, so never count by length).
  const total = await countWhere(`session_id=like.${TAG}*`);
  const completed = await countWhere(`session_id=like.${TAG}*&completed=eq.true`);
  const partial = total - completed;
  const byStep = {};
  for (const step of [1, 2, 3, 4, 5]) {
    byStep[step] = await countWhere(`session_id=like.${TAG}*&completed=eq.false&last_step=eq.${step}`);
  }
  // q1 distribution from a 1000-row sample (representative; full scan not needed).
  const sr = await fetch(`${SUPA}/${TABLE}?session_id=like.${TAG}*&select=answers&limit=1000`, {
    headers: { apikey: SK, Authorization: `Bearer ${SK}` },
  });
  const sample = await sr.json();
  const q1 = {};
  for (const x of sample) {
    const a = (x.answers || []).find((y) => y.questionId === "q1");
    if (a) for (const id of a.answerIds || []) q1[id] = (q1[id] || 0) + 1;
  }
  console.log(`\n=== Load-test summary (segment: non-buyer) ===`);
  console.log(`Total rows:   ${total}`);
  console.log(`Completed:    ${completed} (${((completed / total) * 100).toFixed(1)}%)`);
  console.log(`Partial:      ${partial} (${((partial / total) * 100).toFixed(1)}%)`);
  console.log(`Partial drop-off by step reached: ${Object.entries(byStep).sort((a, b) => a[0] - b[0]).map(([k, v]) => `Q${k}:${v}`).join("  ")}`);
  console.log(`\nQ1 "areas to improve" — top picks (votes, 1k-row sample):`);
  Object.entries(q1).sort((a, b) => b[1] - a[1]).slice(0, 6).forEach(([id, v]) => console.log(`  ${id.padEnd(18)} ${v}`));
}

(async () => {
  if (process.argv.includes("--clean")) { await clean(); return; }
  if (process.argv.includes("--summary")) { await summary(); return; }

  const rows = buildRows();
  console.log(`Generated ${rows.length} simulated non-buyer rows. Inserting in batches of 500...`);
  const BATCH = 500;
  for (let i = 0; i < rows.length; i += BATCH) {
    await insertBatch(rows.slice(i, i + BATCH));
    process.stdout.write(`  inserted ${Math.min(i + BATCH, rows.length)}/${rows.length}\r`);
  }
  console.log("\nInsert complete.");
  await summary();
  console.log(`\nCleanup when done:  node scripts/loadtest-v1-nonbuyers.mjs --clean`);
})();
