import { FormValues } from "."
import { KeyOf, forEachKeyOf } from "./utils"

export interface FieldBase<TValue> {
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

interface FieldRules<TForm, Key extends KeyOf<TForm>> {
  rules?: Array<FieldRule<TForm, Key>>
}

export type Field<
  TFieldBase extends FieldBase<unknown> = FieldBase<unknown>,
  TForm = any,
  TKey extends KeyOf<TForm> = KeyOf<TForm>,
> = TFieldBase & {
  rules?: Array<FieldRule<TForm, TKey>>
}

// export interface Field<TForm, Key extends KeyOf<TForm>>
//   extends FieldBase<TForm[Key]>,
//     FieldRules<TForm, Key> {}

export type SelectItem = {
  value: string
  label: string
}

// Key can be used for type safety in rule implementations, for instance with TForm[Key]
export interface FieldRule<
  TForm = FormValues,
  _Key extends KeyOf<TForm> = KeyOf<TForm>,
> {
  extension: string
}

export type FieldCollection<TForm = any> = {
  [Key in KeyOf<TForm>]: Field<FieldBase<TForm[Key]>, TForm, Key>
}

class FormFactory2<TForm> {
  field<
    TFieldBase extends FieldBase<TForm[TKey]>,
    TKey extends KeyOf<TForm> = KeyOf<TForm>,
  >(
    properties: Omit<TFieldBase, "name"> & FieldRules<TForm, TKey>
  ): Field<TFieldBase, TForm, TKey> {
    return properties as Field<TFieldBase, TForm, TKey>
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
