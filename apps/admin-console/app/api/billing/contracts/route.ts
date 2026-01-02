import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, unauthorizedResponse } from "../../_lib/session";
import { getAdminApiBaseUrl } from "@/application/server/auth/config";

const API_BASE_URL = getAdminApiBaseUrl();

async function proxyRequest<T>(
  session: NonNullable<Awaited<ReturnType<typeof getAdminSession>>>,
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<NextResponse<T>> {
  const upstreamResponse = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store",
  });

  const payload = await upstreamResponse.json().catch(() => null);

  if (!upstreamResponse.ok) {
    const message =
      (payload as { message?: string; error?: string })?.message ??
      (payload as { error?: string })?.error ??
      "Falha ao processar a requisição.";
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
  const session = await getAdminSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const url = new URL(request.url);
  const query = url.searchParams.toString();
  const target = `${API_BASE_URL}/billing/contracts${query ? `?${query}` : ""}`;
  return proxyRequest(session, target);
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return unauthorizedResponse();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  return proxyRequest(session, `${API_BASE_URL}/billing/contracts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
