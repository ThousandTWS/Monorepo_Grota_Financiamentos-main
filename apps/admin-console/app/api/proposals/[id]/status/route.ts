import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decryptSession } from "../../../../../../../packages/auth";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_SCOPE,
  getAdminApiBaseUrl,
  getAdminSessionSecret,
} from "@/application/server/auth/config";

const API_BASE_URL = getAdminApiBaseUrl();
const SESSION_SECRET = getAdminSessionSecret();

async function resolveSession() {
  const cookieStore = await cookies();
  const encoded = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await decryptSession(encoded, SESSION_SECRET);
  if (!session || session.scope !== ADMIN_SESSION_SCOPE) {
    return null;
  }
  return session;
}

function unauthorized() {
  return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await resolveSession();
  if (!session) {
    return unauthorized();
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Payload inválido." },
      { status: 400 },
    );
  }

  const upstreamResponse = await fetch(
    `${API_BASE_URL}/proposals/${id}/status`,
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

  const payload = await upstreamResponse.json().catch(() => null);

  if (!upstreamResponse.ok) {
    const message =
      (payload as { message?: string })?.message ??
      "Não foi possível atualizar a proposta.";
    return NextResponse.json(
      { error: message },
      { status: upstreamResponse.status },
    );
  }

  return NextResponse.json(payload, { status: upstreamResponse.status });
}
