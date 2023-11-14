import { FormValues } from "."
import { KeyOf, forEachKeyOf } from "./utils"

export interface Field<
  TValue,
  TForm = any,
  Key extends KeyOf<TForm> = KeyOf<TForm>,
> {
  name: string
  label: string | null
  defaultValue?: TValue
  rules?: Array<FieldRule<TForm, Key>>
}

export type TextField = Field<string>
export type NumberField = Field<number>
export type BooleanField = Field<boolean>

export interface SelectField extends Field<string> {
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
  [Key in KeyOf<TForm>]: Field<TForm[Key], TForm, Key>
}

const formFactory = {
  field<TField extends Field<any>>(properties: Omit<TField, "name">): TField {
    return properties as TField
  },
}

type FormFactory = typeof formFactory

export const createForm = <TData>() => ({
  createFields<TFields extends FieldCollection<TData>>(
    build: (form: FormFactory) => TFields
  ): Pick<TFields, KeyOf<TData>> {
    const fields = build(formFactory)

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

const fields7 = createForm<TestData>().createFields((form) => {
  return {
    select: form.field<SelectField>({
      label: "test",
      options: [],
      rules: [],
    }),
    invalid: "",
  }
})

const fields8 = createForm<TestData>().createFields((form) => ({
  select: form.field<SelectField>({
    label: "test",
    options: [],
    rules: [],
  }),
  invalid: "",
}))

const select7 = fields7.select
const select8 = fields8.select
