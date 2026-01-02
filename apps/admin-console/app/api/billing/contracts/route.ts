import { NextRequest, NextResponse } from "next/server";
import { getAdminApiBaseUrl } from "@/application/server/auth/config";
import { getAdminSession, unauthorizedResponse } from "../../_lib/session";

const API_BASE_URL = getAdminApiBaseUrl();

function buildActorHeader(session: Awaited<ReturnType<typeof getAdminSession>>) {
  if (!session) return null;
  const role = session.role?.trim() || "ADMIN";
  const subject =
    session.fullName?.trim() ||
    session.email?.trim() ||
    (typeof session.userId === "number" ? `Usuário ${session.userId}` : "Usuário desconhecido");
  return `${role.toUpperCase()} - ${subject}`;
}

function buildQueryString(url: URL) {
  const params = new URLSearchParams();
  const name = url.searchParams.get("name");
  const document = url.searchParams.get("document");
  const contractNumber = url.searchParams.get("contractNumber");
  const status = url.searchParams.get("status");

  if (name) params.set("name", name);
  if (document) params.set("document", document);
  if (contractNumber) params.set("contractNumber", contractNumber);
  if (status) params.set("status", status);

  const query = params.toString();
  return query ? `?${query}` : "";
}

function extractErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object") {
    const record = payload as { error?: unknown; message?: unknown };
    const message = record.error ?? record.message;
    if (message && typeof message === "string") return message;
  }
  return fallback;
}

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const url = new URL(request.url);
  const query = buildQueryString(url);

  const upstream = await fetch(`${API_BASE_URL}/billing/contracts${query}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store",
  });

  const payload = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    const message = extractErrorMessage(
      payload,
      "Falha ao carregar contratos de cobrança.",
    );
    return NextResponse.json({ error: message }, { status: upstream.status });
  }

  return NextResponse.json(payload ?? [], { status: upstream.status });
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

  const actorHeader = buildActorHeader(session);

  const upstream = await fetch(`${API_BASE_URL}/billing/contracts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
      ...(actorHeader ? { "X-Actor": actorHeader } : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    const message = extractErrorMessage(
      payload,
      "Não foi possível criar o contrato de cobrança.",
    );
    return NextResponse.json({ error: message }, { status: upstream.status });
  }

  return NextResponse.json(payload ?? {}, { status: upstream.status });
}
