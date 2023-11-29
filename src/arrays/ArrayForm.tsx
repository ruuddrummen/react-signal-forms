import { ArrayFieldBase, ArrayItemType, FieldCollection } from "@/fields"
import { useFormContext } from "@/formContext"
import { FormValues } from "@/types"
import React from "react"
import {
  IArrayFieldContext,
  addFieldExtensionsToArrayItems,
  createContextForArrayFieldItem,
} from "./fieldContext"
import {
  ArrayFormContextProvider,
  ArrayFormItemContextProvider,
  ArrayItemDescriptor,
} from "./reactContext"

interface ArrayFormProps<TArray extends FormValues[]> {
  arrayField: ArrayFieldBase<TArray>
  children?: (args: {
    items: ArrayItemDescriptor[]
    arrayFields: FieldCollection<ArrayItemType<TArray>>
    addItem: () => void
    removeItem: (item: ArrayItemDescriptor) => void
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

  const items = arrayFieldContext.arrayItems.value.map<ArrayItemDescriptor>(
    (_item, index) => ({
      id: index,
    })
  )

  const addItem = () => {
    const newItem = createContextForArrayFieldItem(
      arrayField,
      arrayField.defaultValue as ArrayItemType<TArray>
    )

    addFieldExtensionsToArrayItems(arrayField, [newItem], plugins)

    arrayFieldContext.arrayItems.value = [
      ...arrayFieldContext.arrayItems.value,
      newItem,
    ]
  }

  const removeItem = (item: ArrayItemDescriptor) => {
    arrayFieldContext.arrayItems.value =
      arrayFieldContext.arrayItems.value.filter((_value, i) => i !== item.id)
  }

  return (
    <ArrayFormContextProvider value={{ arrayField }}>
      {children &&
        children({
          items: items,
          arrayFields: arrayField.fields,
          addItem,
          removeItem,
        })}
    </ArrayFormContextProvider>
  )
}

interface ArrayItemProps {
  item: ArrayItemDescriptor
  children?: React.ReactNode
}

export const ArrayFormItem = React.memo(
  ({ item, children }: ArrayItemProps) => {
    return (
      <ArrayFormItemContextProvider value={item}>
        {children}
      </ArrayFormItemContextProvider>
    )
  }
)
