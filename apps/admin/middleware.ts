import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = new Set([
  "/",
  "/signin",
  "/cadastro",
  "/esqueci-senha",
  "/verificacao-token",
]);

const DASHBOARD_HOME = "/visao-geral";

function isPublicPath(pathname: string) {
  const normalized = pathname.toLowerCase();
  if (normalized === "/") return true;

  for (const route of PUBLIC_PATHS) {
    if (route === "/") continue;
    if (normalized === route || normalized.startsWith(`${route}/`)) {
      return true;
    }
  }

  return false;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const pathname = request.nextUrl.pathname;
  const isPublic = isPublicPath(pathname);

  if (!token && !isPublic) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isPublic && pathname !== "/") {
    return NextResponse.redirect(new URL(DASHBOARD_HOME, request.url));
  }

  if (token && pathname === "/") {
    return NextResponse.redirect(new URL(DASHBOARD_HOME, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
