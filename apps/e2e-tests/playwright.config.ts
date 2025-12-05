import { defineConfig, devices } from "@playwright/test";

const ADMIN_PORT = Number(process.env.ADMIN_E2E_PORT ?? 3100);
const ADMIN_BASE_URL =
  process.env.ADMIN_E2E_BASE_URL ?? `http://localhost:${ADMIN_PORT}`;
const ADMIN_DEV_COMMAND =
  process.env.ADMIN_E2E_DEV_COMMAND ??
  `pnpm dev --filter grota-painel-admin -- --port ${ADMIN_PORT}`;

export default defineConfig({
  testDir: "./tests",
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }]],

  webServer: {
    command: ADMIN_DEV_COMMAND,
    port: ADMIN_PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      PORT: String(ADMIN_PORT),
      NEXT_PUBLIC_ADMIN_API_BASE_URL:
        process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ??
        "http://localhost:9999",
      ADMIN_SESSION_SECRET:
        process.env.ADMIN_SESSION_SECRET ?? "admin-session-dev-secret",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },

  use: {
    baseURL: ADMIN_BASE_URL,
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
