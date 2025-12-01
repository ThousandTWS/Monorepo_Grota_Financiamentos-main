/* eslint-disable turbo/no-undeclared-env-vars */
import type { SessionScope } from "../../../../../../packages/auth";

const DEFAULT_API_BASE_URL =
  process.env.ADMIN_API_BASE_URL ??
  process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ??
  process.env.NEXT_PUBLIC_URL_API ??
  "http://localhost:8080/api/v1/grota-financiamentos";

export const ADMIN_SESSION_COOKIE = "grota.admin.session";
export const ADMIN_SESSION_SCOPE: SessionScope = "admin";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export function getAdminApiBaseUrl(): string {
  return DEFAULT_API_BASE_URL;
}

export function getAdminSessionSecret(): string {
  const secret =
    process.env.ADMIN_SESSION_SECRET ??
    process.env.AUTH_SESSION_SECRET ??
    process.env.NEXT_PUBLIC_AUTH_SESSION_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "ADMIN_SESSION_SECRET (ou AUTH_SESSION_SECRET) não foi definido.",
      );
    }

    console.warn(
      "[admin][auth] ADMIN_SESSION_SECRET ausente. Usando fallback inseguro para desenvolvimento.",
    );
    return "admin-session-dev-secret";
  }

  return secret;
}
