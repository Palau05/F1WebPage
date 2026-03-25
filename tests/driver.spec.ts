import { test, expect } from "@playwright/test";

test.describe("Driver page", () => {
  test("navigates from standings to a driver page", async ({ page }) => {
    await page.goto("/standings", { timeout: 30000 });

    const fallback = page.getByText(/Failed to load standings/i);
    if (await fallback.isVisible({ timeout: 10000 }).catch(() => false)) {
      test.skip(); // API unavailable
    }

    const firstDriverLink = page.locator('a[href^="/driver/"]').first();
    await expect(firstDriverLink).toBeVisible({ timeout: 15000 });

    const href = await firstDriverLink.getAttribute("href");
    await firstDriverLink.click();

    await expect(page).toHaveURL(href!);
  });

  test("driver page shows stats and back link", async ({ page }) => {
    await page.goto("/standings", { timeout: 30000 });

    const fallback = page.getByText(/Failed to load standings/i);
    if (await fallback.isVisible({ timeout: 10000 }).catch(() => false)) {
      test.skip();
    }

    const firstDriverLink = page.locator('a[href^="/driver/"]').first();
    await expect(firstDriverLink).toBeVisible({ timeout: 15000 });
    await firstDriverLink.click();

    // Stats cards
    await expect(page.getByText(/POINTS/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/POSITION/i)).toBeVisible();
    await expect(page.getByText(/WINS/i)).toBeVisible();

    // Back link
    await expect(page.getByRole("link", { name: /BACK TO STANDINGS/i })).toBeVisible();
  });

  test("returns 404 for unknown driverId", async ({ page }) => {
    const response = await page.goto("/driver/unknown_driver_xyz");
    expect(response?.status()).toBe(404);
  });
});
