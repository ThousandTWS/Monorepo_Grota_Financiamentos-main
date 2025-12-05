import { test, expect } from "@playwright/test";
import { ensureAdminSession } from "../support/adminSession";
import { registerAdminApiMocks } from "../support/adminApiMocks";

const fallbackBaseURL = "http://localhost:3100";

test.describe("Painel admin autenticado", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const baseURL = testInfo.project.use.baseURL ?? fallbackBaseURL;
    await registerAdminApiMocks(page);
    await ensureAdminSession(page, baseURL);
  });

  test("abre a visão geral quando há sessão válida", async ({ page }) => {
    await page.goto("/visao-geral");

    await expect(page).toHaveURL(/visao-geral/);
    await expect(
      page.getByRole("heading", { name: /Visão Geral/i }),
    ).toBeVisible();
    await expect(page.getByText("Gestores ativos")).toBeVisible();
    await expect(page.getByText("Gestor QA")).toBeVisible();
  });

  test("navega pelo menu lateral até Gestores", async ({ page }) => {
    await page.goto("/visao-geral");

    await page.getByRole("link", { name: "Cadastrar Gestores" }).click();
    await expect(page).toHaveURL(/gestores/);
    await expect(page.getByText("Cadastrar gestor")).toBeVisible();
    await expect(page.getByText("Gestor QA")).toBeVisible();
  });
});
