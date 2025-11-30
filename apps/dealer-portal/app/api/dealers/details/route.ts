import { NextResponse } from "next/server";
import { getLogistaSession, unauthorizedResponse } from "../../_lib/session";
import { getLogistaApiBaseUrl } from "@/application/server/auth/config";

const API_BASE_URL = getLogistaApiBaseUrl();

export async function GET() {
  const session = await getLogistaSession();
  if (!session) return unauthorizedResponse();

  const upstream = await fetch(`${API_BASE_URL}/dealers/${session.userId}/details`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store",
  });

  const payload = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    const message = (payload as { message?: string; error?: string })?.message ?? "Falha ao carregar dados do lojista.";
    return NextResponse.json({ error: message }, { status: upstream.status });
  }

  return NextResponse.json(payload ?? {});
}
