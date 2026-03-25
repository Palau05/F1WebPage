import { test, expect } from "@playwright/test";

test.describe("Standings page", () => {
  test.beforeEach(async ({ page }) => {
    // Standings fetches from live API — give it extra time
    await page.goto("/standings", { timeout: 30000 });
  });

  test("renders heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /2026 STANDINGS/i })).toBeVisible();
  });

  test("shows driver standings section or error fallback", async ({ page }) => {
    const driversHeading = page.getByRole("heading", { name: /DRIVERS/i });
    const fallback = page.getByText(/Failed to load standings/i);
    // Either the data loaded, or the graceful fallback shows
    await expect(driversHeading.or(fallback)).toBeVisible({ timeout: 15000 });
  });

  test("shows constructor standings section when data loads", async ({ page }) => {
    const driversHeading = page.getByRole("heading", { name: /DRIVERS/i });
    const fallback = page.getByText(/Failed to load standings/i);

    if (await fallback.isVisible()) {
      test.skip(); // API unavailable, skip data assertions
    }

    await expect(driversHeading).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("heading", { name: /CONSTRUCTORS/i })).toBeVisible();
  });

  test("driver names link to driver pages", async ({ page }) => {
    const fallback = page.getByText(/Failed to load standings/i);
    if (await fallback.isVisible()) {
      test.skip();
    }

    const driverLinks = page.getByRole("link").filter({ hasText: /\/driver\//i });
    // Check via href instead
    const links = page.locator('a[href^="/driver/"]');
    await expect(links.first()).toBeVisible({ timeout: 15000 });
  });
});
