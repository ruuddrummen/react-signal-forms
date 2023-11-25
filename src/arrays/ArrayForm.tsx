import { ArrayFieldBase, FieldCollection } from "@/fields"
import { useFormSignals } from "@/formContext"
import React from "react"
import { IFieldContext } from ".."
import { ArrayItemContext } from "./context"

interface ArrayFormProps<TArray> {
  field: ArrayFieldBase<TArray>
  children?: (items: TArray) => React.ReactNode
}

export const ArrayForm = <TArray,>({
  field,
  children,
}: ArrayFormProps<TArray>) => {
  const { fields } = useFormSignals()
  const fieldSignals = fields[field.name] as IFieldContext<TArray>
  const items = fieldSignals.peekValue()

  return children && children(items)
}

interface ArrayItemProps<TItem> {
  item: TItem
  key: number
  children?: (fields: FieldCollection<TItem>) => React.ReactNode
}

export const ArrayFormItem = <TItem,>({
  key,
  children,
}: ArrayItemProps<TItem>) => {
  const { fieldSpecs } = useFormSignals()

  return (
    <ArrayItemContext.Provider value={{ index: key }}>
      {children && children(fieldSpecs)}
    </ArrayItemContext.Provider>
  )
}
