commended production endpoints come from the existing `.env` files for the apps (e.g., `apps/public-site/.env`, `apps/dealer-portal/.env`, `apps/admin-console/.env`).

- `NEXT_PUBLIC_URL_API`, `LOGISTA_API_BASE_URL`, `ADMIN_API_BASE_URL`, `DEFAULT_API_BASE_URL`, `NEXT_PUBLIC_ADMIN_API_BASE_URL` – `https://servidor-grotafinanciamentos.up.railway.app/api/v1/grota-financiamentos` (single backend for proposals, auth, documents, etc.).
- `NEXT_PUBLIC_REALTIME_WS_URL` – `https://websocket-production-6330.up.railway.app` (shared WebSocket server used by the admin and dealer UIs).
- `LOGISTA_SESSION_SECRET` – `VGhpcy1pcy1hLXNlY3VyZS1rZXktMzItYnl0ZXMtbG9uZw==` (used to encrypt the dealer session cookie).
- `ADMIN_SESSION_SECRET` – `VGhpcy1pcy1hLXNlY3VyZS1rZXktMzItYnl0ZXMtbG9uZw==` (used to encrypt the admin session cookie).

 (`monorepo-grota-financiamentos-clien.vercel.app`)

| Variable | Value | Why |
| --- | --- | --- |
| `NEXT_PUBLIC_LOGISTA_PANEL_URL` | `https://monorepo-grota-financiamentos-logis.vercel.app` | Frontend calls this BFF so the dealer session cookie is issued from the logista domain. |
| `LOGISTA_ALLOWED_ORIGINS`, `NEXT_PUBLIC_LOGISTA_ALLOWED_ORIGINS` | `https://monorepo-grota-financiamentos-logis.vercel.app` | Allows the logista panel to accept redirects/cookies from the public site. |
| `LOGISTA_API_BASE_URL`, `NEXT_PUBLIC_URL_API` | `https://servidor-grotafinanciamentos.up.railway.app/api/v1/grota-financiamentos` | API host used by the public landing pages for newsletter, contact and onboarding forms. |

> **Preview deployments:** Repeat the same `NEXT_PUBLIC_LOGISTA_PANEL_URL` value for each preview (e.g. `https://<your-logista-project>-main-sage.vercel.app`) so `MockAuthService` in `apps/public-site/src/application/services/auth/MockAuthService.ts#L20-L41` does not fall back to the current domain and send `POST /api/auth/login` to the wrong endpoint (which returns a 405). Likewise, add any preview hostname you use for the public site to `LOGISTA_ALLOWED_ORIGINS`/`NEXT_PUBLIC_LOGISTA_ALLOWED_ORIGINS` so the dealer BFF whitelists it.

## dealer-portal / logista BFF (`monorepo-grota-financiamentos-logis.vercel.app`)

| Variable | Value | Why |
| --- | --- | --- |
| `CLIENT_APP_ORIGIN`, `NEXT_PUBLIC_CLIENT_URL` | `https://monorepo-grota-financiamentos-clien.vercel.app` | Allows the logista backend to whitelist the public landing page as a trusted origin. |
| `NEXT_PUBLIC_REALTIME_WS_URL` | `https://websocket-production-6330.up.railway.app` | WebSocket endpoint for dealer/admin synchronization. |
| `NEXT_PUBLIC_URL_API`, `LOGISTA_API_BASE_URL` | `https://servidor-grotafinanciamentos.up.railway.app/api/v1/grota-financiamentos` | Spring backend that the BFF proxies for proposals, documents and auth. |
| `LOGISTA_SESSION_SECRET` | `VGhpcy1pcy1hLXNlY3VyZS1rZXktMzItYnl0ZXMtbG9uZw==` | Matches the secret used in `apps/dealer-portal/.env`. |
| `LOGISTA_ALLOWED_ORIGINS`, `NEXT_PUBLIC_LOGISTA_ALLOWED_ORIGINS` | `https://monorepo-grota-financiamentos-clien.vercel.app,https://monorepo-grota-financiamentos-admin.vercel.app` | Ensures cookies and SSEs are accepted when the admin console or public site hit the logista BFF. |

## admin-console / CRM (`monorepo-grota-financiamentos-admin.vercel.app`)

| Variable | Value | Why |
| --- | --- | --- |
| `NEXT_PUBLIC_ADMIN_API_BASE_URL`, `ADMIN_API_BASE_URL`, `DEFAULT_API_BASE_URL` | `https://servidor-grotafinanciamentos.up.railway.app/api/v1/grota-financiamentos` | Admin BFF proxies to the same Spring backend. |
| `NEXT_PUBLIC_REALTIME_WS_URL` | `https://websocket-production-6330.up.railway.app` | Shared WebSocket for live notifications. |
| `ADMIN_SESSION_SECRET` | `VGhpcy1pcy1hLXNlY3VyZS1rZXktMzItYnl0ZXMtbG9uZw==` | Reuses the current secret that is already committed to `.env`. |

> **Tip:** For any Vercel preview deployments that need to talk to the real backend, copy the Production values above; adjust only if you provide separate staging endpoints. Keep the secrets secret and rotate them if needed outside of the repo.
