import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    open: true,
    port: 3000,
  },
  test: {
    // test, expect and vi are available without imports, like in the React Component Testing session
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    // the starter has no tests yet
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      // lcov is the format SonarQube Cloud reads (coverage/lcov.info)
      reporter: ["text", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
    },
  },
});
