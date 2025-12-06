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

function forbidden(message = "Permissão insuficiente.") {
  return NextResponse.json({ error: message }, { status: 403 });
}

async function resolveDealerId(session: SessionLike): Promise<number | null> {
  if (!session) return null;
  const headers: HeadersInit = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  // 1) Tenta pegar o dealer vinculado ao usuário autenticado
  const detailsResponse = await fetch(`${API_BASE_URL}/dealers/me/details`, {
    headers,
    cache: "no-store",
  });

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

async function resolveSeller(
  session: SessionLike,
): Promise<{ sellerId: number | null; dealerId: number | null }> {
  if (!session) {
    return { sellerId: null, dealerId: null };
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  // Lista de vendedores e tenta casar pelo email do usuário autenticado
  const sellersResponse = await fetch(`${API_BASE_URL}/sellers`, {
    headers,
    cache: "no-store",
  });

  if (sellersResponse.ok) {
    const sellers = (await sellersResponse.json().catch(() => null)) as
      | Array<{ id?: number; email?: string; dealerId?: number | null }>
      | null;

    if (Array.isArray(sellers) && session.email) {
      const match = sellers.find(
        (seller) =>
          seller.email &&
          seller.email.toLowerCase() === session.email.toLowerCase(),
      );
      if (match?.id) {
        return {
          sellerId: match.id,
          dealerId:
            typeof match.dealerId === "number" ? match.dealerId : null,
        };
      }
    }
  }

  return { sellerId: null, dealerId: null };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorized();
    }

    const resolvedDealerId = await resolveDealerId(session);
    const { dealerId: sellerDealerId } = await resolveSeller(session);
    const fallbackDealerId =
      typeof session.userId === "number"
        ? session.userId
        : Number(session.userId) || null;
    const dealerId = resolvedDealerId ?? sellerDealerId ?? fallbackDealerId;
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
    if (session.canCreate === false) {
      return forbidden("Você não tem permissão para criar propostas.");
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

    const bodyDealerId =
      typeof body.dealerId === "number"
        ? body.dealerId
        : Number(body.dealerId) || null;

    const { sellerId: matchedSellerId, dealerId: sellerDealerId } =
      await resolveSeller(session);
    const resolvedDealerId = await resolveDealerId(session);
    const fallbackDealerId =
      typeof session.userId === "number"
        ? session.userId
        : Number(session.userId) || null;

    const dealerId =
      resolvedDealerId ?? bodyDealerId ?? sellerDealerId ?? fallbackDealerId;
    if (!dealerId) {
      return NextResponse.json(
        { error: "Lojista não encontrado para este usuário." },
        { status: 404 },
      );
    }

    const bodySellerId =
      typeof body.sellerId === "number"
        ? body.sellerId
        : Number(body.sellerId) || null;

    const sellerId =
      bodySellerId ??
      matchedSellerId ??
      (typeof session.userId === "number"
        ? session.userId
        : Number(session.userId) || null);

    const normalizedPayload = {
      ...body,
      dealerId,
      sellerId,
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
