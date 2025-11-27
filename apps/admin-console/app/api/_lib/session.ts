import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decryptSession } from "../../../../../packages/auth";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_SCOPE,
  getAdminSessionSecret,
} from "@/application/server/auth/config";

const SESSION_SECRET = getAdminSessionSecret();

export type AdminSession = Awaited<ReturnType<typeof decryptSession>>;

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const encoded = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await decryptSession(encoded, SESSION_SECRET);
  if (!session || session.scope !== ADMIN_SESSION_SCOPE) {
    return null;
  }
  return session;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
}
