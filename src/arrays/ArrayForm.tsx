import { ArrayFieldBase, ArrayItemType, FieldCollection } from "@/fields"
import { useFormContext } from "@/formContext"
import { FormValues } from "@/types"
import { useSignal } from "@preact/signals-react"
import React, { memo, useCallback, useMemo } from "react"
import { createPortal } from "react-dom"
import { IArrayFieldContext } from "./fieldContext"
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
    addItem: () => void
    removeItem: (item: ArrayItemDescriptor) => void
  }) => React.ReactNode
}

export const ArrayForm = <TArray extends FormValues[]>({
  arrayField,
  renderItem,
  children,
}: ArrayFormProps<TArray>) => {
  const { fields } = useFormContext()

  const arrayFieldContext = fields[
    arrayField.name
  ] as IArrayFieldContext<TArray>

  const portalRefs = useSignal<Record<number, HTMLElement>>({})

  const items = arrayFieldContext.arrayItems.value.map<ArrayItemDescriptor>(
    (_item) => ({
      id: _item.id,
      containerRef: (ref) => {
        if (portalRefs.value[_item.id] == null) {
          portalRefs.value = { ...portalRefs.value, [_item.id]: ref }
        }
      },
    })
  )

  const addItem = () => {
    arrayFieldContext.addItem()
  }

  const removeItem = (item: ArrayItemDescriptor) => {
    arrayFieldContext.arrayItems.value =
      arrayFieldContext.arrayItems.value.filter((_value, i) => i !== item.id)
  }

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
          addItem,
          removeItem,
        })}
      {Object.entries(portalRefs.value).map(([id, ref]) =>
        createPortal(
          <ArrayFormItem
            key={id}
            id={Number(id)}
            arrayField={arrayField}
            renderItem={renderItemCallback}
          />,
          ref
        )
      )}
    </ArrayFormContextProvider>
  )
}

interface ArrayFormItemProps {
  id: number
  arrayField: ArrayFieldBase
  renderItem: (fields: FieldCollection) => React.ReactNode
}

const ArrayFormItem = memo(
  ({ id, arrayField, renderItem }: ArrayFormItemProps) => (
    <React.Fragment>
      <ArrayFormItemContextProvider value={{ id, arrayField }}>
        {renderItem(arrayField.fields)}
      </ArrayFormItemContextProvider>
    </React.Fragment>
  )
)
