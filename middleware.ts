import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const HERA_ORIGIN = "https://saas-landing-eight-theta.vercel.app";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/hera" || pathname.startsWith("/hera/")) {
    return NextResponse.rewrite(new URL(pathname, HERA_ORIGIN));
  }
}

export const config = {
  matcher: ["/hera", "/hera/:path*"],
};
