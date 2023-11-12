import react from "@vitejs/plugin-react"
import { defineWorkspace } from "vitest/config"

export default defineWorkspace([
  {
    plugins: [react()],
    test: {
      name: "library",
      include: ["src/**/*.test(-d)?.{ts,tsx}"],
      environment: "jsdom",
    },
  },

  // Not working yet :(
  // {
  //   plugins: [react(), tsconfigPaths({})],
  //   root: "./demo",
  //   test: {
  //     name: "demo",
  //     environment: "jsdom",
  //   },
  // },
])
