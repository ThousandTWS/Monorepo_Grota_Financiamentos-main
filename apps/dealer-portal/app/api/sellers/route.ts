import { NextResponse } from "next/server";
import { getLogistaApiBaseUrl } from "@/application/server/auth/config";
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

    const upstreamResponse = await fetch(
      `${API_BASE_URL}/sellers${dealerId ? `?dealerId=${dealerId}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        cache: "no-store",
      },
    );

    const payload = await upstreamResponse.json().catch(() => null);

    if (!upstreamResponse.ok) {
      const message =
        (payload as { message?: string })?.message ??
        "Não foi possível carregar os vendedores.";
      return NextResponse.json({ error: message }, {
        status: upstreamResponse.status,
      });
    }

    const list = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as { content?: unknown[] })?.content)
        ? (payload as { content: unknown[] }).content
        : [];

    if (!dealerId) {
      const derived = list.find(
        (seller: any) =>
          seller?.email &&
          session.email &&
          String(seller.email).toLowerCase() === session.email.toLowerCase(),
      ) as { dealerId?: number } | undefined;
      if (derived?.dealerId) {
        return NextResponse.json(
          list.filter((seller: any) => seller?.dealerId === derived.dealerId),
        );
      }
      return NextResponse.json([]);
    }

    return NextResponse.json(
      list.filter((seller: any) => seller?.dealerId === dealerId),
    );
  } catch (error) {
    console.error("[logista][sellers] Falha ao buscar vendedores", error);
    return NextResponse.json(
      { error: "Erro interno ao carregar vendedores." },
      { status: 500 },
    );
  }
}
