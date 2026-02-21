import { Page } from "@playwright/test";

export async function loginAsAdmin(page: Page) {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    throw new Error("TEST_EMAIL and TEST_PASSWORD env variables must be set");
  }

  await page.goto("http://localhost:3000/user/login");

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);

  await page.getByRole("button", { name: /login/i }).click();

  await page.getByText("Admin").waitFor({ state: "visible", timeout: 15000 });
}
