import { expectTypeOf, test } from "vitest"
import { RuleContext } from "./extensions/types"
import { FieldRule, SelectField, createForm } from "./fields2"
import { required, validIf } from "./rules"

interface ITestData {
  select: string
}

test("Test field collection builder types.", () => {
  const fields = createForm<ITestData>().createFields((form) => ({
    select: form.field<SelectField>({
      name: "select",
      label: "test",
      options: [],
      rules: [
        required(),
        validIf((context) => {
          expectTypeOf(context).toMatchTypeOf<
            RuleContext<ITestData, "select">
          >()

          return {
            testResult: true,
            errorMessage: "",
          }
        }),
      ],
    }),
    invalid: "",
  }))

  expectTypeOf(fields.select).toMatchTypeOf<SelectField>()
  expectTypeOf(fields.select.rules).toMatchTypeOf<
    FieldRule<ITestData, "select">[] | undefined
  >()
})
