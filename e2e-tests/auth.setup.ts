import { Page, expect } from '@playwright/test'

export async function loginAsAdmin(page: Page) {
  const email = process.env.TEST_EMAIL
  const password = process.env.TEST_PASSWORD

  if (!email || !password) {
    throw new Error('TEST_EMAIL and TEST_PASSWORD env variables must be set')
  }

  await page.goto('/user/login')

  const emailInput = page.locator('#email')
  const passwordInput = page.locator('#password')

  await expect(emailInput).toBeVisible({ timeout: 15000 })
  await expect(passwordInput).toBeVisible({ timeout: 15000 })

  await emailInput.fill(email)
  await passwordInput.fill(password)

  await page.getByRole('button', { name: /login/i }).click()

  await expect(page).not.toHaveURL(/\/login$/, { timeout: 15000 })
}