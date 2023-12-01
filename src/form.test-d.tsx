import { render } from "@testing-library/react"
import React from "react"
import { describe, expectTypeOf, test } from "vitest"
import { IFieldContext } from "./fieldContext"
import { signalForm } from "./fields"
import { configureSignalForm } from "./form"
import { plugins } from "./plugins"

interface ITestData {
  textField: string
}

describe("useField tests", () => {
  const fields = signalForm<ITestData>().withFields((field) => ({
    ...field("textField", "Text field"),
  }))

  test("should get validation field properties", () => {
    const { SignalForm, useField } = configureSignalForm(
      plugins.validationRules
    )

    function Input() {
      const signals = useField(fields.textField)

      expectTypeOf(signals).toMatchTypeOf<
        IFieldContext<string> & { isValid: boolean }
      >()

      return null
    }

    render(
      <SignalForm fields={fields}>
        <Input />
      </SignalForm>
    )
  })

  test("should get applicability field properties", () => {
    const { SignalForm, useField } = configureSignalForm(
      plugins.applicabilityRules
    )

    function Input() {
      const signals = useField(fields.textField)

      expectTypeOf(signals).toMatchTypeOf<
        IFieldContext<string> & { isApplicable: boolean }
      >()

      return null
    }

    render(
      <SignalForm fields={fields}>
        <Input />
      </SignalForm>
    )
  })
})
