import { FormValues } from "."
import { KeyOf, forEachKeyOf } from "./utils"

export interface FieldBase<TValue> {
  name: string
  label: string | null
  defaultValue?: TValue
}

export interface Field<TForm, Key extends KeyOf<TForm>>
  extends FieldBase<TForm[Key]> {
  rules?: Array<FieldRule<TForm, Key>>
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

// Key can be used for type safety in rule implementations, for instance with TForm[Key]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FieldRule<
  TForm = FormValues,
  _Key extends KeyOf<TForm> = KeyOf<TForm>,
> {
  extension: string
}

export type FieldCollection<TForm = any> = {
  [Key in KeyOf<TForm>]: FieldBase<TForm[Key]> & Field<TForm, Key>
}

class FormFactory2<TForm> {
  field<
    TFieldBase extends FieldBase<TForm[TKey]>,
    TKey extends KeyOf<TForm> = KeyOf<TForm>,
  >(
    properties: TFieldBase & Field<TForm, TKey>
  ): TFieldBase & Field<TForm, TKey> {
    return properties as TFieldBase & Field<TForm, TKey>
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
