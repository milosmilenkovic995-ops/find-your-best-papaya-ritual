import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const adminPass = process.env.ADMIN_PASSWORD || "";
  if (!adminPass || cookieStore.get("znf_admin")?.value !== adminPass) {
    return NextResponse.redirect(new URL("/admin/v2", req.url));
  }
  if (!supabase) {
    return NextResponse.redirect(new URL("/admin/v2?reset=error", req.url));
  }

  // Only wipe v2 rows. v1 `submissions` and `events` are untouched.
  const r = await supabase.from("submissions_v2").delete().not("id", "is", null);

  if (r.error) {
    console.error("Reset v2 error:", r.error);
    return NextResponse.redirect(new URL("/admin/v2?reset=error", req.url));
  }

  return NextResponse.redirect(new URL("/admin/v2?reset=ok", req.url));
}
