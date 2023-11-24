import path from "path"
import { defineWorkspace } from "vitest/config"

export default defineWorkspace([
  {
    test: {
      name: "library",
      include: ["src/**/*.test(-d)?.{ts,tsx}"],
      environment: "jsdom",
      alias: [
        {
          find: "@",
          replacement: path.resolve(__dirname, "src"),
        },
      ],
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
