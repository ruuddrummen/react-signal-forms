import { configureSignalForm, signalForm } from "@/index"
import { renderHook } from "@testing-library/react"
import React, { PropsWithChildren } from "react"
import { describe, expect, test } from "vitest"
import { computedValueRulesPlugin } from "./plugin"
import { computedValue } from "./rules"

describe("computed value plugin", () => {
  const { SignalForm, useField } = configureSignalForm(computedValueRulesPlugin)

  type TestData = {
    numberField: number
    doubleValueField: number
  }

  test("computedValue rule", () => {
    const fields = signalForm<TestData>().withFields((field) => ({
      ...field("numberField", "Number field", {
        defaultValue: 3,
      }),
      ...field("doubleValueField", "Double number field", {
        rules: [
          computedValue(({ form }) => (form.fields.numberField.value ?? 0) * 2),
        ],
      }),
    }))

    const wrapper: React.FC<PropsWithChildren<object>> = ({ children }) => (
      <SignalForm fields={fields}>{children}</SignalForm>
    )

    const { result } = renderHook(() => useField(fields.doubleValueField), {
      wrapper,
    })

    expect(result.current.peekValue()).toBe(6)
  })
})
