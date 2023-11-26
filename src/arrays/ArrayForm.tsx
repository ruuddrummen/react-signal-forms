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
} from "./reactContext"

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

  // Subscribe to `arrayItems` signal.
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

interface ArrayItemProps {
  index: number
  children?: React.ReactNode
}

export const ArrayFormItem = React.memo(
  ({ index, children }: ArrayItemProps) => {
    return (
      <ArrayFormItemContextProvider value={{ index }}>
        {children}
      </ArrayFormItemContextProvider>
    )
  }
)
