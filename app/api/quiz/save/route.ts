import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "db_not_configured" }, { status: 500 });
  }

  const { session_id, quiz_version, answers, email, first_name, completed } = await req.json();

  if (!session_id) {
    return NextResponse.json({ ok: false, error: "missing_session_id" }, { status: 400 });
  }

  const row: Record<string, unknown> = {
    session_id,
    quiz_version: quiz_version || "v1",
    answers: answers || {},
    updated_at: new Date().toISOString(),
  };

  if (email)                       row.email      = email;
  if (first_name)                  row.first_name = first_name;
  if (completed !== undefined)     row.completed  = completed;

  const { error } = await supabase
    .from("quiz_responses")
    .upsert(row, { onConflict: "session_id" });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
