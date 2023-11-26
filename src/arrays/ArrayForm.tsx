import { ArrayFieldBase, ArrayItemType, FieldCollection } from "@/fields"
import { useFormSignals } from "@/formContext"
import React from "react"
import { IFieldContext } from ".."
import {
  ArrayFormContextProvider,
  ArrayFormItemContextProvider,
} from "./context"

interface ArrayFormProps<TArray> {
  arrayField: ArrayFieldBase<TArray>
  children?: (args: {
    items: TArray
    arrayFields: FieldCollection<ArrayItemType<TArray>>
  }) => React.ReactNode
}

export const ArrayForm = <TArray,>({
  arrayField,
  children,
}: ArrayFormProps<TArray>) => {
  const { fields: allFieldSignals } = useFormSignals()
  const fieldSignals = allFieldSignals[arrayField.name] as IFieldContext<TArray>
  const items = fieldSignals.peekValue()

  return (
    <ArrayFormContextProvider value={{ arrayField }}>
      {children && children({ items, arrayFields: arrayField.fields })}
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
