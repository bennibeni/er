import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: { baseURL: "http://localhost:3002", channel: "msedge", headless: true },
  webServer: {
    command: "npx next start --port 3002",
    url: "http://localhost:3002",
    reuseExistingServer: false,
  },
});
