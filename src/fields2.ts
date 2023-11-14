import { FormValues } from "."
import { required } from "./rules"
import { KeyOf, forEachKeyOf } from "./utils"

export interface Field<TForm = any, Key extends KeyOf<TForm> = KeyOf<TForm>> {
  name: string
  label: string | null
  defaultValue?: TForm[Key]
  rules?: Array<FieldRule<TForm, Key>>
}

export type TextField = Field
export type NumberField = Field
export type BooleanField = Field

export interface SelectField extends Field {
  options: SelectItem[]
}

export type SelectItem = {
  value: string
  label: string
}

// Key can be used for type safety in rule implementations, for instance with TForm[Key]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FieldRule<
  TForm = FormValues,
  _Key extends KeyOf<TForm> = KeyOf<TForm>,
> {
  extension: string
}

export type FieldCollection<TForm = any> = {
  [Key in KeyOf<TForm>]: Field<TForm, Key>
}

class FormFactory2<TForm> {
  field<
    TField extends Field<TForm, Key>,
    Key extends KeyOf<TForm> = KeyOf<TForm>,
  >(
    properties: TField // & Field<TForm, Key>
  ): TField {
    return properties as TField
  }
}

// const formFactory = {
//   field<TField extends Field<any>>(properties: TField): TField {
//     return properties as TField
//   },
// }

// type FormFactory = typeof formFactory

export const createForm = <TForm>() => ({
  createFields<TFields extends FieldCollection<TForm>>(
    build: (form: FormFactory2<TForm>) => TFields
  ): Pick<TFields, KeyOf<TForm>> {
    const fields = build(new FormFactory2())

    // Copy name from fields collection to fields.
    forEachKeyOf(fields, (name) => {
      fields[name].name = name
    })

    return fields
  },
})

interface TestData {
  select: string
}

// const fields7 = createForm<TestData>().createFields((form) => {
//   return {
//     select: form.field<SelectField>({
//       name: "select",
//       label: "test",
//       options: [],
//       rules: [],
//     }),
//     invalid: "",
//   }
// })

const fields8 = createForm<TestData>().createFields((form) => ({
  select: form.field<SelectField>({
    name: "select",
    label: "test",
    options: [],
    rules: [required()],
  }),
  invalid: "",
}))

// const select7 = fields7.select
const select8 = fields8.select
