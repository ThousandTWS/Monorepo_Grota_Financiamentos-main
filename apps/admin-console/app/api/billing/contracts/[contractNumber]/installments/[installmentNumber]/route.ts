import { NextRequest, NextResponse } from "next/server";
import { getAdminApiBaseUrl } from "@/application/server/auth/config";
import { getAdminSession, unauthorizedResponse } from "../../../../../_lib/session";

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
  context: { params: { contractNumber?: string; installmentNumber?: string } },
) {
  const session = await getAdminSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const contractNumber = context.params.contractNumber;
  const installmentNumber = context.params.installmentNumber;

  if (!contractNumber || !installmentNumber) {
    return NextResponse.json(
      { error: "contractNumber e installmentNumber são obrigatórios." },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const upstream = await fetch(
    `${API_BASE_URL}/billing/contracts/${encodeURIComponent(contractNumber)}/installments/${encodeURIComponent(installmentNumber)}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  const payload = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    const message = extractErrorMessage(
      payload,
      "Não foi possível atualizar a parcela.",
    );
    return NextResponse.json({ error: message }, { status: upstream.status });
  }

  return NextResponse.json(payload ?? {}, { status: upstream.status });
}
