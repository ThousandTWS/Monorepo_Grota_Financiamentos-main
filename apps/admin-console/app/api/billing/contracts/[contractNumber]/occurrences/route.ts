import { NextRequest, NextResponse } from "next/server";
import { getAdminApiBaseUrl } from "@/application/server/auth/config";
import { getAdminSession, unauthorizedResponse } from "../../../../_lib/session";

const API_BASE_URL = getAdminApiBaseUrl();

function extractErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object") {
    const record = payload as { error?: unknown; message?: unknown };
    const message = record.error ?? record.message;
    if (message && typeof message === "string") return message;
  }
  return fallback;
}

export async function POST(
  request: NextRequest,
  context: { params: { contractNumber?: string } },
) {
  const session = await getAdminSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const contractNumber = context.params.contractNumber;
  if (!contractNumber) {
    return NextResponse.json({ error: "contractNumber é obrigatório." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const upstream = await fetch(
    `${API_BASE_URL}/billing/contracts/${encodeURIComponent(contractNumber)}/occurrences`,
    {
      method: "POST",
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
      "Não foi possível registrar a ocorrência.",
    );
    return NextResponse.json({ error: message }, { status: upstream.status });
  }

  return NextResponse.json(payload ?? {}, { status: upstream.status });
}
