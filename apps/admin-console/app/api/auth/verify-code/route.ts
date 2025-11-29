import { NextRequest, NextResponse } from "next/server";
import { getAdminApiBaseUrl } from "@/application/server/auth/config";

const API_BASE_URL = getAdminApiBaseUrl();

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body?.email || !body?.code) {
      return NextResponse.json(
        { error: "E-mail e código são obrigatórios." },
        { status: 400 },
      );
    }

    const upstreamResponse = await fetch(`${API_BASE_URL}/auth/verify-code`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const payload = await upstreamResponse.json().catch(() => null);

    if (!upstreamResponse.ok) {
      const message =
        (payload as { error?: string; message?: string })?.error ??
        (payload as { error?: string; message?: string })?.message ??
        "Não foi possível verificar o código.";
      return NextResponse.json({ error: message }, {
        status: upstreamResponse.status,
      });
    }

    return NextResponse.json(payload ?? { ok: true });
  } catch (error) {
    console.error("[admin][auth][verify-code] falha ao verificar código", error);
    return NextResponse.json(
      { error: "Erro interno ao verificar código." },
      { status: 500 },
    );
  }
}
