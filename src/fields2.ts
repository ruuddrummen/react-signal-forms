import { FormValues } from "."
import { KeyOf } from "./utils"

// export interface FieldBase<TValue> {
//   name: string
//   label: string | null
//   defaultValue: TValue | null
// }

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

// interation 1

const createFields1 = () => {
  return {
    select: {
      name: "select",
      label: null,
      options: [],
    } as SelectField,
  }
}

const fields1 = createFields1()

// iteration 2

const createFields2 = <TFields>(build: () => TFields) => {
  return build()
}

const fields2 = createFields2(() => {
  return {
    select: {
      name: "select",
      label: null,
      options: [],
    } as SelectField,
  }
})

// iteration 3

const fieldsFactory3 = {
  field<TField extends Field<any>>(
    name: string,
    addProps: () => Omit<TField, "name">
  ): TField {
    return {
      name: name,
      ...addProps(),
    } as TField
  },
}

const createFields3 = <TFields>(
  build: (factory: typeof fieldsFactory3) => TFields
) => {
  return build(fieldsFactory3)
}

const fields3 = createFields3((factory) => {
  return {
    select: factory.field<SelectField>("select", () => ({
      label: "test",
      options: [],
    })),
  }
})

// iteration 4

interface IFormFactory4<TData> {
  field<TField extends Field<any>, TKey extends keyof TData = keyof TData>(
    name: TKey,
    properties: Omit<TField, "name">
  ): { [key: string]: TField }
}

class FormFactory4<TData> implements IFormFactory4<TData> {
  field<TKey extends keyof TData, TField extends Field<any>>(
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

// const formFactory4 = {
//   field<TField extends Field<any>>(
//     name: TKey,
//     addProps: () => Omit<TField, "name">
//   ): { [n: typeof name]: TField } {
//     return {
//       [name]: { name, ...addProps() } as TField,
//     }
//   },
// }

// export type FieldCollection4<TForm = any> = {
//   [Key in KeyOf<TForm>]: Field<TForm[Key], TForm, Key>
// }

const createFields4 = <TData, TFields = any>(
  build: (factory: IFormFactory4<TData>) => TFields
) => {
  return build(new FormFactory4())
}

const fields4 = createFields4((form) => {
  return {
    ...form.field("select", () => ({
      label: "test",
      options: [],
    })),
  }
})

// iteration 5

interface IFormFactory5<TData> {
  field<TField extends Field<any>, TKey extends keyof TData = keyof TData>(
    name: TKey,
    properties: Omit<TField, "name">
  ): TField
}

class FormFactory5<TData> implements IFormFactory5<TData> {
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
      formFactory: IFormFactory5<TData>
    ) => FieldCollection<TData> & TFields
  ): TFields {
    const fields = build(new FormFactory5<TData>())

    return fields as TFields //as AsFieldCollection<TData, TFields>
  },
})

const fields = createForm<TData>().createFields((form) => {
  return {
    select: form.field<SelectField>("select", {
      label: "test",
      options: [],
    }),
  }
})
