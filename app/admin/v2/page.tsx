import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { questionsV2 as questions, COUPON_CODE_V2, PATH_ID_V2 } from "@/lib/questions-v2";
import ResetButtonV2 from "./ResetButton";

export const dynamic = "force-dynamic";

type AnswerEntry = {
  questionId: string;
  questionTitle: string;
  questionType?: "multi" | "single" | "text";
  answerId?: string;
  answerLabel?: string;
  answerIds?: string[];
  answerLabels?: string[];
  freeText?: string | null;
};

type SubmissionRow = {
  id: string;
  submitted_at: string;
  email: string | null;
  klaviyo_id: string | null;
  path_id: string;
  submitted_via: string | null;
  coupon_code: string | null;
  discount_label: string | null;
  answers: unknown;
  completed?: boolean;
  last_step?: number | null;
  session_id?: string;
  segment?: string | null;
};

const KNOWN_SEGMENTS = ["buyer-30", "buyer-180", "non-buyer"] as const;
type SegmentFilter = "all" | (typeof KNOWN_SEGMENTS)[number];

// Display labels for the segment pills. The DB still stores the slug values
// above (buyer-30 etc.) — only what's shown to you in the dashboard changes.
const SEGMENT_LABELS: Record<string, string> = {
  "buyer-30": "buyers 30",
  "buyer-180": "buyers 30-180",
  "non-buyer": "non buyers",
};

