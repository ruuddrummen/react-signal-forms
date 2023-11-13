import { FormValues } from "./types"
import { KeyOf } from "./utils"

export interface FieldBase<TValue> {
  name: string
  label: string | null
  defaultValue: TValue | null
}

export interface Field<TForm = any, Key extends KeyOf<TForm> = KeyOf<TForm>>
  extends FieldBase<TForm[Key]> {
  rules?: Array<FieldRule<TForm, Key>>
}

export type TextField = FieldBase<string | null>
export type NumberField = FieldBase<number | null>
export type BooleanField = FieldBase<boolean | null>
export interface SelectField extends FieldBase<string | null> {
  options: SelectOption[]
}
export type SelectOption = {
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

export function createFields<TForm>(
  configure: (fieldsBuilder: IFieldCollectionBuilder<TForm>) => void
): FieldCollection<TForm> {
  const fieldCollectionBuilder = new FieldCollectionBuilder<TForm>()
  configure(fieldCollectionBuilder)

  return fieldCollectionBuilder.build()
}

export interface IFieldCollectionBuilder<TForm> {
  field<
    TField extends FieldBase<TForm[TKey]>,
    TKey extends KeyOf<TForm> = KeyOf<TForm>,
  >(
    name: TKey,
    configure: (fieldBuilder: IFieldBuilder<TField, TForm, TKey>) => void
  ): void
}

export type IFieldBuilder<
  TField extends FieldBase<TForm[TKey]>,
  TForm,
  TKey extends KeyOf<TForm>,
> = {
  label: string | null
  defaultValue: TForm[TKey] | null
  rules: Array<FieldRule<TForm, TKey>>
} & TField

class FieldCollectionBuilder<TForm> implements IFieldCollectionBuilder<TForm> {
  fieldBuilders: Array<
    FieldBuilder<FieldBase<TForm[KeyOf<TForm>]>, TForm, KeyOf<TForm>>
  > = []

  field<
    TField extends FieldBase<TForm[TKey]>,
    TKey extends KeyOf<TForm> = KeyOf<TForm>,
  >(
    name: TKey,
    configure: (fieldBuilder: FieldBuilder<TField, TForm, TKey>) => void
  ) {
    const fieldBuilder = new FieldBuilder<TField, TForm, TKey>(name)
    configure(fieldBuilder)
    this.fieldBuilders.push(fieldBuilder)
  }

  build(): FieldCollection<TForm> {
    const fields = this.fieldBuilders.reduce<FieldCollection<TForm>>(
      (fields, fieldBuilder) => {
        fields[fieldBuilder.name] = fieldBuilder.build()
        return fields
      },
      {} as FieldCollection<TForm>
    )

    return fields
  }
}

class FieldBuilder<
  TField extends FieldBase<TForm[TKey]>,
  TForm,
  TKey extends KeyOf<TForm>,
> implements IFieldBuilder<TField, TForm, TKey>
{
  name: TKey
  label: string | null = null
  defaultValue: TForm[TKey] | null = null
  rules: Array<FieldRule<TForm, TKey>> = []

  constructor(name: TKey) {
    this.name = name
  }

  build(): Field<TForm, TKey> {
    return {
      name: this.name,
      label: this.label,
      defaultValue: this.defaultValue,
      rules: this.rules,
    }
  }
}
