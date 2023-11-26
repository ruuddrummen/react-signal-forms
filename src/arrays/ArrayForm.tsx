import {
  IArrayFieldContext,
  createContextForArrayFieldItem,
} from "@/fieldContext"
import { ArrayFieldBase, ArrayItemType, FieldCollection } from "@/fields"
import {
  addFieldExtensionsToArrayItems,
  useFormSignals as useFormContext,
} from "@/formContext"
import { FormValues } from "@/types"
import React from "react"
import {
  ArrayFormContextProvider,
  ArrayFormItemContextProvider,
} from "./context"

interface ArrayFormProps<TArray extends FormValues[]> {
  arrayField: ArrayFieldBase<TArray>
  children?: (args: {
    items: TArray
    arrayFields: FieldCollection<ArrayItemType<TArray>>
    addItem: () => void
    removeItem: (index: number) => void
  }) => React.ReactNode
}

export const ArrayForm = <TArray extends FormValues[]>({
  arrayField,
  children,
}: ArrayFormProps<TArray>) => {
  const { fields, plugins } = useFormContext()
  const arrayFieldContext = fields[
    arrayField.name
  ] as IArrayFieldContext<TArray>
  const values = arrayFieldContext.peekValue()

  // Subscribe to `arrayItems` signals.
  arrayFieldContext.arrayItems!.value

  const addItem = () => {
    const newItem = createContextForArrayFieldItem(
      arrayField,
      arrayField.defaultValue as ArrayItemType<TArray>
    )

    addFieldExtensionsToArrayItems(arrayField, [newItem], plugins)

    arrayFieldContext.arrayItems!.value = [
      ...arrayFieldContext.arrayItems!.value,
      newItem,
    ]
  }

  const removeItem = (index: number) => {
    arrayFieldContext.arrayItems!.value =
      arrayFieldContext.arrayItems!.value.filter((_value, i) => i !== index)
  }

  return (
    <ArrayFormContextProvider value={{ arrayField }}>
      {children &&
        children({
          items: values,
          arrayFields: arrayField.fields,
          addItem,
          removeItem,
        })}
    </ArrayFormContextProvider>
  )
}

interface ArrayItemProps<TItem> {
  item: TItem
  index: number
  children?: React.ReactNode
}

export const ArrayFormItem = <TItem,>({
  item,
  index,
  children,
}: ArrayItemProps<TItem>) => {
  return (
    <ArrayFormItemContextProvider value={{ item, index }}>
      {children}
    </ArrayFormItemContextProvider>
  )
}
