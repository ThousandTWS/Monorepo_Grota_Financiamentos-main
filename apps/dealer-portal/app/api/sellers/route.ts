import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decryptSession } from "../../../../../packages/auth";
import {
  LOGISTA_SESSION_COOKIE,
  LOGISTA_SESSION_SCOPE,
  getLogistaApiBaseUrl,
  getLogistaSessionSecret,
} from "@/application/server/auth/config";

const API_BASE_URL = getLogistaApiBaseUrl();
const SESSION_SECRET = getLogistaSessionSecret();

async function resolveSession() {
  const cookieStore = await cookies();
  const encoded = cookieStore.get(LOGISTA_SESSION_COOKIE)?.value;
  const session = await decryptSession(encoded, SESSION_SECRET);
  if (!session || session.scope !== LOGISTA_SESSION_SCOPE) {
    return null;
  }
  return session;
}

function unauthorized() {
  return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
}

export async function GET() {
  try {
    const session = await resolveSession();
    if (!session) {
      return unauthorized();
    }

    const upstreamResponse = await fetch(`${API_BASE_URL}/sellers`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    });

    const payload = await upstreamResponse.json().catch(() => null);

    if (!upstreamResponse.ok) {
      const message =
        (payload as { message?: string })?.message ??
        "Não foi possível carregar os vendedores.";
      return NextResponse.json({ error: message }, {
        status: upstreamResponse.status,
      });
    }

    return NextResponse.json(payload ?? []);
  } catch (error) {
    console.error("[logista][sellers] Falha ao buscar vendedores", error);
    return NextResponse.json(
      { error: "Erro interno ao carregar vendedores." },
      { status: 500 },
    );
  }
}
