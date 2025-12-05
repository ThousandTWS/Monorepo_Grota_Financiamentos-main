import { type Page } from "@playwright/test";
import {
  encryptSession,
  type SessionPayload,
} from "../../../../packages/auth/src";

const ADMIN_COOKIE_NAME = "grota.admin.session";

const buildDefaultPayload = (
  overrides?: Partial<SessionPayload>,
): SessionPayload => ({
  userId: 999,
  email: "qa.admin@grota.com",
  fullName: "QA Admin",
  role: "admin",
  canView: true,
  canCreate: true,
  canUpdate: true,
  canDelete: true,
  scope: "admin",
  accessToken: "test-access-token",
  refreshToken: "test-refresh-token",
  expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  ...overrides,
});

export async function buildAdminSessionCookie(
  baseURL: string,
  overrides?: Partial<SessionPayload>,
) {
  const payload = buildDefaultPayload(overrides);
  const sessionSecret =
    process.env.ADMIN_SESSION_SECRET ?? "admin-session-dev-secret";
  const value = await encryptSession(payload, sessionSecret);
  const url = new URL(baseURL ?? "http://localhost:3100");

  return {
    name: ADMIN_COOKIE_NAME,
    value,
    domain: url.hostname,
    path: "/",
    httpOnly: true,
    sameSite: "Lax" as const,
    secure: url.protocol === "https:",
    url: url.origin,
  };
}

export async function ensureAdminSession(
  page: Page,
  baseURL: string,
  overrides?: Partial<SessionPayload>,
) {
  const cookie = await buildAdminSessionCookie(baseURL, overrides);
  await page.context().addCookies([cookie]);
}
