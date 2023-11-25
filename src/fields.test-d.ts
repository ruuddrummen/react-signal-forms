import { FieldRule, IFormContext, SelectField, signalForm } from "@/index"
import { RuleContext } from "@/plugins"
import { required, validIf } from "@/rules"
import { describe, expect, expectTypeOf, test } from "vitest"
import { ArrayFieldBase, Field, TextField } from "./fields"

interface ITestData {
  hiddenField: string
  textField: string
  numberField: number
  selectField: string
}

describe("Test field builder and collection types", () => {
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

  test("Test array forms", () => {
    const fields = signalForm<IArrayFormData>().withFields((field) => ({
      ...field("arrayField").asArray({
        // Field specs in array form.
        fields: (arrayField) => ({
          ...arrayField("textInArray", "Text field in array", {
            defaultValue: "Default value",
            rules: [required()],
            //      ^?
          }),
        }),

        // Default value of array.
        defaultValue: [
          // ^?
          {
            textInArray: "Item 1",
          },
          {
            textInArray: "Item 2",
          },
        ],

        // Rules on array form.
        rules: [required()],
        //      ^?
      }),
    }))

    console.log("fields:", fields)
    console.log("arrayField:", fields.arrayField)

    expectTypeOf(fields.arrayField).toEqualTypeOf<
      Field<IArrayFormData, "arrayField", ArrayFieldBase<IArrayFieldData[]>>
    >()
    expectTypeOf(fields.arrayField.fields.textInArray).toEqualTypeOf<
      Field<IArrayFieldData, "textInArray", TextField>
    >()
    expectTypeOf(fields.arrayField.fields.textInArray.rules).toEqualTypeOf<
      FieldRule<IArrayFieldData, "textInArray">[] | undefined
    >()
  })

  interface IArrayFormData {
    arrayField: Array<IArrayFieldData>
  }

  interface IArrayFieldData {
    textInArray: string
  }
})
