import { signalForm } from "@/index"
import test from "node:test"
import { describe } from "vitest"
import { computedValue } from "./rules"

describe("computed value plugin", () => {
  type TestData = {
    numberField: number
    doubleValueField: number
  }

  test("computedValue rule", () => {
    signalForm<TestData>().withFields((field) => ({
      ...field("numberField", "Number field"),
      ...field("doubleValueField", "Double number field", {
        rules: [
          computedValue(({ form }) => (form.fields.numberField.value ?? 0) * 2),
        ],
      }),
    }))
  })
})
