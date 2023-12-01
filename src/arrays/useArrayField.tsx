import { ArrayFieldBase } from "@/fields"
import { useFormContext } from "@/formContext"
import { FormValues } from "@/types"
import React, { PropsWithChildren, useMemo, useRef } from "react"
import { IArrayFieldContext } from "./fieldContext"
import { ArrayFormItemContextProvider } from "./reactContext"

export interface ArrayItemDescriptor {
  id: number
  arrayField: ArrayFieldBase
  remove: () => void
}

export const useArrayField = <TArray extends FormValues[]>(
  field: ArrayFieldBase<TArray>
) => {
  const { fields } = useFormContext()

  const arrayFieldContext = fields[field.name] as IArrayFieldContext

  const prevItems = useRef<ArrayItemDescriptor[]>([])

  const items = arrayFieldContext.arrayItems.value.map<ArrayItemDescriptor>(
    (item) =>
      prevItems.current.find((i) => i.id === item.id) ?? {
        id: item.id,
        arrayField: field,
        remove: () => arrayFieldContext.removeItem(item.id),
      }
  )

  prevItems.current = items

  return {
    items,
    arrayFields: field.fields,
    add: () => arrayFieldContext.addItem(),
  }
}

export const ArrayItem: React.FC<
  PropsWithChildren<{ item: ArrayItemDescriptor }>
> = ({ item, children }) => {
  const value = useMemo(
    () => ({ arrayField: item.arrayField, id: item.id }),
    [item.arrayField, item.id]
  )

  return (
    <ArrayFormItemContextProvider value={value}>
      {children}
    </ArrayFormItemContextProvider>
  )
}
