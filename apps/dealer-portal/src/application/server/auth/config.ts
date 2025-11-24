/* eslint-disable turbo/no-undeclared-env-vars */
import type { SessionScope } from "../../../../../../packages/auth";

const DEFAULT_API_BASE_URL =
  process.env.LOGISTA_API_BASE_URL ??
  process.env.NEXT_PUBLIC_URL_API ??
  "http://localhost:8080/api/v1/grota-financiamentos";

const DEFAULT_CLIENT_ORIGIN =
  process.env.NEXT_PUBLIC_CLIENT_URL ??
  process.env.CLIENT_APP_ORIGIN ??
  "http://localhost:3001";

const EXTRA_ALLOWED_ORIGINS =
  process.env.LOGISTA_ALLOWED_ORIGINS ??
  process.env.NEXT_PUBLIC_LOGISTA_ALLOWED_ORIGINS ??
  "";

export const LOGISTA_SESSION_COOKIE = "grota.logista.session";
export const LOGISTA_SESSION_SCOPE: SessionScope = "logista";
export const LOGISTA_SESSION_MAX_AGE = 60 * 60 * 24 * 7; 

export function getLogistaApiBaseUrl(): string {
  return DEFAULT_API_BASE_URL;
}

export function getLogistaClientOrigin(): string {
  return DEFAULT_CLIENT_ORIGIN;
}

export function getLogistaAllowedOrigins(): string[] {
  const entries = EXTRA_ALLOWED_ORIGINS.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (process.env.NODE_ENV !== "production") {
    return Array.from(
      new Set([
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        DEFAULT_CLIENT_ORIGIN,
        ...entries,
      ]),
    );
  }

  return Array.from(new Set([DEFAULT_CLIENT_ORIGIN, ...entries]));
}

export function getLogistaSessionSecret(): string {
  const secret =
    process.env.LOGISTA_SESSION_SECRET ??
    process.env.AUTH_SESSION_SECRET ??
    process.env.NEXT_PUBLIC_AUTH_SESSION_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "LOGISTA_SESSION_SECRET (ou AUTH_SESSION_SECRET) não foi definido no ambiente.",
      );
    }

    console.warn(
      "[logista][auth] LOGISTA_SESSION_SECRET ausente. Usando fallback inseguro para desenvolvimento.",
    );
    return "logista-session-dev-secret";
  }

  return secret;
}
