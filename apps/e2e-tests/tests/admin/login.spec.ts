import { test, expect } from "@playwright/test";
import { registerAdminApiMocks } from "../support/adminApiMocks";

test.describe("Login do painel admin", () => {
  test.beforeEach(async ({ page }) => {
    await registerAdminApiMocks(page);
  });

  test("valida erros de preenchimento e habilita envio com dados válidos", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /bem-vindo/i }),
    ).toBeVisible();

    const submitButton = page.getByRole("button", { name: "Entrar" });
    await expect(submitButton).toBeDisabled();

    await submitButton.click();

    await expect(page.getByText("Email inválido")).toBeVisible();
    await expect(
      page.getByText("A senha precisa ter 8 caracteres"),
    ).toBeVisible();

    await page.getByLabel("E-mail").fill("qa@grota.com");
    await page.getByLabel("Senha").fill("12345678");

    await expect(submitButton).toBeEnabled();
  });

  test("abre o fluxo de esqueci a senha", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Esqueci a senha" }).click();

    await expect(page).toHaveURL(/esqueci-senha/);
    await expect(
      page.getByRole("heading", { name: /Redefinir Senha/i }),
    ).toBeVisible();
  });
});
