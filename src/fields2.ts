import { FormValues } from "."
import { KeyOf, forEachKeyOf } from "./utils"

export interface FieldBase<TValue = unknown> {
  name: string
  label: string | null
  defaultValue?: TValue
}

export type TextField = FieldBase<string>
export type NumberField = FieldBase<number>
export type BooleanField = FieldBase<boolean>

export interface SelectField extends FieldBase<string> {
  options: SelectItem[]
}

export type SelectItem = {
  value: string
  label: string
}

interface FieldRules<TForm, Key extends KeyOf<TForm>> {
  rules?: Array<FieldRule<TForm, Key>>
}

export type Field<
  TForm = any,
  TKey extends KeyOf<TForm> = KeyOf<TForm>,
  TFieldBase extends FieldBase<TForm[TKey]> = FieldBase<TForm[TKey]>,
> = TFieldBase & {
  rules?: Array<FieldRule<TForm, TKey>>
}

// Key can be used for type safety in rule implementations, for instance with TForm[Key]
export interface FieldRule<
  TForm = FormValues,
  _Key extends KeyOf<TForm> = KeyOf<TForm>,
> {
  extension: string
}

export type FieldCollection<TForm = any> = {
  [Key in KeyOf<TForm>]: Field<TForm, Key, FieldBase<TForm[Key]>>
}

class FormFactory2<TForm> {
  field<
    TFieldBase extends FieldBase<TForm[TKey]>,
    TKey extends KeyOf<TForm> = KeyOf<TForm>,
  >(
    properties: Omit<TFieldBase, "name"> & FieldRules<TForm, TKey>
  ): Field<TForm, TKey, TFieldBase> {
    return properties as Field<TForm, TKey, TFieldBase>
  }
}

export const createForm = <TForm>() => ({
  createFields<TFields extends FieldCollection<TForm>>(
    build: (form: FormFactory2<TForm>) => TFields
  ): TFields {
    // Pick<TFields, KeyOf<TForm>> {
    const fields = build(new FormFactory2())

    // Copy name from fields collection to fields.
    forEachKeyOf(fields, (name) => {
      fields[name].name = name
    })

    return fields
  },
})

export const signalForm = <TForm>() => ({
  withFields<TFields extends FieldCollection<TForm>>(
    build: (field: FieldBuilder<TForm>) => TFields
  ): TFields {
    // const fields = build(fieldBuilder)

    throw new Error("Not implemented")
  },
})

type FieldBuilder<TForm> = <TKey extends KeyOf<TForm>>(
  name: TKey
) => {
  as: <TFieldBase extends FieldBase<TForm[TKey]>>(
    properties: Omit<TFieldBase, "name"> & FieldRules<TForm, TKey>
  ) => { [name in TKey]: Field<TForm, TKey, TFieldBase> }
}
