import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptSession } from "../../packages/auth/src";
import {
  LOGISTA_SESSION_COOKIE,
  LOGISTA_SESSION_SCOPE,
  getLogistaClientOrigin,
  getLogistaSessionSecret,
} from "./src/application/server/auth/config";

const SESSION_SECRET = getLogistaSessionSecret();

function buildRedirectResponse(url: string, request: NextRequest) {
  try {
    const target = url.startsWith("http")
      ? new URL(url)
      : new URL(url, request.url);
    return NextResponse.redirect(target);
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export async function middleware(request: NextRequest) {
  const sessionValue = request.cookies.get(LOGISTA_SESSION_COOKIE)?.value;
  const session = await decryptSession(sessionValue, SESSION_SECRET);
  const isAuthenticated =
    !!session && session.scope === LOGISTA_SESSION_SCOPE && !!session.userId;
  const pathname = request.nextUrl.pathname;

  if (!isAuthenticated) {
    const loginFallback = getLogistaClientOrigin();
    return buildRedirectResponse(loginFallback, request);
  }

  if (isAuthenticated && pathname === "/") {
    return buildRedirectResponse("/simulacao/novo", request);
  }

  // PERMISSÕES: Todos os usuários autenticados (VENDEDOR, OPERADOR, ADMIN)
  // podem acessar todas as rotas, incluindo criação de fichas (/simulacao/novo)
  // Não há restrição por role neste middleware
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
