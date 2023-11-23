import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "",
  server: {
    port: 3000,
  },
  resolve: {
    alias: [
      {
        find: "react-signal-forms",
        replacement: path.resolve(__dirname, "../src"),
      },
      {
        find: "react-signal-forms/extensions",
        replacement: path.resolve(__dirname, "../src/extensions"),
      },
      {
        find: "react-signal-forms/rules",
        replacement: path.resolve(__dirname, "../src/rules"),
      },
      {
        find: "@preact/signals-react",
        replacement: path.resolve(
          __dirname,
          "node_modules/@preact/signals-react"
        ),
      },
    ],
  },
})
