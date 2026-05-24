import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Rate limit store ──────────────────────────────────────────
const ipMap = new Map<string, { count: number; resetAt: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipMap.entries()) {
    if (now > entry.resetAt) ipMap.delete(ip);
  }
}, 5 * 60 * 1000);

function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

function getLimitForPath(pathname: string): { limit: number; windowMs: number } {
  if (pathname.startsWith("/api/contact"))  return { limit: 5, windowMs: 60_000 };
  if (pathname.startsWith("/api/apply"))    return { limit: 5, windowMs: 60_000 };
  if (pathname.startsWith("/api/upload"))   return { limit: 5, windowMs: 60_000 };
  // removed /api/applications — it's GET only, no need to rate limit POST
  return { limit: 10, windowMs: 60_000 };
}

// ── Methods to rate limit ─────────────────────────────────────
const LIMITED_METHODS = ["POST", "PUT", "DELETE", "PATCH"];

// ── Combined middleware ───────────────────────────────────────
export default withAuth(
  function middleware(req: NextRequest) {

    // Rate limit only write requests on API routes
    if (
      req.nextUrl.pathname.startsWith("/api") &&
      LIMITED_METHODS.includes(req.method)
    ) {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";

      const { limit, windowMs } = getLimitForPath(req.nextUrl.pathname);
      const allowed = rateLimit(ip, limit, windowMs);

      if (!allowed) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    }

    // Admin routes → handled by withAuth above, just continue
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/((?!contact).*)",   
  ],
};