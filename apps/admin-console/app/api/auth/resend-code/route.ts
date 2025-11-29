import { NextRequest, NextResponse } from "next/server";
import { getAdminApiBaseUrl } from "@/application/server/auth/config";

const API_BASE_URL = getAdminApiBaseUrl();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body?.email) {
      return NextResponse.json(
        { error: "E-mail é obrigatório." },
        { status: 400 },
      );
    }

    const upstreamResponse = await fetch(`${API_BASE_URL}/auth/resend-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const payload = await upstreamResponse.json().catch(() => null);

    if (!upstreamResponse.ok) {
      const message =
        (payload as { error?: string; message?: string })?.error ??
        (payload as { error?: string; message?: string })?.message ??
        "Não foi possível reenviar o código.";
      return NextResponse.json({ error: message }, {
        status: upstreamResponse.status,
      });
    }

    return NextResponse.json(payload ?? { ok: true });
  } catch (error) {
    console.error("[admin][auth][resend-code] falha ao reenviar código", error);
    return NextResponse.json(
      { error: "Erro interno ao reenviar código." },
      { status: 500 },
    );
  }
}
