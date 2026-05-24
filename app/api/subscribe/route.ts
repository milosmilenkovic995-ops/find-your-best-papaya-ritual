import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const headers = req.headers;

    // sessionId is required for partial-capture upsert.
    // Without it we can't dedupe; reject so we don't create duplicate rows.
    const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing sessionId" },
        { status: 400 }
      );
    }

    const completed = body.completed === true;

    const row = {
      session_id: sessionId,
      submitted_at: body.submittedAt || new Date().toISOString(),
      completed,
      last_step: typeof body.lastStep === "number" ? body.lastStep : null,
      segment: typeof body.segment === "string" && body.segment.trim() ? body.segment.trim() : null,
      email: completed ? body.email || null : null,
      klaviyo_id: body.klid || null,
      path_id: body.path || "main_v2",
      path_name: body.pathName || null,
      submitted_via: completed ? body.submittedVia || null : null,
      coupon_code: completed ? body.coupon || null : null,
      discount_label: completed ? body.discount || null : null,
      sorting_answer_id: body.sorting?.answerId || null,
      sorting_answer_label: body.sorting?.answerLabel || null,
      sorting_free_text: body.sorting?.freeText || null,
      answers: body.answers || [],
      user_agent: headers.get("user-agent") || null,
      referrer: headers.get("referer") || null,
      ip_address:
        headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headers.get("x-real-ip") ||
        null,
    };

    if (supabase) {
      const { error } = await supabase
        .from("submissions")
        .upsert(row, { onConflict: "session_id" });
      if (error) console.error("Supabase upsert error:", error);
    } else {
      console.log("Supabase not configured. Payload:", JSON.stringify(row).slice(0, 500));
    }

    // Klaviyo subscribe only happens on COMPLETED submits with an email.
    const klaviyoKey = process.env.KLAVIYO_PRIVATE_API_KEY;
    const klaviyoList = process.env.KLAVIYO_LIST_ID;
    if (completed && body.email && body.submittedVia === "email" && klaviyoKey && klaviyoList) {
      try {
        await fetch(
          "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/",
          {
            method: "POST",
            headers: {
              Authorization: `Klaviyo-API-Key ${klaviyoKey}`,
              accept: "application/json",
              "Content-Type": "application/json",
              revision: "2026-01-15",
            },
            body: JSON.stringify({
              data: {
                type: "profile-subscription-bulk-create-job",
                attributes: {
                  profiles: {
                    data: [
                      {
                        type: "profile",
                        attributes: {
                          email: body.email,
                          subscriptions: {
                            email: { marketing: { consent: "SUBSCRIBED" } },
                          },
                        },
                      },
                    ],
                  },
                },
                relationships: {
                  list: { data: { type: "list", id: klaviyoList } },
                },
              },
            }),
          }
        );
      } catch (err) {
        console.warn("Klaviyo subscribe error (non-blocking):", err);
      }
    }

    return NextResponse.json({ success: true, sessionId, completed });
  } catch (error) {
    console.error("Subscribe API error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
