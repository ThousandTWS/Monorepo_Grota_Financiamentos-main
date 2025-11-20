import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decryptSession } from "../../../../../packages/auth";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_SCOPE,
  getAdminApiBaseUrl,
  getAdminSessionSecret,
} from "@/application/server/auth/config";

const API_BASE_URL = getAdminApiBaseUrl();
const SESSION_SECRET = getAdminSessionSecret();

async function resolveSession() {
  const cookieStore = await cookies();
  const encoded = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await decryptSession(encoded, SESSION_SECRET);
  if (!session || session.scope !== ADMIN_SESSION_SCOPE) {
    return null;
  }
  return session;
}

function unauthorized() {
  return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
}

async function proxyRequest<T>(
  session: Awaited<ReturnType<typeof resolveSession>>,
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<NextResponse<T>> {
  const upstreamResponse = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${session!.accessToken}`,
    },
    cache: "no-store",
  });

  const payload = await upstreamResponse.json().catch(() => null);

  if (!upstreamResponse.ok) {
    const message =
      (payload as { message?: string })?.message ?? "Falha ao processar a requisição.";
    return NextResponse.json(
      { error: message } as unknown as T,
      { status: upstreamResponse.status },
    );
  }

  return NextResponse.json(payload ?? ({} as T), {
    status: upstreamResponse.status,
  });
}

export async function GET(request: NextRequest) {
  const session = await resolveSession();
  if (!session) {
    return unauthorized();
  }

  const url = new URL(request.url);
  const query = url.searchParams.toString();
  const target = `${API_BASE_URL}/proposals${query ? `?${query}` : ""}`;
  return proxyRequest(session, target);
}

export async function POST(request: NextRequest) {
  const session = await resolveSession();
  if (!session) {
    return unauthorized();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Payload inválido." },
      { status: 400 },
    );
  }

  return proxyRequest(session, `${API_BASE_URL}/proposals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
