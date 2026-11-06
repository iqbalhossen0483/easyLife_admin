import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const hasToken = req.cookies.has("token");
  const { pathname } = req.nextUrl;

  if ((pathname.startsWith("/dashboard") || pathname === "/") && !hasToken) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  if (pathname.startsWith("/auth") && hasToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*", "/auth/:path*"],
};
