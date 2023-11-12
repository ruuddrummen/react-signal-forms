import { render } from "@testing-library/react"
import { describe, test } from "vitest"
import App from "./App"

describe("Test demo app", () => {
  test("renders without errors", () => {
    render(<App />)
  })
})
