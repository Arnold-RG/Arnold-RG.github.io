import { writeFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

function contrastRatio(fg, bg) {
  const channels = (color) => {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return null;
    return [Number(match[1]), Number(match[2]), Number(match[3])];
  };
  const lum = (rgb) => {
    const parts = rgb.map((value) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * parts[0] + 0.7152 * parts[1] + 0.0722 * parts[2];
  };
  const [hi, lo] = [lum(channels(fg)), lum(channels(bg))].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

test("hero, projects, and a quiet console", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Arnold Rurangwa" })).toBeVisible();
  await expect(page.getByText("Software development, Linux & systems administration, IT support.").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /See projects/ })).toBeVisible();
  await expect(page.locator("#projects")).toBeVisible();
  await expect(page.locator('a[href="https://github.com/Arnold-RG/STANS"]')).toHaveCount(1);
  await expect(page.locator('a[href="https://github.com/Arnold-RG/peakwise"]')).toHaveCount(1);
  await expect(page.locator('a[href="https://arnold-rg.github.io/peakwise/"]')).toHaveCount(1);
  const heroLinks = page.locator(".hero-actions a");
  await expect(heroLinks.nth(0)).toContainText("Download resume (PDF)");
  await expect(heroLinks.nth(1)).toContainText("Email me");
  await expect(heroLinks.nth(2)).toContainText("See projects");
  expect(errors, errors.join("\n")).toEqual([]);
});

test("theme toggle is keyboard operable", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /Switch to (light|dark) theme/ }).first();
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
  await expect(page.locator("#main")).toHaveAttribute("inert", "");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  await expect(page.locator("#main")).not.toHaveAttribute("inert", "");

  for (const width of [320, 390, 768, 960, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    expect(overflow, `overflow at ${width}px`).toBe(false);
  }
});

test("drawer resume button meets contrast in dark and light", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await page.getByRole("button", { name: "Open menu" }).click();
  const button = page.locator("#nav-drawer a.btn-primary");
  await expect(button).toBeVisible();

  const measure = () =>
    button.evaluate((el) => {
      const style = getComputedStyle(el);
      return { color: style.color, backgroundColor: style.backgroundColor };
    });

  const dark = await measure();
  const darkRatio = contrastRatio(dark.color, dark.backgroundColor);
  expect(darkRatio).toBeGreaterThanOrEqual(4.5);

  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  const light = await measure();
  const lightRatio = contrastRatio(light.color, light.backgroundColor);
  expect(lightRatio).toBeGreaterThanOrEqual(4.5);

  writeFileSync(
    "/tmp/resume-contrast.json",
    JSON.stringify(
      {
        dark: Number(darkRatio.toFixed(2)),
        light: Number(lightRatio.toFixed(2)),
        darkColors: dark,
        lightColors: light,
      },
      null,
      2
    )
  );
});

test("projects sit high on a phone and the page is shorter", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const metrics = await page.evaluate(() => ({
    projects: document.getElementById("projects").getBoundingClientRect().top + window.scrollY,
    height: document.documentElement.scrollHeight,
    portrait: document.querySelector(".hero-portrait").getBoundingClientRect().width,
  }));
  expect(metrics.projects).toBeLessThan(1700);
  await expect(page.locator("#projects")).toBeAttached();
  expect(metrics.height).toBeLessThan(10500);
  expect(metrics.portrait).toBeLessThan(100);
});

test("skip link is the first tab stop", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
});
