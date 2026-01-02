import { NextRequest, NextResponse } from "next/server";
import {
  getAdminSession,
  refreshAdminSession,
  unauthorizedResponse,
} from "../../../../../_lib/session";
import { getAdminApiBaseUrl } from "@/application/server/auth/config";

const API_BASE_URL = getAdminApiBaseUrl();

async function proxyRequest<T>(
  session: NonNullable<Awaited<ReturnType<typeof getAdminSession>>>,
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<NextResponse<T>> {
  const fetchWithSession = (
    activeSession: NonNullable<Awaited<ReturnType<typeof getAdminSession>>>,
  ) =>
    fetch(input, {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        Authorization: `Bearer ${activeSession.accessToken}`,
      },
      cache: "no-store",
    });

  let upstreamResponse = await fetchWithSession(session);

  if (upstreamResponse.status === 401) {
    const refreshed = await refreshAdminSession(session);
    if (refreshed) {
      upstreamResponse = await fetchWithSession(refreshed);
    }
  }

  if (upstreamResponse.status === 401) {
    return unauthorizedResponse();
  }

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

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ contractNumber: string; installmentNumber: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const params = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  return proxyRequest(
    session,
    `${API_BASE_URL}/billing/contracts/${params.contractNumber}/installments/${params.installmentNumber}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
}
