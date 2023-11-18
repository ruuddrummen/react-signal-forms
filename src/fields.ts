import { FormValues } from "./types"
import { KeyOf } from "./utils"

// #region Field types

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

export type Field<
  TForm = any,
  TKey extends KeyOf<TForm> = KeyOf<TForm>,
  TFieldBase extends FieldBase<TForm[TKey]> = FieldBase<TForm[TKey]>,
> = TFieldBase & {
  rules?: Array<FieldRule<TForm, TKey>>
}

export interface FieldRule<
  TForm = FormValues,
  _Key extends KeyOf<TForm> = KeyOf<TForm>,
> {
  extension: string
}

export type FieldCollection<TForm = any> = {
  [Key in KeyOf<TForm>]: Field<TForm, Key, FieldBase<TForm[Key]>>
}

// #endregion

// #region Field builder implementation

export const signalForm = <TForm>() => ({
  withFields<TFields extends FieldCollection<TForm>>(
    build: (field: FieldBuilder<TForm>) => TFields
  ): { [Key in KeyOf<TForm>]: TFields[Key] } {
    const fields = build(createFieldBuilder<TForm>())

    // Clean up descriptor methods.
    delete (fields as any).as
    delete (fields as any).asHidden

    return fields
  },
})

const createFieldBuilder = <TForm>() => {
  const fieldBuilder: FieldBuilder<TForm> = <TKey extends KeyOf<TForm>>(
    ...args: unknown[]
  ) => {
    const name = args[0] as TKey

    if (typeof args[1] === "string") {
      // case: (string, string, properties?)
      const properties = typeof args[2] === "object" ? args[2] : {}
      const field: Field<TForm, TKey, FieldBase<TForm[TKey]>> = {
        name,
        label: args[1],
        ...(properties as any),
      }

      return createFieldDescriptor(field)
    }

    // case: (string, properties?)
    const properties = typeof args[1] === "object" ? args[1] : {}
    const field: Field<TForm, TKey, FieldBase<TForm[TKey]>> = {
      name,
      ...(properties as any),
    }

    return createFieldDescriptor(field)
  }

  return fieldBuilder
}

function createFieldDescriptor<TForm, TKey extends KeyOf<TForm>>(
  field: Field<TForm, TKey, FieldBase<TForm[TKey]>>
): FieldDescriptor<TForm, TKey, never> {
  return {
    [field.name]: field,
    as: <TFieldBase extends FieldBase<TForm[TKey]>>(
      properties: Field<TForm, TKey, TFieldBase>
    ) => {
      return {
        [field.name]: { ...field, ...properties },
      }
    },
    asHidden: () => {
      return {
        [field.name]: field,
      }
    },
  } as FieldDescriptor<TForm, TKey, never>
}

// #endregion

// #region Field builder types

type FieldBuilder<TForm> = {
  <TKey extends KeyOf<TForm>>(
    name: TKey,
    properties?: Omit<Field<TForm, TKey, FieldBase<TForm[TKey]>>, "name">
  ): FieldDescriptor<TForm, TKey, "name">

  <TKey extends KeyOf<TForm>>(
    name: TKey,
    label: string,
    properties?: Omit<
      Field<TForm, TKey, FieldBase<TForm[TKey]>>,
      "name" | "label"
    >
  ): FieldDescriptor<TForm, TKey, "name" | "label">
}

type FieldDescriptor<
  TForm,
  TKey extends KeyOf<TForm>,
  TExcept extends string | never,
> = {
  [name in TKey]: Field<TForm, TKey, FieldBase<TForm[TKey]>>
} & {
  /**
   * Extends the field with an extended field type.
   */
  as: <TFieldBase extends FieldBase<TForm[TKey]>>(
    properties: Omit<Field<TForm, TKey, TFieldBase>, TExcept>
  ) => FieldItem<TForm, TKey, TFieldBase>

  /**
   * Configures the field as hidden.
   */
  asHidden: () => FieldItem<TForm, TKey, FieldBase<TForm[TKey]>>
}

type FieldItem<
  TForm,
  TKey extends KeyOf<TForm>,
  TFieldBase extends FieldBase<TForm[TKey]>,
> = {
  [name in TKey]: Field<TForm, TKey, TFieldBase>
}

// #endregion
