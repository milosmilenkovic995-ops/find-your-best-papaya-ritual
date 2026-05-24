import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { questionsV2 as questions } from "@/lib/questions-v2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnswerEntry = {
  questionId: string;
  questionTitle?: string;
  questionType?: "multi" | "single" | "text";
  answerId?: string;
  answerLabel?: string;
  answerIds?: string[];
  answerLabels?: string[];
  freeText?: string | null;
};

// Friendly segment labels — match the dashboard pills so the CSV reads cleanly.
const SEGMENT_LABELS: Record<string, string> = {
  "buyer-30": "Buyers 30 Day",
  "buyer-180": "Buyers 30-180 Day",
  "non-buyer": "Non Buyers",
};

export async function GET() {
  const cookieStore = await cookies();
  const adminPass = process.env.ADMIN_PASSWORD || "";
  if (!adminPass || cookieStore.get("znf_admin")?.value !== adminPass) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!supabase) {
    return new Response("Database not configured", { status: 500 });
  }

  const { data, error } = await supabase
    .from("submissions_v2")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error || !data) {
    return new Response(error?.message || "No data", { status: 500 });
  }

  // ---------- Build the column schema ----------
  // Metadata columns first, then 2 columns per question (answer + comment).
  type Row = Record<string, string>;
  const metaHeaders = [
    "session_id",
    "submitted_at",
    "completed",
    "last_step",
    "segment",
    "email",
    "coupon_code",
    "discount_label",
    "klaviyo_id",
    "user_agent",
    "referrer",
    "ip_address",
  ];

  // For each survey question, produce: "Q1: <title>" and "Q1 comment".
  // For text-type questions there is no separate "comment" — the answer IS the
  // free-text — so we skip the comment column for those.
  const qHeaders: { id: string; answerCol: string; commentCol: string | null; type: string }[] = questions.map((q, i) => {
    const n = i + 1;
    const answerCol = `Q${n}: ${q.title}`;
    const commentCol = q.type === "text" ? null : `Q${n} comment`;
    return { id: q.id, answerCol, commentCol, type: q.type };
  });

  const allHeaders: string[] = [...metaHeaders];
  for (const q of qHeaders) {
    allHeaders.push(q.answerCol);
    if (q.commentCol) allHeaders.push(q.commentCol);
  }

  // ---------- Project each DB row into the column schema ----------
  const rows: Row[] = data.map((s: Record<string, unknown>) => {
    const row: Row = {};
    // Metadata
    row.session_id = String(s.session_id ?? "");
    row.submitted_at = s.submitted_at ? new Date(String(s.submitted_at)).toISOString() : "";
    row.completed = s.completed === true ? "TRUE" : s.completed === false ? "FALSE" : "";
    row.last_step = s.last_step != null ? String(s.last_step) : "";
    const seg = s.segment ? String(s.segment) : "";
    row.segment = SEGMENT_LABELS[seg] || seg;
    row.email = String(s.email ?? "");
    row.coupon_code = String(s.coupon_code ?? "");
    row.discount_label = String(s.discount_label ?? "");
    row.klaviyo_id = String(s.klaviyo_id ?? "");
    row.user_agent = String(s.user_agent ?? "");
    row.referrer = String(s.referrer ?? "");
    row.ip_address = String(s.ip_address ?? "");

    // Answer fields: index this submission's answers by questionId for fast lookup
    const submittedAnswers = Array.isArray(s.answers) ? (s.answers as AnswerEntry[]) : [];
    const byQid = new Map<string, AnswerEntry>();
    for (const a of submittedAnswers) if (a?.questionId) byQid.set(a.questionId, a);

    for (const q of qHeaders) {
      const a = byQid.get(q.id);
      if (!a) {
        row[q.answerCol] = "";
        if (q.commentCol) row[q.commentCol] = "";
        continue;
      }
      if (q.type === "text") {
        // Text question — the answer is the free-text.
        row[q.answerCol] = String(a.freeText ?? "").trim();
      } else if (q.type === "multi") {
        // Multi-select — join labels with semicolons (Excel-friendly).
        const labels = (a.answerLabels && a.answerLabels.length > 0)
          ? a.answerLabels
          : a.answerLabel ? [a.answerLabel] : [];
        row[q.answerCol] = labels.join("; ");
        if (q.commentCol) row[q.commentCol] = String(a.freeText ?? "").trim();
      } else {
        // Single-select.
        row[q.answerCol] = String(a.answerLabel ?? "");
        if (q.commentCol) row[q.commentCol] = String(a.freeText ?? "").trim();
      }
    }
    return row;
  });

  // ---------- CSV encoding (RFC 4180 — escape quotes by doubling them) ----------
  const escape = (val: string): string => {
    // Always wrap in quotes; safe for commas, quotes, newlines, and Excel.
    return `"${(val ?? "").replace(/"/g, '""')}"`;
  };

  const headerLine = allHeaders.map(escape).join(",");
  const bodyLines = rows.map((r) => allHeaders.map((h) => escape(r[h] ?? "")).join(","));
  // Prepend the UTF-8 BOM so Excel detects the encoding correctly.
  const csv = "﻿" + [headerLine, ...bodyLines].join("\n");

  const filename = `znf-survey-v2-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
