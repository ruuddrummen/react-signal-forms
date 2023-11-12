import { defineWorkspace } from "vitest/config"

export default defineWorkspace([
  {
    test: {
      name: "library",
      include: ["src/**/*.test(-d)?.{ts,tsx}"],
      environment: "jsdom",
    },
  },

  // TODO: add tests for demo.
  {
    test: {
      name: "demo",
      include: [],
    },
  },
])
