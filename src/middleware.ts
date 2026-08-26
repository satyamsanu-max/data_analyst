import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-shared";

/**
 * Gate every page behind a session.
 *
 * This only checks that a cookie is PRESENT — validating it needs the database,
 * which the edge runtime cannot reach. The real check is `requireUser()` in each
 * page and server action; this just avoids rendering an app shell for someone
 * who is plainly signed out.
 */
const PUBLIC_PATHS = ["/signin", "/signup", "/forgot", "/reset"];

/**
 * Never redirected, in either direction. This is the route that clears a stale
 * session cookie, so bouncing it would trap the user in a loop.
 */
const ALWAYS_ALLOW = ["/signed-out"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (ALWAYS_ALLOW.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);

  if (!hasSession && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    // Remember where they were headed so sign-in can send them back.
    if (pathname !== "/") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Note: there is deliberately NO "has a cookie, so bounce away from /signin"
  // rule here. Middleware cannot tell a valid cookie from a stale one, and a
  // stale cookie would then bounce off /signin into a page that redirects
  // straight back — a loop with no reachable sign-in form. The /signin page
  // does that check itself against the database, where it can be done correctly.

  return NextResponse.next();
}

export const config = {
  // Everything except Next internals and static files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
