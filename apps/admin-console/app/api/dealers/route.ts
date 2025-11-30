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

export async function GET() {
  try {
    const session = await resolveSession();
    if (!session) {
      return unauthorized();
    }

    const upstreamResponse = await fetch(`${API_BASE_URL}/dealers`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    });

    const payload = await upstreamResponse.json().catch(() => null);

    if (!upstreamResponse.ok) {
      const message =
        (payload as { message?: string; error?: string })?.message ??
        "Falha ao carregar logistas.";
      return NextResponse.json({ error: message }, {
        status: upstreamResponse.status,
      });
    }

    return NextResponse.json(payload ?? []);
  } catch (error) {
    console.error("[admin][dealers] Falha ao buscar logistas", error);
    return NextResponse.json(
      { error: "Erro interno ao carregar logistas." },
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

    const { email: rawEmail, ...rest } = body ?? {};
    const email =
      typeof rawEmail === "string" && rawEmail.trim().length > 0
        ? rawEmail.trim()
        : undefined;
    const payload = {
      ...rest,
      adminRegistration: true,
      ...(email ? { email } : {}),
    };

    const upstreamResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Endpoint é público no backend; mantemos protegido apenas pelo session check do admin.
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const responsePayload = await upstreamResponse.json().catch(() => null);

    if (!upstreamResponse.ok) {
      const message =
        (responsePayload as { message?: string; error?: string })?.message ??
        (responsePayload as { error?: string })?.error ??
        "Não foi possível criar o logista.";
      return NextResponse.json({ error: message }, {
        status: upstreamResponse.status,
      });
    }

    return NextResponse.json(responsePayload ?? {}, {
      status: upstreamResponse.status,
    });
  } catch (error) {
    console.error("[admin][dealers] Falha ao criar logista", error);
    return NextResponse.json(
      { error: "Erro interno ao criar logista." },
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
        { error: "ID do logista é obrigatório." },
        { status: 400 },
      );
    }

    const upstreamResponse = await fetch(`${API_BASE_URL}/dealers/${id}`, {
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
        (payload as { message?: string; error?: string })?.message ??
        "Não foi possível remover o logista.";
      return NextResponse.json({ error: message }, {
        status: upstreamResponse.status,
      });
    }

    return NextResponse.json(payload ?? {}, {
      status: upstreamResponse.status,
    });
  } catch (error) {
    console.error("[admin][dealers] Falha ao remover logista", error);
    return NextResponse.json(
      { error: "Erro interno ao remover logista." },
      { status: 500 },
    );
  }
}
