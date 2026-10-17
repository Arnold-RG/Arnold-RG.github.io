import { expect, test } from "@playwright/test";

test("hero, projects, and a quiet console", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Arnold Rurangwa" })).toBeVisible();
  await expect(page.getByText("Software development, Linux/sysadmin, and IT support.").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "See projects" })).toBeVisible();
  await expect(page.locator("#projects")).toBeVisible();
  await expect(page.locator('a[href="https://github.com/Arnold-RG/STANS"]')).toHaveCount(1);
  await expect(page.locator('a[href="https://github.com/Arnold-RG/peakwise"]')).toHaveCount(1);
  await expect(page.locator('a[href="https://arnold-rg.github.io/peakwise/"]')).toHaveCount(1);
  expect(errors, errors.join("\n")).toEqual([]);
});

test("theme toggle is keyboard operable", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /Switch to (light|dark) theme/ });
  await toggle.focus();
  const before = await page.locator("html").getAttribute("data-theme");
  await page.keyboard.press("Enter");
  const after = before === "dark" ? "light" : "dark";
  await expect(page.locator("html")).toHaveAttribute("data-theme", after);
  await expect(page.locator("#theme-status")).toContainText(/theme/i);
});

test("mobile menu opens, traps escape, and the page does not overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open menu" });
  await expect(menu).toBeVisible();
  await menu.click();
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();

  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    expect(overflow, `overflow at ${width}px`).toBe(false);
  }
});

test("skip link is the first tab stop", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
});
