import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decryptSession } from "../../../../../packages/auth";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_SCOPE,
  getAdminApiBaseUrl,
  getAdminSessionSecret,
} from "@/application/server/auth/config";

const API_BASE_URL = getAdminApiBaseUrl();
const SESSION_SECRET = getAdminSessionSecret();

export async function GET() {
  try {
    const cookieStore = await cookies();
    const encodedSession = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    const session = await decryptSession(encodedSession, SESSION_SECRET);

    if (!session || session.scope !== ADMIN_SESSION_SCOPE) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 },
      );
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
        "Falha ao carregar vendedores.";
      return NextResponse.json({ error: message }, {
        status: upstreamResponse.status,
      });
    }

    return NextResponse.json(payload ?? []);
  } catch (error) {
    console.error("[admin][sellers] Falha ao buscar vendedores", error);
    return NextResponse.json(
      { error: "Erro interno ao carregar vendedores." },
      { status: 500 },
    );
  }
}
