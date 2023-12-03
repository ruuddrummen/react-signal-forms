import { ArrayFieldBase } from "@/fields"
import { useFormContext } from "@/formContext"
import { FormValues } from "@/types"
import { useRef } from "react"
import { ArrayItemDescriptor } from "./ArrayItem"
import { IArrayFieldContext } from "./fieldContext"

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
    itemFields: field.fields,
    add: () => arrayFieldContext.addItem(),
  }
}
