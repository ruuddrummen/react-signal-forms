import { render } from "@testing-library/react"
import React from "react"
import { describe, expectTypeOf, test } from "vitest"
import { createForm } from "."
import { extensions } from "./extensions"
import { ApplicabilityFieldProperties } from "./extensions/applicabilityRules/extension"
import { ValidationFieldContextProperties } from "./extensions/validation/extension"
import { IFieldContext } from "./fieldContext"
import { configureSignalForm } from "./form"

interface ITestData {
  textField: string
}

describe("useFieldSignals tests", () => {
  const fields = createForm<ITestData>().createFields((form) => ({
    textField: form.field({
      name: "Test",
      label: "Label",
    }),
  }))

  test("should get validation field properties", () => {
    const { SignalForm, useFieldSignals } = configureSignalForm(
      extensions.validationRules
    )

    function Input() {
      const signals = useFieldSignals(fields.textField)

      expectTypeOf(signals).toMatchTypeOf<
        IFieldContext<string> & ValidationFieldContextProperties
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
    const { SignalForm, useFieldSignals } = configureSignalForm(
      extensions.applicabilityRules
    )

    function Input() {
      const signals = useFieldSignals(fields.textField)

      expectTypeOf(signals).toMatchTypeOf<
        IFieldContext<string> & ApplicabilityFieldProperties
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
