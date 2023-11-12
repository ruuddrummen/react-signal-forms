import { expectTypeOf, test } from "vitest"
import {
  FieldRule,
  IFieldBuilder,
  IFieldCollectionBuilder,
  createFields,
} from "./fields"
import { required } from "./rules"

interface ITestData {
  textField: string
}

test("Test field collection builder types.", () => {
  createFields<ITestData>((form) => {
    expectTypeOf(form).toMatchTypeOf<IFieldCollectionBuilder<ITestData>>()

    form.field("textField", (field) => {
      expectTypeOf(field).toMatchTypeOf<IFieldBuilder<ITestData, "textField">>()

      field.rules = [required()]

      expectTypeOf(field.rules[0]).toMatchTypeOf<
        FieldRule<ITestData, "textField">
      >()
    })
  })
})
