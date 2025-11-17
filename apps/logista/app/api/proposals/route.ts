import { NextRequest, NextResponse } from "next/server";
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

const VALID_STATUSES = new Set([
  "SUBMITTED",
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

type SessionLike = Awaited<ReturnType<typeof getSession>>;

async function getSession() {
  const cookieStore = await cookies();
  const encodedSession = cookieStore.get(LOGISTA_SESSION_COOKIE)?.value;
  const session = await decryptSession(encodedSession, SESSION_SECRET);
  if (!session || session.scope !== LOGISTA_SESSION_SCOPE) {
    return null;
  }
  return session;
}

function unauthorized() {
  return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
}

async function resolveDealerId(
  session: SessionLike,
): Promise<number | null> {
  if (!session) return null;
  const headers: HeadersInit = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  const detailsResponse = await fetch(
    `${API_BASE_URL}/dealers/${session.userId}/details`,
    {
      headers,
      cache: "no-store",
    },
  );

  if (detailsResponse.ok) {
    const details = await detailsResponse.json().catch(() => null);
    const candidateId = (details as { id?: number })?.id;
    if (typeof candidateId === "number") {
      return candidateId;
    }
  }

  const listResponse = await fetch(`${API_BASE_URL}/dealers`, {
    headers,
    cache: "no-store",
  });

  if (listResponse.ok) {
    const list = (await listResponse.json().catch(() => null)) as
      | Array<{ id?: number; email?: string }>
      | null;
    if (Array.isArray(list)) {
      const match = list.find((dealer) => {
        if (!dealer?.email || !session.email) return false;
        return dealer.email.toLowerCase() === session.email.toLowerCase();
      });
      if (match?.id) {
        return match.id;
      }
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorized();
    }

    const dealerId = await resolveDealerId(session);
    if (!dealerId) {
      return NextResponse.json(
        { error: "Não foi possível identificar o lojista autenticado." },
        { status: 404 },
      );
    }

    const url = new URL(request.url);
    const status = url.searchParams.get("status")?.toUpperCase() ?? null;

    const query = new URLSearchParams();
    query.set("dealerId", String(dealerId));
    if (status && VALID_STATUSES.has(status)) {
      query.set("status", status);
    }

    const upstreamResponse = await fetch(
      `${API_BASE_URL}/proposals?${query.toString()}`,
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
        "Não foi possível carregar suas propostas.";
      return NextResponse.json({ error: message }, {
        status: upstreamResponse.status,
      });
    }

    return NextResponse.json(Array.isArray(payload) ? payload : []);
  } catch (error) {
    console.error("[logista][proposals] falha ao buscar propostas", error);
    return NextResponse.json(
      { error: "Erro interno ao carregar propostas." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorized();
    }

    const dealerId = await resolveDealerId(session);
    if (!dealerId) {
      return NextResponse.json(
        { error: "Lojista não encontrado para este usuário." },
        { status: 404 },
      );
    }

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: "Payload inválido." },
        { status: 400 },
      );
    }

    const normalizedPayload = {
      ...body,
      dealerId,
    };

    const upstreamResponse = await fetch(`${API_BASE_URL}/proposals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(normalizedPayload),
      cache: "no-store",
    });

    const payload = await upstreamResponse.json().catch(() => null);

    if (!upstreamResponse.ok) {
      const message =
        (payload as { message?: string })?.message ??
        "Não foi possível registrar a proposta.";
      return NextResponse.json(
        { error: message },
        { status: upstreamResponse.status },
      );
    }

    return NextResponse.json(payload, { status: upstreamResponse.status });
  } catch (error) {
    console.error("[logista][proposals] falha ao criar proposta", error);
    return NextResponse.json(
      { error: "Erro interno ao criar proposta." },
      { status: 500 },
    );
  }
}
