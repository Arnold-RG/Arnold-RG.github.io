import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: "http://127.0.0.1:4177",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "node scripts/serve-site.mjs",
    url: "http://127.0.0.1:4177",
    reuseExistingServer: !process.env.CI,
  },
});
