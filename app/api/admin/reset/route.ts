import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const adminPass = process.env.ADMIN_PASSWORD || "";
  if (!adminPass || cookieStore.get("znf_admin")?.value !== adminPass) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  if (!supabase) {
    return NextResponse.redirect(new URL("/admin?reset=error", req.url));
  }

  // Wipe the v1 `submissions` table. The .not("id", "is", null) clause is a
  // tautology that matches every row (Supabase requires a filter to delete).
  // NOTE: the old `events` table was dropped in partial-capture-schema.sql;
  // deleting from it returned a 404 error and aborted the whole reset.
  const r = await supabase.from("submissions").delete().not("id", "is", null);

  if (r.error) {
    console.error("Reset error:", r.error);
    return NextResponse.redirect(new URL("/admin?reset=error", req.url));
  }

  return NextResponse.redirect(new URL("/admin?reset=ok", req.url));
}
