import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decryptSession } from "../../../../../packages/auth";
import {
  LOGISTA_SESSION_COOKIE,
  LOGISTA_SESSION_SCOPE,
  getLogistaApiBaseUrl,
  getLogistaSessionSecret,
} from "@/application/server/auth/config";

const API_BASE_URL = getLogistaApiBaseUrl();
const SESSION_SECRET = getLogistaSessionSecret();

export type DealerPortalSession = Awaited<ReturnType<typeof decryptSession>>;

export async function getLogistaSession(): Promise<DealerPortalSession | null> {
  const cookieStore = await cookies();
  const encodedSession = cookieStore.get(LOGISTA_SESSION_COOKIE)?.value;
  const session = await decryptSession(encodedSession, SESSION_SECRET);

  if (!session || session.scope !== LOGISTA_SESSION_SCOPE) {
    return null;
  }

  return session;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
}

export async function resolveDealerId(
  session: DealerPortalSession,
): Promise<number | null> {
  if (!session) return null;
  const role = `${(session as { role?: string })?.role ?? ""}`.toUpperCase();
  const normalizedEmail = session.email?.toLowerCase();
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

  const matchByEmail = (payload: unknown): number | null => {
    if (!normalizedEmail || !Array.isArray(payload)) return null;
    const entry = payload.find(
      (item: any) =>
        item?.email && String(item.email).toLowerCase() === normalizedEmail,
    ) as { dealerId?: number } | undefined;
    if (entry?.dealerId) {
      return Number(entry.dealerId);
    }
    return null;
  };

  // Fallbacks for linked roles (operator / seller / manager)
  try {
    if (role === "OPERADOR") {
      const res = await fetch(`${API_BASE_URL}/operators`, {
        headers,
        cache: "no-store",
      });
      if (res.ok) {
        const payload = await res.json().catch(() => null);
        const found = matchByEmail(payload);
        if (found) return found;
      }
    } else if (role === "VENDEDOR") {
      const res = await fetch(`${API_BASE_URL}/sellers`, {
        headers,
        cache: "no-store",
      });
      if (res.ok) {
        const payload = await res.json().catch(() => null);
        const found = matchByEmail(payload);
        if (found) return found;
      }
    } else if (role === "GESTOR") {
      const res = await fetch(`${API_BASE_URL}/managers`, {
        headers,
        cache: "no-store",
      });
      if (res.ok) {
        const payload = await res.json().catch(() => null);
        const found = matchByEmail(payload);
        if (found) return found;
      }
    }
  } catch (error) {
    console.warn("[logista][session] fallback resolveDealerId falhou", error);
  }

  return null;
}
