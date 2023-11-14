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

interface TestData {
  select: string
}

export type FieldCollection<TForm = any> = {
  [Key in KeyOf<TForm>]: Field<TForm[Key], TForm, Key>
}

// iteration 6

class FormFactory6<TData> {
  // implements IFormFactory6<TData> {
  field<TField extends Field<any>, TKey extends keyof TData = keyof TData>(
    name: TKey,
    properties: Omit<TField, "name">
  ): Record<TKey, TField> {
    return {
      [name]: {
        name,
        ...properties,
      } as TField,
    } as Record<TKey, TField>
  }
}

const createForm6 = <TData>() => ({
  createFields<TFields>(
    build: (
      formFactory: FormFactory6<TData>
    ) => FieldCollection<TData> & TFields
  ): TFields {
    const fields = build(new FormFactory6<TData>())

    return fields
  },
})

const fields6 = createForm6<TestData>().createFields((form) => {
  return {
    ...form.field<SelectField>("select", {
      label: "test",
      options: [],
      rules: [],
    }),
  }
})

// iteration 7

export type FieldCollection7<TForm = any> = {
  [Key in KeyOf<TForm>]: Field<TForm[Key], TForm, Key>
}

class FormFactory7<TData> {
  field<TField extends Field<any>>( //, TKey extends keyof TData = keyof TData>(
    // name: TKey,
    properties: Omit<TField, "name">
  ): TField {
    return {
      // name,
      ...properties,
    } as TField
  }
}

const createForm7 = <TData>() => ({
  createFields<TFields extends FieldCollection7<TData>>(
    build: (formFactory: FormFactory7<TData>) => TFields
  ): Pick<TFields, KeyOf<TData>> {
    const fields = build(new FormFactory7<TData>())

    // Copy name from fields collection to fields.
    forEachKeyOf(fields, (name) => {
      fields[name].name = name
    })

    return fields
  },
})

const fields7 = createForm7<TestData>().createFields((form) => {
  return {
    select: form.field<SelectField>({
      label: "test",
      options: [],
      rules: [],
    }),
    test: "should be invalid",
  }
})

const select = fields7.select
