import { NextRequest, NextResponse } from "next/server";
import { getAdminApiBaseUrl } from "@/application/server/auth/config";
import { getAdminSession } from "../../../../../../_lib/session";


const API_BASE_URL = getAdminApiBaseUrl();

function extractErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object") {
    const record = payload as { error?: unknown; message?: unknown };
    const message = record.error ?? record.message;
    if (message && typeof message === "string") return message;
  }
  return fallback;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; installmentNumber: string }> },
) {
  const session = await getAdminSession();

  const resolvedParams = await context.params;
  const id = resolvedParams.id;
  const installmentNumber = resolvedParams.installmentNumber;
  
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "ID do contrato inválido." }, { status: 400 });
  }
  
  if (!installmentNumber || isNaN(Number(installmentNumber))) {
    return NextResponse.json({ error: "Número da parcela inválido." }, { status: 400 });
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

  const backendUrl = `${API_BASE_URL}/billing/contracts/${id}/installments/${installmentNumber}/due-date`;

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
      "Falha ao atualizar data de vencimento.",
    );
    return NextResponse.json({ error: message }, { status: upstream.status });
  }

  return NextResponse.json(payload ?? {}, { status: upstream.status });
}
