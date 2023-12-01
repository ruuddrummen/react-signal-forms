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
  addItem: () => void
  removeItem: (id: number) => void
}

export interface ArrayFieldItemContext<TValue = FormValues[]>
  extends IFormContextLike<ArrayItemType<TValue>> {
  id: any
}

export class ArrayFieldContext<TValue extends FormValues[]>
  extends FieldContext<TValue>
  implements IArrayFieldContext<TValue>
{
  protected __plugins: SignalFormPlugin[]
  lastItemId = 0

  constructor(
    field: Field<any, any, ArrayFieldBase<TValue>>,
    initialValue: TValue | undefined,
    plugins: SignalFormPlugin[]
  ) {
    super(field, initialValue)

    this.__plugins = plugins

    this.arrayItems = signal(
      createContextForArrayField(
        field,
        this.createItemId,
        initialValue as FormValues[]
      )
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

  addItem = () => {
    const newItem = createContextForArrayFieldItem(
      this.createItemId(),
      this.__field as ArrayFieldBase,
      this.__field.defaultValue as ArrayItemType<TValue>
    )

    addFieldExtensionsToArrayItems(
      this.__field as ArrayFieldBase,
      [newItem],
      this.__plugins
    )

    this.arrayItems.value = [...this.arrayItems.value, newItem]
  }

  removeItem = (id: number) => {
    this.arrayItems.value = this.arrayItems.value.filter((i) => i.id !== id)
  }

  arrayItems: Signal<ArrayFieldItemContext<TValue>[]>

  createItemId = () => ++this.lastItemId
}

export function createContextForArrayField<
  TValue extends FormValues[] = FormValues[],
>(
  field: ArrayFieldBase<TValue>,
  createItemId: () => number,
  initialValues?: FormValues[]
): ArrayFieldItemContext<TValue>[] {
  const values = initialValues ?? field.defaultValue

  if (values == null) {
    return []
  }

  const items = values.map<ArrayFieldItemContext<TValue>>((itemValue) =>
    createContextForArrayFieldItem<TValue>(
      createItemId(),
      field,
      itemValue as ArrayItemType<TValue>
    )
  )

  return items
}

export function createContextForArrayFieldItem<
  TValue extends FormValues[] = FormValues[],
>(
  id: any,
  field: ArrayFieldBase<TValue>,
  itemValue: ArrayItemType<TValue>
): ArrayFieldItemContext<TValue> {
  return {
    id,
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
