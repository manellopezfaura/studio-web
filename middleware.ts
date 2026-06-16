import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const HERA_ORIGIN = "https://saas-landing-eight-theta.vercel.app";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/hera" || pathname.startsWith("/hera/")) {
    return NextResponse.rewrite(new URL(pathname + search, HERA_ORIGIN));
  }

  // Expose the pathname to the root layout so it can derive the locale
  // for <html lang> — the [locale] param isn't readable from there.
  const headers = new Headers(request.headers);
  headers.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    // Hera landing proxy: always run, including hashed assets (.js/.css/.svg…).
    "/hera/:path*",
    // Everything else — pages only: skip _next internals, API routes, and files with extension.
    "/((?!_next/|api/|.*\\..*).*)",
  ],
};
