import { expect, test } from "@playwright/test";
import path from "path";
import { loginAsAdmin } from "../../auth.setup";

const EXAMPLE_IMAGE = path.join(__dirname, "../../assets/camera.jpg");

const exampleProduct = {
  title: "Digital camera",
  description:
    "A high-quality digital camera suitable for photography enthusiasts.",
  serialNumber: "cm-100987",
  price: 100,
  stock: 3,
};

test.describe("Admin new product flow", () => {
  test("Navigate to new product page and fill the form", async ({ page }) => {
    await loginAsAdmin(page);

    await page.route("**/api/ai/admin/products", async (route) => {
      await route.fulfill({
        json: { description: exampleProduct.description },
      });
    });

    await page.goto("http://localhost:3000/admin/products/new");

    await expect(
      page.getByRole("heading", { name: "Add Product" }),
    ).toBeVisible();

    await page.locator("#title").fill(exampleProduct.title);
    await page.locator("#description").fill(exampleProduct.description);
    await page.locator("#serialNumber").fill(exampleProduct.serialNumber);
    await page.locator("#price").fill(String(exampleProduct.price));
    await page.locator("#stock").fill(String(exampleProduct.stock));

    await page.locator('input[type="file"]').setInputFiles(EXAMPLE_IMAGE);

    await page.getByRole("button", { name: "Save Product" }).click();

    await expect(page).toHaveURL("http://localhost:3000/");
    await expect(page.getByText(exampleProduct.title)).toBeVisible();
  });

  test("Show error message when image uploads fail", async ({ page }) => {
    await loginAsAdmin(page);

    await page.route("**/api/blob/upload", async (route) => {
      await route.fulfill({ status: 500, json: { error: "Upload Failed" } });
    });

    await page.goto("http://localhost:3000/admin/products/new");
    await expect(
      page.getByRole("heading", { name: "Add Product" }),
    ).toBeVisible();

    await page.locator('input[type="file"]').setInputFiles(EXAMPLE_IMAGE);

    await expect(page.getByText(/Upload failed|Upload error/i)).toBeVisible();
  });
});
