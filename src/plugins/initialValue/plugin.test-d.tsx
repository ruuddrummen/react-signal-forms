import { configureSignalForm, signalForm } from "@/index"
import { renderHook } from "@testing-library/react"
import React, { PropsWithChildren } from "react"
import { describe, expect, test } from "vitest"
import { initialValuePlugin } from "./plugin"

describe("initial value plugin", () => {
  const { SignalForm, useField } = configureSignalForm(initialValuePlugin)

  type TestData = {
    textField: string
  }

  const fields = signalForm<TestData>().withFields((field) => ({
    ...field("textField", "Text field", {
      defaultValue: "default value",
    }),
  }))

  test("with default value", () => {
    const wrapper: React.FC<PropsWithChildren<object>> = ({ children }) => (
      <SignalForm fields={fields}>{children}</SignalForm>
    )

    const { result: fieldContext } = renderHook(
      () => ({
        textField: useField(fields.textField),
      }),
      {
        wrapper,
      }
    )

    expect(
      fieldContext.current.textField.initialValue,
      "computation should run on initial values"
    ).toBe("default value")
  })

  test("with initial value", () => {
    const wrapper: React.FC<PropsWithChildren<object>> = ({ children }) => (
      <SignalForm
        fields={fields}
        initialValues={{
          textField: "initial value",
        }}
      >
        {children}
      </SignalForm>
    )

    const { result: fieldContext } = renderHook(
      () => ({
        textField: useField(fields.textField),
      }),
      {
        wrapper,
      }
    )

    expect(
      fieldContext.current.textField.initialValue,
      "computation should run on initial values"
    ).toBe("initial value")
  })
})
