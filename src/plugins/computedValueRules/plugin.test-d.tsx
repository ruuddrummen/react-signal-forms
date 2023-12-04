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

    const { result: fieldContext } = renderHook(
      () => ({
        numberField: useField(fields.numberField),
        doubleValueField: useField(fields.doubleValueField),
      }),
      {
        wrapper,
      }
    )

    expect(
      fieldContext.current.doubleValueField.peekValue(),
      "computation should run on initial values"
    ).toBe(6)

    fieldContext.current.numberField.setValue(4)
    expect(
      fieldContext.current.doubleValueField.peekValue(),
      "computation should run after dependency is updated"
    ).toBe(8)
  })
})
