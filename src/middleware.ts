import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  const isAuthRoute = path === "/login" || path === "/register";
  const isDashboardRoute = path.startsWith("/dashboard");

  // Redirect unauthenticated users from protected dashboard routes to login
  if (isDashboardRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    // Keep track of the original page to redirect back after login
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from login/register back to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If path is root '/', redirect authenticated to /dashboard, others to /login
  if (path === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*"],
};
