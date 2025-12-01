import { NextResponse } from "next/server";
import {
  getLogistaApiBaseUrl,
} from "@/application/server/auth/config";
import {
  getLogistaSession,
  resolveDealerId,
  unauthorizedResponse,
} from "../_lib/session";

const API_BASE_URL = getLogistaApiBaseUrl();

export async function GET() {
  try {
    const session = await getLogistaSession();
    if (!session) {
      return unauthorizedResponse();
    }

    const dealerId = await resolveDealerId(session);
    if (!dealerId) {
      return NextResponse.json([]);
    }

    const upstreamResponse = await fetch(`${API_BASE_URL}/dealers/${dealerId}/details`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    });

    const payload = await upstreamResponse.json().catch(() => null);

    if (!upstreamResponse.ok) {
      const message =
        (payload as { message?: string })?.message ??
        "Não foi possível carregar os lojistas.";
      return NextResponse.json({ error: message }, {
        status: upstreamResponse.status,
      });
    }

    return NextResponse.json(payload ? [payload] : []);
  } catch (error) {
    console.error("[logista][dealers] Falha ao buscar lojistas", error);
    return NextResponse.json(
      { error: "Erro interno ao carregar lojistas." },
      { status: 500 },
    );
  }
}
