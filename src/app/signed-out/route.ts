import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-shared";

/**
 * Escape hatch for a session cookie that no longer resolves to a session.
 *
 * The middleware can only see whether a cookie is PRESENT — validating it needs
 * the database, which the edge runtime cannot reach. So a stale cookie used to
 * mean every page threw "Not signed in" while /signin bounced back to /, leaving
 * no reachable page at all. That is not exotic: a password reset deletes every
 * session for the account, so all the user's other devices land here.
 *
 * A route handler can delete cookies, which a server component cannot, so pages
 * send unauthenticated visitors here to be cleaned up and passed on to sign in.
 */
export function GET(req: NextRequest) {
  const next = req.nextUrl.searchParams.get("next");

  const url = req.nextUrl.clone();
  url.pathname = "/signin";
  url.search = "";
  // Only same-site paths, so this cannot be used as an open redirect.
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    url.searchParams.set("next", next);
  }

  const res = NextResponse.redirect(url);
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
