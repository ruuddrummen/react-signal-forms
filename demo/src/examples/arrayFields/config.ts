import { signalForm } from "react-signal-forms"
import { applicableIf } from "react-signal-forms/rules"

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
        ],
      }),
    }),
  }),
}))
