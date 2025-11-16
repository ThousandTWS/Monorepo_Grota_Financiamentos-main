import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptSession } from "../../packages/auth";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_SCOPE,
  getAdminSessionSecret,
} from "@/application/server/auth/config";

const SESSION_SECRET = getAdminSessionSecret();
const PUBLIC_ROUTES = ["/", "/cadastro", "/esqueci-senha", "/verificacao-token"];
const DASHBOARD_ROUTE = "/visao-geral";

function isPublicPath(pathname: string) {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function middleware(request: NextRequest) {
  const sessionValue = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await decryptSession(sessionValue, SESSION_SECRET);
  const isAuthenticated =
    !!session && session.scope === ADMIN_SESSION_SCOPE && !!session.userId;

  const pathname = request.nextUrl.pathname;
  const publicRoute = isPublicPath(pathname);

  if (!isAuthenticated && !publicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAuthenticated && publicRoute) {
    return NextResponse.redirect(new URL(DASHBOARD_ROUTE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
