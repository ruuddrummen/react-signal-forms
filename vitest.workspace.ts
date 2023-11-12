import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import { defineWorkspace } from "vitest/config"

export default defineWorkspace([
  {
    root: "./demo",
    plugins: [react(), tsconfigPaths({})],
    test: {
      name: "demo",
      // root: "demo",
      // include: ["demo/src/**/*.test(-d)?.{ts,tsx}"],
      environment: "jsdom",
      // config: "demo/vite.config.ts",
    },
  },
  // "demo/vite.config.ts",
  {
    plugins: [react()],
    test: {
      name: "library",
      include: ["src/**/*.test(-d)?.{ts,tsx}"],
      environment: "jsdom",
    },
  },
])
