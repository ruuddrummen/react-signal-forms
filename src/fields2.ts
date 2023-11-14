import { FormValues } from "."
import { KeyOf } from "./utils"

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

interface TData {
  select: string
}

export type FieldCollection<TForm = any> = {
  [Key in KeyOf<TForm>]: Field<TForm[Key], TForm, Key>
}

// iteration 5

interface IFormFactory<TData> {
  field<TField extends Field<any>, TKey extends keyof TData = keyof TData>(
    name: TKey,
    properties: Omit<TField, "name">
  ): TField
}

class FormFactory<TData> implements IFormFactory<TData> {
  field<TKey extends keyof TData, TField extends Field<any>>(
    name: TKey,
    properties: Omit<TField, "name">
  ): TField {
    return {
      name,
      ...properties,
    } as TField
  }
}

const createForm = <TData>() => ({
  createFields<TFields>(
    build: (
      formFactory: IFormFactory<TData>
    ) => FieldCollection<TData> & TFields
  ): TFields {
    const fields = build(new FormFactory<TData>())

    return fields
  },
})

const fields5 = createForm<TData>().createFields((form) => {
  return {
    select: form.field<SelectField>("select", {
      label: "test",
      options: [],
    }),
  }
})

// iteration 6

// interface IFormFactory6<TData> {
//   field<TField extends Field<any>, TKey extends keyof TData = keyof TData>(
//     name: TKey,
//     properties: Omit<TField, "name">
//   ): TField
// }

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

const fields6 = createForm6<TData>().createFields((form) => {
  return {
    ...form.field<SelectField>("select", {
      label: "test",
      options: [],
      rules: [],
    }),
  }
})
