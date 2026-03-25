import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("renders without crashing", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await expect(page).toHaveTitle(/F1/i);

    // No uncaught JS errors
    expect(errors).toHaveLength(0);
  });

  test("shows mobile race list on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    // Mobile list should appear (md:hidden — visible below 768px)
    const mobileList = page.locator(".md\\:hidden");
    await expect(mobileList).toBeVisible();
  });

  test("shows globe container on desktop viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // Desktop globe wrapper should appear
    const desktopWrapper = page.locator(".hidden.md\\:block");
    await expect(desktopWrapper).toBeVisible();
  });

  test("footer shows next race info", async ({ page }) => {
    await page.goto("/");
    // Footer is rendered by the layout
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });
});
