import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, unauthorizedResponse } from "../../_lib/session";
import { getAdminApiBaseUrl } from "@/application/server/auth/config";

const API_BASE_URL = getAdminApiBaseUrl();

export async function GET() {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  const upstream = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store",
  });

  const payload = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    const message = (payload as { message?: string; error?: string })?.message ?? "Falha ao carregar perfil.";
    return NextResponse.json({ error: message }, { status: upstream.status });
  }

  return NextResponse.json(payload ?? {});
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const upstream = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    const message = (payload as { message?: string; error?: string })?.message ?? "Não foi possível atualizar o perfil.";
    return NextResponse.json({ error: message }, { status: upstream.status });
  }

  return NextResponse.json(payload ?? {});
}
