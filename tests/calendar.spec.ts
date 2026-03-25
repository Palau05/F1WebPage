import { test, expect } from "@playwright/test";

test.describe("Calendar page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/calendar");
  });

  test("renders heading and subtitle", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /2026 RACE CALENDAR/i })).toBeVisible();
    await expect(page.getByText(/22 Rounds/i)).toBeVisible();
  });

  test("shows all 22 circuits as links", async ({ page }) => {
    const raceLinks = page.getByRole("link").filter({ hasText: /Grand Prix/i });
    await expect(raceLinks).toHaveCount(22);
  });

  test("links navigate to race detail pages", async ({ page }) => {
    const firstLink = page.getByRole("link").filter({ hasText: /Grand Prix/i }).first();
    await firstLink.click();
    await expect(page).toHaveURL(/\/race\//);
  });

  test("shows status badges", async ({ page }) => {
    // At least some races should have status badges (completed or upcoming)
    const badges = page.locator("text=/COMPLETED|UPCOMING|LIVE/i");
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
  });

  test("shows no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.reload();
    expect(errors).toHaveLength(0);
  });
});
