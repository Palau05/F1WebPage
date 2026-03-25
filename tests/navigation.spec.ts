import { test, expect } from "@playwright/test";

test.describe("Navbar", () => {
  test("shows nav links on every page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /calendar/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /standings/i })).toBeVisible();
  });

  test("navigates to calendar page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /calendar/i }).first().click();
    await expect(page).toHaveURL("/calendar");
    await expect(page.getByRole("heading", { name: /2026 RACE CALENDAR/i })).toBeVisible();
  });

  test("navigates to standings page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /standings/i }).first().click();
    await expect(page).toHaveURL("/standings");
    await expect(page.getByRole("heading", { name: /2026 STANDINGS/i })).toBeVisible();
  });
});
