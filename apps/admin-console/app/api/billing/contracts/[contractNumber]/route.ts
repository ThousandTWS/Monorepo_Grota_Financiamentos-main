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
  _request: NextRequest,
  context: { params: { contractNumber?: string } },
) {
  const session = await getAdminSession();

  const contractNumber = context.params.contractNumber;
  if (!contractNumber) {
    return NextResponse.json({ error: "contractNumber é obrigatório." }, { status: 400 });
  }

  const headers: HeadersInit = {};
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const upstream = await fetch(
    `${API_BASE_URL}/billing/contracts/${encodeURIComponent(contractNumber)}`,
    {
      headers,
      cache: "no-store",
    },
  );

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
