import { expect, expectTypeOf, test } from "vitest"
import { RuleContext } from "./extensions/types"
import { FieldRule, SelectField, signalForm } from "./fields2"
import { required, validIf } from "./rules"

interface ITestData {
  text: string
  select: string
}

test("Test field collection types.", () => {
  // TODO: test if this is composable.
  const fields = signalForm<ITestData>().withFields((field) => ({
    ...field("text").as({
      label: "Text field",
      rules: [
        required(),
        validIf((context) => {
          expectTypeOf(context).toMatchTypeOf<RuleContext<ITestData, "text">>()

          return {
            testResult: true,
            errorMessage: "",
          }
        }),
      ],
    }),

    ...field("select").as<SelectField>({
      label: "Select field",
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
  }))

  // const fields = createForm<ITestData>().createFields((form) => ({
  //   text: form.field({
  //     label: "Text field",
  //     rules: [
  //       required(),
  //       validIf((context) => {
  //         expectTypeOf(context).toMatchTypeOf<RuleContext<ITestData, "text">>()

  //         return {
  //           testResult: true,
  //           errorMessage: "",
  //         }
  //       }),
  //     ],
  //   }),
  //   select: form.field<SelectField>({
  //     label: "test",
  //     options: [],
  //     rules: [
  //       required(),
  //       validIf((context) => {
  //         expectTypeOf(context).toMatchTypeOf<
  //           RuleContext<ITestData, "select">
  //         >()

  //         return {
  //           testResult: true,
  //           errorMessage: "",
  //         }
  //       }),
  //     ],
  //   }),
  //   invalid: "",
  // }))

  expect(fields.select.name).toBe("select")

  expectTypeOf(fields.select).toMatchTypeOf<SelectField>()
  expectTypeOf(fields.select.rules).toMatchTypeOf<
    FieldRule<ITestData, "select">[] | undefined
  >()
})
