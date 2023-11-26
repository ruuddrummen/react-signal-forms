import { ArrayFieldBase, FieldCollection } from "@/fields"
import { useFormSignals } from "@/formContext"
import React from "react"
import { IFieldContext } from ".."
import {
  ArrayFormContextProvider,
  ArrayFormItemContextProvider,
  useArrayFormContext,
} from "./context"

interface ArrayFormProps<TArray> {
  arrayField: ArrayFieldBase<TArray>
  children?: (items: TArray) => React.ReactNode
}

export const ArrayForm = <TArray,>({
  arrayField,
  children,
}: ArrayFormProps<TArray>) => {
  const { fieldSignals: fields } = useFormSignals()
  const fieldSignals = fields[arrayField.name] as IFieldContext<TArray>
  const items = fieldSignals.peekValue()

  return (
    <ArrayFormContextProvider value={{ arrayField }}>
      {children && children(items)}
    </ArrayFormContextProvider>
  )
}

interface ArrayItemProps<TItem> {
  item: TItem
  index: number
  children?: (fields: FieldCollection<TItem>) => React.ReactNode
}

export const ArrayFormItem = <TItem,>({
  index,
  children,
}: ArrayItemProps<TItem>) => {
  const arrayFormContext = useArrayFormContext()
  const arrayField = arrayFormContext?.arrayField! as ArrayFieldBase<TItem[]>

  return (
    <ArrayFormItemContextProvider value={{ index }}>
      {children && children(arrayField.fields)}
    </ArrayFormItemContextProvider>
  )
}