export default async function AdminV2Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reset?: string; view?: string; seg?: string }>;
}) {
  const params = await searchParams;
  const view: "completed" | "partial" = params.view === "partial" ? "partial" : "completed";
  const segFilter: SegmentFilter = (KNOWN_SEGMENTS as readonly string[]).includes(params.seg || "")
    ? (params.seg as SegmentFilter)
    : "all";
  const cookieStore = await cookies();
  const adminPass = process.env.ADMIN_PASSWORD || "";
  const authed = !!adminPass && cookieStore.get("znf_admin")?.value === adminPass;

  if (!adminPass) {
    return (
      <main className="mx-auto max-w-md p-8">
        <h1 className="text-2xl font-bold">Admin dashboard not configured</h1>
        <p className="mt-2 text-gray-600">Set <code className="rounded bg-gray-100 px-1">ADMIN_PASSWORD</code> in Vercel env vars.</p>
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-center text-2xl font-bold text-slate-900">Survey Admin · v2</h1>
          <p className="mb-6 text-center text-sm text-gray-500">Enter the admin password to continue.</p>
          {params.error === "invalid" && (<div className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">Wrong password.</div>)}
          <form method="POST" action="/api/admin/login" className="space-y-3">
            <input type="password" name="password" placeholder="Password" className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600" autoFocus required />
            <button type="submit" className="w-full rounded-xl bg-green-700 px-4 py-3 font-bold text-white hover:bg-green-800">Log in</button>
          </form>
        </div>
      </main>
    );
  }

  let submissions: SubmissionRow[] = [];
  let dbError: string | null = null;
  if (supabase) {
    const { data, error } = await supabase
      .from("submissions_v2")
      .select("*")
      .order("submitted_at", { ascending: false })
      .limit(5000);
    if (error) dbError = error.message;
    else if (data) submissions = data as SubmissionRow[];
  } else {
    dbError = "Supabase not configured.";
  }

  const allInPath = submissions.filter((s) => s.path_id === PATH_ID_V2);
  // Apply segment filter to everything below this point.
  const all = segFilter === "all" ? allInPath : allInPath.filter((s) => s.segment === segFilter);
  // Counts per segment for the filter UI (always based on full set, not filtered).
  const segCounts: Record<string, number> = { all: allInPath.length };
  for (const s of KNOWN_SEGMENTS) segCounts[s] = allInPath.filter((r) => r.segment === s).length;
  const completedRows = all.filter((s) => s.completed !== false);
  const partialRows = all.filter((s) => s.completed === false);
  const completedTotal = completedRows.length;
  const partialTotal = partialRows.length;
  const allTotal = all.length;
  const completionRate = allTotal > 0 ? Math.round((completedTotal / allTotal) * 100) : 0;
  const withEmail = completedRows.filter((s) => s.email).length;
  const withoutEmail = completedTotal - withEmail;
  const emailRate = completedTotal > 0 ? Math.round((withEmail / completedTotal) * 100) : 0;

  // The dataset shown in the question-by-question breakdown depends on the active tab.
  const dataset = view === "completed" ? completedRows : partialRows;
  const datasetCount = dataset.length;

  type QStat = {
    question: typeof questions[number];
    total: number;
    counts: Map<string, number>;
    freeTexts: string[];
    textAnswers: string[];
  };
  const stats: QStat[] = questions.map((q) => ({
    question: q,
    total: 0,
    counts: new Map<string, number>((q.answers || []).map((a) => [a.id, 0])),
    freeTexts: [],
    textAnswers: [],
  }));
  const byId = new Map(stats.map((s) => [s.question.id, s]));

  for (const sub of dataset) {
    if (!Array.isArray(sub.answers)) continue;
    for (const a of sub.answers as AnswerEntry[]) {
      const stat = byId.get(a?.questionId || "");
      if (!stat) continue;
      stat.total++;
      if (stat.question.type === "text") {
        if (a.freeText && String(a.freeText).trim()) stat.textAnswers.push(String(a.freeText).trim());
        continue;
      }
      const ids = a.answerIds && a.answerIds.length > 0 ? a.answerIds : a.answerId ? [a.answerId] : [];
      for (const id of ids) {
        if (!stat.counts.has(id)) stat.counts.set(id, 0);
        stat.counts.set(id, (stat.counts.get(id) || 0) + 1);
      }
      if (a.freeText && String(a.freeText).trim()) stat.freeTexts.push(String(a.freeText).trim());
    }
  }

  const fb = completedRows.filter((s) => s.coupon_code === COUPON_CODE_V2).length;
  const fbPct = completedTotal > 0 ? Math.round((fb / completedTotal) * 100) : 0;
  const recent = dataset.slice(0, 30);


  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-extrabold tracking-wider text-green-800">VERSION 2</div>
          <h1 className="text-3xl font-bold text-slate-900">Survey Dashboard · v2</h1>
          <p className="text-sm text-gray-500">
            Live data from the v2 survey at <code className="rounded bg-gray-100 px-1">/v2</code> ·{" "}
            <a href="/admin" className="text-green-700 underline">switch to v1 dashboard</a>
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/api/admin/export-v2" className="rounded-xl bg-green-700 px-4 py-2 text-sm font-bold text-white hover:bg-green-800">Download CSV</a>
          <ResetButtonV2 />
          <form method="POST" action="/api/admin/logout">
            <button type="submit" className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400">Log out</button>
          </form>
        </div>
      </div>

      {params.reset === "ok" && (<div className="mb-6 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">✅ v2 database reset — all v2 submissions deleted.</div>)}
      {params.reset === "error" && (<div className="mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">⚠ Reset failed. Check Vercel logs.</div>)}
      {dbError && (<div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{dbError}</div>)}

      <div className="mb-4 grid gap-4 sm:grid-cols-4">
        <SummaryCard label="Completed" value={completedTotal} sub={`${completionRate}% completion rate`} highlight />
        <SummaryCard label="Partial responses" value={partialTotal} sub={partialTotal === 0 ? "—" : "in-progress / abandoned"} />
        <SummaryCard label="With email" value={withEmail} sub={`${emailRate}% of completed`} />
        <SummaryCard label="Without email" value={withoutEmail} />
      </div>

      {/* Segment filter pills — narrows everything below to one audience. */}
      <div className="mb-6">
        <div className="mb-2 text-xs font-extrabold uppercase tracking-widest text-gray-500">Filter by segment</div>
        <div className="flex flex-wrap gap-2">
          {(["all", ...KNOWN_SEGMENTS] as SegmentFilter[]).map((s) => {
            const active = s === segFilter;
            const qs = new URLSearchParams();
            if (view === "partial") qs.set("view", "partial");
            if (s !== "all") qs.set("seg", s);
            const href = qs.toString() ? `/admin/v2?${qs}` : "/admin/v2";
            const label = s === "all" ? "All segments" : (SEGMENT_LABELS[s] || s);
            return (
              <a
                key={s}
                href={href}
                className={`rounded-full border px-3 py-1 text-xs font-bold transition ${active ? "border-slate-900 bg-slate-900 text-white" : "border-gray-300 bg-white text-gray-700 hover:border-slate-900"}`}
              >
                {label} <span className={active ? "text-gray-300" : "text-gray-400"}>({segCounts[s] || 0})</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Tabs: completed vs partial — preserves the active segment filter. */}
      <div className="mb-8 flex gap-2 border-b border-gray-200">
        <a
          href={segFilter === "all" ? "/admin/v2" : `/admin/v2?seg=${segFilter}`}
          className={`-mb-px border-b-2 px-4 py-2 text-sm font-bold transition ${view === "completed" ? "border-green-700 text-green-700" : "border-transparent text-gray-500 hover:text-slate-900"}`}
        >
          Completed ({completedTotal})
        </a>
        <a
          href={segFilter === "all" ? "/admin/v2?view=partial" : `/admin/v2?view=partial&seg=${segFilter}`}
          className={`-mb-px border-b-2 px-4 py-2 text-sm font-bold transition ${view === "partial" ? "border-amber-600 text-amber-700" : "border-transparent text-gray-500 hover:text-slate-900"}`}
        >
          Partial ({partialTotal})
        </a>
      </div>

      <section className="mb-12">
        <h2 className="mb-2 text-2xl font-extrabold text-slate-900">
          {view === "completed" ? "Completed responses" : "Partial responses"} · question breakdown
        </h2>
        <p className="mb-6 text-sm text-gray-500">
          {view === "completed"
            ? "Responses from customers who reached the final step and claimed their coupon."
            : "Answers captured from visitors who started but did NOT finish the survey. Each click on “Continue” saves their progress in real time."}
          {" "}Every option is listed, even when 0 customers picked it. Multi-select percentages can sum above 100%.
        </p>

        {datasetCount === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
            {view === "completed" ? "No completed responses yet." : "No partial responses yet."}
          </div>
        )}
        <div className="space-y-5">
          {stats.map((s, qi) => {
            const q = s.question;
            const typeLabel = q.type === "multi"
              ? (q.maxSelect ? `Select up to ${q.maxSelect}` : "Select all that apply")
              : q.type === "single" ? "Pick one" : "Open text";
            const opts = q.type === "text" ? [] : (q.answers || []).map((a) => ({
              id: a.id,
              label: a.label,
              count: s.counts.get(a.id) || 0,
            })).sort((a, b) => b.count - a.count);
            return (
              <div key={q.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-1 text-[11px] font-extrabold uppercase tracking-widest text-green-700">
                  Question {qi + 1} OF {questions.length} · {typeLabel} · {s.total} response{s.total === 1 ? "" : "s"}
                </div>
                <h3 className="mb-4 text-lg font-extrabold text-slate-900 md:text-xl">{q.title}</h3>

                {q.type === "text" ? (
                  s.textAnswers.length === 0 ? (
                    <div className="text-sm text-gray-500">No written answers yet.</div>
                  ) : (
                    <ul className="space-y-2">
                      {s.textAnswers.map((t, i) => (<li key={i} className="border-l-2 border-green-600 pl-3 text-sm italic text-slate-700">&ldquo;{t}&rdquo;</li>))}
                    </ul>
                  )
                ) : (
                  <div className="space-y-2">
                    {opts.map((o) => {
                      const pct = s.total > 0 ? Math.round((o.count / s.total) * 100) : 0;
                      return <Bar key={o.id} label={o.label} count={o.count} pct={pct} />;
                    })}
                  </div>
                )}

                {q.type !== "text" && s.freeTexts.length > 0 && (
                  <div className="mt-5 rounded-xl bg-gray-50 p-4">
                    <div className="mb-2 text-xs font-extrabold uppercase tracking-wider text-gray-500">Written comments ({s.freeTexts.length})</div>
                    <ul className="space-y-2">
                      {s.freeTexts.map((t, i) => (<li key={i} className="border-l-2 border-green-600 pl-3 text-sm italic text-slate-700">&ldquo;{t}&rdquo;</li>))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {view === "completed" && (
      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-extrabold text-slate-900">Coupon issued</h2>
        <div className="rounded-2xl border-2 border-dashed border-green-700 bg-green-50 p-6">
          <div className="text-xs font-extrabold uppercase tracking-wider text-green-700">Coupon</div>
          <div className="my-1 text-3xl font-extrabold tracking-wider text-slate-900">{COUPON_CODE_V2}</div>
          <div className="mb-4 text-sm text-slate-700">$10 OFF — given to every customer who completed the v2 survey</div>
          <div className="rounded-xl bg-white p-3 text-center">
            <div className="text-3xl font-extrabold text-green-700">({fb}) {fbPct}%</div>
            <div className="text-xs text-gray-500">{fb === 1 ? "customer" : "customers"} received this code</div>
          </div>
        </div>
      </section>
      )}

      <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4 text-lg font-bold text-slate-900">
          {view === "completed" ? "Recent submissions" : "Recent partial sessions"}
        </div>
        {recent.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No data yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="px-4 py-3">When</th>
                  {view === "completed" ? (
                    <>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Coupon</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3">Reached</th>
                      <th className="px-4 py-3">Answers</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {recent.map((s) => (
                  <tr key={s.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-gray-600">{new Date(s.submitted_at).toLocaleString()}</td>
                    {view === "completed" ? (
                      <>
                        <td className="px-4 py-3 text-gray-600">{s.email || "—"}</td>
                        <td className="px-4 py-3 text-gray-600">{s.coupon_code || "—"}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-gray-600">{s.last_step ? `Q${s.last_step}` : "—"}</td>
                        <td className="px-4 py-3 text-gray-600">{Array.isArray(s.answers) ? s.answers.length : 0}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function SummaryCard({ label, value, sub, highlight }: { label: string; value: number; sub?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${highlight ? "border-green-200 bg-green-50" : "border-gray-200 bg-white"}`}>
      <div className={`text-xs uppercase tracking-wider ${highlight ? "text-green-700" : "text-gray-500"}`}>{label}</div>
      <div className={`mt-1 text-4xl font-extrabold ${highlight ? "text-green-700" : "text-slate-900"}`}>{value}</div>
      {sub && <div className={`mt-1 text-xs ${highlight ? "text-green-800" : "text-gray-500"}`}>{sub}</div>}
    </div>
  );
}

function Bar({ label, count, pct }: { label: string; count: number; pct: number }) {
  const zero = count === 0;
  return (
    <div className="flex items-center gap-3">
      <div className={`w-64 shrink-0 text-sm ${zero ? "text-gray-400" : "font-medium text-slate-800"}`}>{label}</div>
      <div className="h-6 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${zero ? "bg-gray-200" : "bg-green-600"}`} style={{ width: `${Math.max(pct, zero ? 0 : 2)}%` }} />
      </div>
      <div className={`w-24 shrink-0 text-right text-sm tabular-nums ${zero ? "text-gray-400" : "text-slate-700"}`}>
        <span className="font-bold">({count})</span> {pct}%
      </div>
    </div>
  );
}
