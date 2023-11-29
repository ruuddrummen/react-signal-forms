import {
  FieldContext,
  FieldContextCollection,
  IFieldContext,
} from "@/fieldContext"

import { ArrayFieldBase, ArrayItemType, Field } from "@/fields"
import { IFormContextLike, addFieldExtensions } from "@/formContext"
import { SignalFormPlugin } from "@/plugins/types"
import { FormValues } from "@/types"
import { KeysOf, forEachKeyOf } from "@/utils"
import { Signal, computed, signal } from "@preact/signals-react"

export interface IArrayFieldContext<TValue = FormValues[]>
  extends IFieldContext<TValue> {
  arrayItems: Signal<ArrayFieldItemContext<TValue>[]>
}

export interface ArrayFieldItemContext<TValue = FormValues[]>
  extends IFormContextLike<ArrayItemType<TValue>> {}

export class ArrayFieldContext<TValue extends FormValues[]>
  extends FieldContext<TValue>
  implements IArrayFieldContext<TValue>
{
  constructor(
    field: Field<any, any, ArrayFieldBase<TValue>>,
    initialValue?: TValue
  ) {
    super(field, initialValue)

    this.arrayItems = signal(
      createContextForArrayField(field, initialValue as FormValues[])
    )

    this.__valueSignal = computed<TValue>(() => {
      return this.arrayItems.value.map((item) => {
        return KeysOf(item.fields).reduce((itemValues, key) => {
          itemValues[key] = item.fields[key].value

          return itemValues
        }, {} as FormValues)
      }) as TValue
    })
  }

  arrayItems: Signal<ArrayFieldItemContext<TValue>[]>
}

export function createContextForArrayField<
  TValue extends FormValues[] = FormValues[],
>(
  field: ArrayFieldBase<TValue>,
  initialValues?: FormValues[]
): ArrayFieldItemContext<TValue>[] {
  const values = initialValues ?? field.defaultValue

  if (values == null) {
    return []
  }

  const items = values.map<ArrayFieldItemContext<TValue>>((itemValue) =>
    createContextForArrayFieldItem<TValue>(
      field,
      itemValue as ArrayItemType<TValue>
    )
  )

  return items
}

export function createContextForArrayFieldItem<
  TValue extends FormValues[] = FormValues[],
>(
  field: ArrayFieldBase<TValue>,
  itemValue: ArrayItemType<TValue>
): ArrayFieldItemContext<TValue> {
  return {
    fields: KeysOf(field.fields).reduce((contextItems, key) => {
      contextItems[key] = new FieldContext(field.fields[key], itemValue[key])

      return contextItems
    }, {} as FieldContextCollection),
  }
}

export function addFieldExtensionsToArrayItems(
  field: ArrayFieldBase<any>,
  items: ArrayFieldItemContext<FormValues[]>[],
  plugins: SignalFormPlugin<any, any, any>[]
) {
  forEachKeyOf(field.fields, (key) => {
    items.forEach((item) => {
      addFieldExtensions(item, field.fields[key], plugins)
    })
  })
}

export function isArrayFieldContext<TValue>(
  fieldContext: IFieldContext<TValue>
): fieldContext is ArrayFieldContext<AsArrayFieldValue<TValue>> {
  return (
    (fieldContext as ArrayFieldContext<AsArrayFieldValue<TValue>>).arrayItems !=
    null
  )
}

type AsArrayFieldValue<TValue> = TValue extends FormValues[] ? TValue : never
