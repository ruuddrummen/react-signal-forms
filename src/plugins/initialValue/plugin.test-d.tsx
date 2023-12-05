import { configureSignalForm, signalForm } from "@/index"
import { renderHook } from "@testing-library/react"
import React, { PropsWithChildren } from "react"
import { describe, expect, expectTypeOf, test } from "vitest"
import { initialValuePlugin } from "./plugin"

describe("initial value plugin", () => {
  const { SignalForm, useField } = configureSignalForm(initialValuePlugin)

  type TestData = {
    textField: string
    numberField: number
  }

  const fields = signalForm<TestData>().withFields((field) => ({
    ...field("textField", "Text field", {
      defaultValue: "default value",
    }),
    ...field("numberField", "Number field", {
      defaultValue: 3,
    }),
  }))

  test("with default value", () => {
    const wrapper: React.FC<PropsWithChildren<object>> = ({ children }) => (
      <SignalForm fields={fields}>{children}</SignalForm>
    )

    const { result: fieldContext } = renderHook(
      () => ({
        textField: useField(fields.textField),
        numberField: useField(fields.numberField),
      }),
      {
        wrapper,
      }
    )

    expectTypeOf(
      fieldContext.current.textField.initialValue
    ).toEqualTypeOf<string>()

    expectTypeOf(
      fieldContext.current.numberField.initialValue
    ).toEqualTypeOf<number>()

    expect(
      fieldContext.current.textField.initialValue,
      "initial value should be default value"
    ).toBe("default value")

    expect(
      fieldContext.current.numberField.initialValue,
      "initial value should be default value"
    ).toBe(3)
  })

  test("with initial value", () => {
    const wrapper: React.FC<PropsWithChildren<object>> = ({ children }) => (
      <SignalForm
        fields={fields}
        initialValues={{
          textField: "initial value",
          numberField: 6,
        }}
      >
        {children}
      </SignalForm>
    )

    const { result: fieldContext } = renderHook(
      () => ({
        textField: useField(fields.textField),
        numberField: useField(fields.numberField),
      }),
      {
        wrapper,
      }
    )

    expectTypeOf(
      fieldContext.current.textField.initialValue
    ).toEqualTypeOf<string>()

    expectTypeOf(
      fieldContext.current.numberField.initialValue
    ).toEqualTypeOf<number>()

    expect(
      fieldContext.current.textField.initialValue,
      "initial value should be initial value"
    ).toBe("initial value")

    expect(
      fieldContext.current.numberField.initialValue,
      "initial value should be initial value"
    ).toBe(6)
  })
})
