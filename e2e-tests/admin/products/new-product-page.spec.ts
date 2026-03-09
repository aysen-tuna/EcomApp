import { expect, test } from '@playwright/test';
import path from 'path';
import { loginAsAdmin } from '../../auth.setup';

test.describe.configure({ mode: 'serial' });

const EXAMPLE_IMAGE = path.join(__dirname, '../../assets/camera.webp');

const exampleProduct = {
  title: 'Digital camera',
  description: 'A high-quality digital camera suitable for photography enthusiasts.',
  serialNumber: 'cm-100987',
  category: 'Home',
  price: 100,
  stock: 3,
};

test.describe('Admin new product flow', () => {
  test('Navigate to new product page and fill the form', async ({ page }) => {
    await loginAsAdmin(page);

    await page.route('**/api/ai/admin/products', async (route) => {
      await route.fulfill({
        json: { description: exampleProduct.description },
      });
    });

    await page.goto('/admin/products/new');

    await expect(page).toHaveURL(/\/admin\/products\/new$/);

    await expect(page.locator('#title')).toBeVisible({ timeout: 15000 });

    await page.locator('#title').fill(exampleProduct.title);
    await page.locator('#description').fill(exampleProduct.description);
    await page.locator('#serialNumber').fill(exampleProduct.serialNumber);
    await page.locator('#category').selectOption(exampleProduct.category);
    await page.locator('#price').fill(String(exampleProduct.price));
    await page.locator('#stock').fill(String(exampleProduct.stock));

    await expect(page.locator('#title')).toHaveValue(exampleProduct.title);
    await expect(page.locator('#description')).toHaveValue(exampleProduct.description);
    await expect(page.locator('#serialNumber')).toHaveValue(exampleProduct.serialNumber);
    await expect(page.locator('#price')).toHaveValue(String(exampleProduct.price));
    await expect(page.locator('#stock')).toHaveValue(String(exampleProduct.stock));
  });

  test('Show upload area when image upload request fails', async ({ page }) => {
    await loginAsAdmin(page);

    await page.route('**/api/blob/upload', async (route) => {
      await route.fulfill({
        status: 500,
        json: { error: 'Upload Failed' },
      });
    });

    await page.goto('/admin/products/new');

    await expect(page).toHaveURL(/\/admin\/products\/new$/);

    const fileInput = page.locator('input[type="file"]');

    await expect(fileInput).toBeVisible({ timeout: 15000 });

    await fileInput.setInputFiles(EXAMPLE_IMAGE);

    await expect(fileInput).toBeVisible();
  });
});
