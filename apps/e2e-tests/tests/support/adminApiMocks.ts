import { type Page } from "@playwright/test";

const adminUser = {
  id: 999,
  email: "qa.admin@grota.com",
  fullName: "QA Admin",
  role: "admin",
};

const notifications = [
  {
    id: 1,
    title: "Nova proposta recebida",
    description: "Proposta #2025-001 aguardando análise.",
    actor: "Sistema",
    read: false,
    createdAt: new Date().toISOString(),
    href: "/esteira-de-propostas",
  },
  {
    id: 2,
    title: "Documento pendente",
    description: "Envie o comprovante de residência do cliente João.",
    actor: "Time de risco",
    read: true,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
];

const dealers = [
  {
    id: 10,
    fullName: "Concessionária Horizonte",
    phone: "(11) 98888-7777",
    enterprise: "Grota Motors",
    status: "ATIVO",
    createdAt: new Date().toISOString(),
  },
];

const managers = [
  {
    id: 501,
    dealerId: dealers[0].id,
    fullName: "Gestor QA",
    email: "gestor.qa@grota.com",
    phone: "(11) 97777-6666",
    status: "ATIVO",
    canView: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    createdAt: new Date().toISOString(),
  },
];

export async function registerAdminApiMocks(page: Page) {
  await page.route("**/api/auth/me", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ user: adminUser }),
    }),
  );

  await page.route("**/api/auth/logout", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    }),
  );

  await page.route("**/api/notifications", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(notifications),
    }),
  );

  await page.route("**/api/notifications/stream**", (route) =>
    route.fulfill({
      status: 200,
      headers: { "content-type": "text/event-stream" },
      body: `data: ${JSON.stringify(notifications[0])}\n\n`,
    }),
  );

  await page.route("**/api/dealers**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(dealers),
    }),
  );

  await page.route("**/api/managers**", (route) => {
    if (route.request().method().toUpperCase() === "DELETE") {
      return route.fulfill({ status: 204, body: "" });
    }

    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(managers),
    });
  });

  await page.route("**/api/sellers**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "[]",
    }),
  );

  await page.route("**/api/operators**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "[]",
    }),
  );
}
