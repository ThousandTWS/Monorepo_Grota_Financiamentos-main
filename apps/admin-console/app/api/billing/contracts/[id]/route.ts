import { NextRequest, NextResponse } from "next/server";
import { getAdminApiBaseUrl } from "@/application/server/auth/config";
import { getAdminSession } from "../../../_lib/session";

const API_BASE_URL = getAdminApiBaseUrl();

function extractErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object") {
    const record = payload as { error?: unknown; message?: unknown };
    const message = record.error ?? record.message;
    if (message && typeof message === "string") return message;
  }
  return fallback;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();

  const resolvedParams = await context.params;
  const id = resolvedParams.id;
  
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "ID do contrato inválido." }, { status: 400 });
  }

  const headers: HeadersInit = {};
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const backendUrl = `${API_BASE_URL}/billing/contracts/${id}`;

  const upstream = await fetch(backendUrl, {
    headers,
    cache: "no-store",
  });

  const payload = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    const message = extractErrorMessage(
      payload,
      "Falha ao carregar contrato de cobrança.",
    );
    return NextResponse.json({ error: message }, { status: upstream.status });
  }

  return NextResponse.json(payload ?? {}, { status: upstream.status });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();

  const resolvedParams = await context.params;
  const id = resolvedParams.id;
  
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "ID do contrato inválido." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const backendUrl = `${API_BASE_URL}/billing/contracts/${id}`;

  const upstream = await fetch(backendUrl, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    const message = extractErrorMessage(
      payload,
      "Falha ao atualizar contrato de cobrança.",
    );
    return NextResponse.json({ error: message }, { status: upstream.status });
  }

  return NextResponse.json(payload ?? {}, { status: upstream.status });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();

  const resolvedParams = await context.params;
  const id = resolvedParams.id;
  
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "ID do contrato inválido." }, { status: 400 });
  }

  const headers: HeadersInit = {};
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const backendUrl = `${API_BASE_URL}/billing/contracts/${id}`;

  const upstream = await fetch(backendUrl, {
    method: "DELETE",
    headers,
    cache: "no-store",
  });

  if (!upstream.ok) {
    const payload = await upstream.json().catch(() => null);
    const message = extractErrorMessage(
      payload,
      "Falha ao remover contrato de cobranca.",
    );
    return NextResponse.json({ error: message }, { status: upstream.status });
  }

  return NextResponse.json({}, { status: upstream.status });
}
