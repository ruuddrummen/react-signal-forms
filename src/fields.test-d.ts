import { FieldRule, IFormContext, SelectField, signalForm } from "@/index"
import { RuleContext } from "@/plugins"
import { required, validIf } from "@/rules"
import { expect, expectTypeOf, test } from "vitest"

interface ITestData {
  hiddenField: string
  textField: string
  numberField: number
  selectField: string
}

test("Test field builder and collection types.", () => {
  const fields = signalForm<ITestData>().withFields((field) => ({
    ...field("hiddenField").asHidden(),

    ...field("textField", "My text field"),

    ...field("textField", {
      label: "My text field",
      defaultValue: "Default value",
    }),

    ...field("numberField", "My number field"),

    ...field("numberField", {
      label: "My number field",
      defaultValue: 1,
    }),

    ...field("selectField", "My select field").as<SelectField>({
      options: [],
    }),

    ...field("selectField").as<SelectField>({
      label: "My select field",
      options: [],
    }),

    ...field("selectField").as<SelectField>({
      label: "My select field",
      options: [],
      rules: [
        required(),
        validIf((context) => {
          expectTypeOf(context).toEqualTypeOf<
            RuleContext<ITestData, "selectField">
          >()
          expectTypeOf(context.value).toBeString()
          expectTypeOf(context.form).toEqualTypeOf<IFormContext<ITestData>>()

          return {
            validIf: true,
            errorMessage: "",
          }
        }),
      ],
    }),
  }))

  console.log("fields:", fields)

  expect(fields.textField.name).toBe("textField")
  expect(fields.selectField.name).toBe("selectField")

  expectTypeOf(fields.selectField).toMatchTypeOf<SelectField>()
  expectTypeOf(fields.selectField.rules).toEqualTypeOf<
    FieldRule<ITestData, "selectField">[] | undefined
  >()
})
