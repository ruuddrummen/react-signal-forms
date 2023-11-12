import { expectTypeOf, test } from "vitest"
import { RuleContext } from "./extensions/types"
import { IFieldBuilder, IFieldCollectionBuilder, createFields } from "./fields"
import { requiredIf } from "./rules"

interface ITestData {
  textField: string
}

test("Test field collection builder types.", () => {
  createFields<ITestData>((form) => {
    expectTypeOf(form).toMatchTypeOf<IFieldCollectionBuilder<ITestData>>()

    form.field("textField", (field) => {
      expectTypeOf(field).toMatchTypeOf<IFieldBuilder<ITestData, "textField">>()

      field.rules = [
        requiredIf((context) => {
          expectTypeOf(context).toMatchTypeOf<
            RuleContext<ITestData, "textField">
          >()

          return true
        }),
      ]
    })
  })
})
