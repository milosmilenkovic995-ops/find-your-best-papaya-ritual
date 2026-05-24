import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Path-based segment codes the customer sees in the URL:
//   /3   -> buyer-30
//   /18  -> buyer-180
//   /0   -> non-buyer
// The middleware rewrites these to the right page (/ for v1, /v2 for v2)
// and tacks on ?segment=<code> so the server component picks it up.
// Customer's browser bar STAYS on /3 — they never see the word "segment".
const SEGMENT_PATHS = new Set(["3", "18", "0"]);

// Hostname-based routing for the two custom subdomains:
//   help-us-to-serve-you-better-1.vercel.app/  -> /  (v1)
//   help-us-to-serve-you-better-2.vercel.app/  -> /v2 (v2 served at /)
// Original find-your-best-papaya-ritual.vercel.app and any other host
// pass through unchanged.

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase();
  const url = req.nextUrl.clone();
  const bare = url.pathname.replace(/^\/+|\/+$/g, ""); // strip slashes

  const onV2Host = host.startsWith("help-us-to-serve-you-better-2");

  // 1) Segment code path: /3, /18, /0  →  serve the right survey + tag it
  if (SEGMENT_PATHS.has(bare)) {
    url.searchParams.set("segment", bare);
    url.pathname = onV2Host ? "/v2" : "/";
    return NextResponse.rewrite(url);
  }

  // 2) v2 host root → serve /v2 (existing behavior)
  if (onV2Host && bare === "") {
    url.pathname = "/v2";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals + static + api routes so they always behave normally.
  matcher: ["/((?!_next/|favicon\\.ico|.*\\.[a-zA-Z0-9]+$|api/).*)"],
};
