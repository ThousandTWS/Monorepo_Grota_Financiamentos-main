import { NextRequest, NextResponse } from "next/server";
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

async function resolveSession() {
  const cookieStore = await cookies();
  const encodedSession = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await decryptSession(encodedSession, SESSION_SECRET);
  if (!session || session.scope !== ADMIN_SESSION_SCOPE) {
    return null;
  }
  return session;
}

function unauthorized() {
  return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
}

export async function GET(request: NextRequest) {
  try {
    const session = await resolveSession();
    if (!session) {
      return unauthorized();
    }

    const dealerId = request.nextUrl.searchParams.get("dealerId");
    const searchParams = dealerId ? `?dealerId=${dealerId}` : "";

    const upstreamResponse = await fetch(`${API_BASE_URL}/sellers${searchParams}`, {
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

export async function POST(request: NextRequest) {
  try {
    const session = await resolveSession();
    if (!session) {
      return unauthorized();
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Payload inválido." },
        { status: 400 },
      );
    }

    const upstreamResponse = await fetch(`${API_BASE_URL}/sellers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const payload = await upstreamResponse.json().catch(() => null);

    if (!upstreamResponse.ok) {
      const message =
        (payload as { message?: string })?.message ??
        "Não foi possível criar o vendedor.";
      return NextResponse.json({ error: message }, {
        status: upstreamResponse.status,
      });
    }

    return NextResponse.json(payload ?? {}, {
      status: upstreamResponse.status,
    });
  } catch (error) {
    console.error("[admin][sellers] Falha ao criar vendedor", error);
    return NextResponse.json(
      { error: "Erro interno ao criar vendedor." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await resolveSession();
    if (!session) {
      return unauthorized();
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Payload inválido." },
        { status: 400 },
      );
    }

    const { sellerId, dealerId } = body ?? {};
    if (!sellerId) {
      return NextResponse.json(
        { error: "sellerId é obrigatório." },
        { status: 400 },
      );
    }

    const upstreamResponse = await fetch(`${API_BASE_URL}/sellers/${sellerId}/dealer?dealerId=${dealerId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    });

    const payload = await upstreamResponse.json().catch(() => null);

    if (!upstreamResponse.ok) {
      const message =
        (payload as { error?: string; message?: string })?.error ??
        (payload as { error?: string; message?: string })?.message ??
        "Não foi possível atualizar o vínculo do vendedor.";
      return NextResponse.json({ error: message }, {
        status: upstreamResponse.status,
      });
    }

    return NextResponse.json(payload ?? {}, {
      status: upstreamResponse.status,
    });
  } catch (error) {
    console.error("[admin][sellers] Falha ao reatribuir vendedor", error);
    return NextResponse.json(
      { error: "Erro interno ao reatribuir vendedor." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await resolveSession();
    if (!session) {
      return unauthorized();
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "id é obrigatório." },
        { status: 400 },
      );
    }

    const upstreamResponse = await fetch(`${API_BASE_URL}/sellers/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    });

    if (upstreamResponse.status === 204) {
      return NextResponse.json({}, { status: 204 });
    }

    const payload = await upstreamResponse.json().catch(() => null);
    if (!upstreamResponse.ok) {
      const message =
        (payload as { error?: string; message?: string })?.error ??
        (payload as { error?: string; message?: string })?.message ??
        "Não foi possível remover o vendedor.";
      return NextResponse.json({ error: message }, {
        status: upstreamResponse.status,
      });
    }

    return NextResponse.json(payload ?? {}, {
      status: upstreamResponse.status,
    });
  } catch (error) {
    console.error("[admin][sellers] Falha ao remover vendedor", error);
    return NextResponse.json(
      { error: "Erro interno ao remover vendedor." },
      { status: 500 },
    );
  }
}
