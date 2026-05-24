import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Hostname-based routing so the two custom Vercel subdomains each
// serve a specific survey at their root path:
//   help-us-to-serve-you-better-1.vercel.app/  ->  /  (v1)
//   help-us-to-serve-you-better-2.vercel.app/  ->  /v2 (v2 served at /)
//
// The original find-your-best-papaya-ritual.vercel.app and any other
// host pass through unchanged.

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase();
  const url = req.nextUrl.clone();

  // Survey 2 alias: serve v2 at the root.
  if (host.startsWith("help-us-to-serve-you-better-2")) {
    if (url.pathname === "/" || url.pathname === "") {
      url.pathname = "/v2";
      return NextResponse.rewrite(url);
    }
  }

  // Survey 1 alias: root already serves v1, nothing to rewrite.
  // (Keeps /admin and other paths reachable from the same host.)
  return NextResponse.next();
}

export const config = {
  // Skip Next internals + static + api routes so they always behave normally.
  matcher: ["/((?!_next/|favicon\\.ico|.*\\.[a-zA-Z0-9]+$|api/).*)"],
};
