import { ArrayFieldBase, ArrayItemType, FieldCollection } from "@/fields"
import { useFormContext } from "@/formContext"
import { FormValues } from "@/types"
import { useSignal } from "@preact/signals-react"
import React, { memo, useCallback, useMemo } from "react"
import { createPortal } from "react-dom"
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
  renderItem: (
    fields: FieldCollection<ArrayItemType<TArray>>
  ) => React.ReactNode
  children?: (args: {
    items: ArrayItemDescriptor[]
    itemComponents: React.JSX.Element[]
    arrayFields: FieldCollection<ArrayItemType<TArray>>
    addItem: () => void
    removeItem: (item: ArrayItemDescriptor) => void
  }) => React.ReactNode
}

const PortaledArrayFormItem = memo(
  ({
    id,
    // fields,
    arrayField,
    renderItem,
  }: {
    id: number
    arrayField: ArrayFieldBase
    // fields: FieldCollection
    renderItem: (fields: FieldCollection) => React.ReactNode
  }) => (
    <React.Fragment>
      <ArrayFormItem id={id} arrayField={arrayField}>
        {renderItem(arrayField.fields)}
      </ArrayFormItem>
    </React.Fragment>
  )
)

export const ArrayForm = <TArray extends FormValues[]>({
  arrayField,
  renderItem,
  children,
}: ArrayFormProps<TArray>) => {
  const { fields, plugins } = useFormContext()

  const arrayFieldContext = fields[
    arrayField.name
  ] as IArrayFieldContext<TArray>

  const portalRefs = useSignal<Record<number, HTMLElement>>({})

  const items = arrayFieldContext.arrayItems.value.map<ArrayItemDescriptor>(
    (_item, index) => ({
      id: index,
      ref: (ref) => {
        if (portalRefs.value[index] == null) {
          console.log("Adding portal ref", index)
          portalRefs.value = { ...portalRefs.value, [index]: ref }
        }
      },
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

  const itemComponents = items.map((item) => (
    <div id={`array-item-${item.id}`} />
  ))

  const renderItemCallback = useCallback(
    () => renderItem(arrayField.fields),
    []
  )

  const contextValue = useMemo(() => ({ arrayField }), [])

  return (
    <ArrayFormContextProvider value={contextValue}>
      {children &&
        children({
          items: items,
          itemComponents: itemComponents,
          arrayFields: arrayField.fields,
          addItem,
          removeItem,
        })}
      {Object.entries(portalRefs.value).map(([id, ref]) =>
        createPortal(
          <PortaledArrayFormItem
            key={id}
            id={Number(id)}
            // fields={arrayField.fields}
            arrayField={arrayField}
            renderItem={renderItemCallback}
          ></PortaledArrayFormItem>,
          ref
        )
      )}
    </ArrayFormContextProvider>
  )
}

interface ArrayItemProps {
  id: number
  arrayField: ArrayFieldBase
  // item: ArrayItemDescriptor
  children?: React.ReactNode
}

export const ArrayFormItem = React.memo(
  ({ id, arrayField, children }: ArrayItemProps) => {
    const contextValue = useMemo(() => ({ arrayField, id }), [arrayField, id])

    console.log("Rendering ArrayFormItemContextProvider")

    return (
      <ArrayFormItemContextProvider value={contextValue}>
        {children}
      </ArrayFormItemContextProvider>
    )
  }
)
