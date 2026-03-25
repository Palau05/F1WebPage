import { test, expect } from "@playwright/test";

// albert_park and shanghai are completed races (before 2026-03-25)
// suzuka is upcoming (2026-03-29)

test.describe("Race detail — completed race (Albert Park)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/race/albert_park", { timeout: 30000 });
  });

  test("renders circuit name", async ({ page }) => {
    await expect(page.getByText(/Australian Grand Prix/i)).toBeVisible();
  });

  test("shows race results tab or no-data message", async ({ page }) => {
    const resultsTab = page.getByRole("button", { name: /RACE/i });
    const noData = page.getByText(/No results available/i);
    await expect(resultsTab.or(noData)).toBeVisible({ timeout: 15000 });
  });

  test("shows qualifying tab", async ({ page }) => {
    const qualiTab = page.getByRole("button", { name: /QUALIFYING/i });
    await expect(qualiTab).toBeVisible({ timeout: 15000 });
  });

  test("back link returns to globe/home", async ({ page }) => {
    // The in-page back link (not the navbar link)
    const backLink = page.getByRole("link", { name: /← BACK/i });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).not.toHaveURL("/race/albert_park");
  });

  test("shows no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.reload({ timeout: 30000 });
    expect(errors).toHaveLength(0);
  });
});

test.describe("Race detail — upcoming race (Suzuka)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/race/suzuka", { timeout: 30000 });
  });

  test("renders circuit name heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Japanese Grand Prix/i })).toBeVisible();
  });

  test("shows countdown and schedule for upcoming race", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /COUNTDOWN TO RACE/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("QUALIFYING").first()).toBeVisible();
  });
});

test.describe("Race detail — invalid circuit", () => {
  test("returns 404 for unknown circuitId", async ({ page }) => {
    const response = await page.goto("/race/not_a_real_circuit");
    expect(response?.status()).toBe(404);
  });
});
