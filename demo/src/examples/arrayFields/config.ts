import { signalForm } from "react-signal-forms"
import { applicableIf, required } from "react-signal-forms/rules"

type Fields = {
  arrayField: Array<{
    booleanField: boolean
    textField: string
  }>
}

export const fields = signalForm<Fields>().withFields((field) => ({
  ...field("arrayField").asArray({
    fields: (field) => ({
      ...field("booleanField", "Toggle"),

      ...field("textField", "Text", {
        rules: [
          applicableIf(({ fields }) => fields.booleanField.value === true),
          required(),
        ],
      }),
    }),

    defaultValue: [
      {
        booleanField: true,
        textField: "Item 1",
      },
      {
        booleanField: true,
        textField: "Item 2",
      },
      {
        booleanField: false,
        textField: "",
      },
    ],
  }),
}))
