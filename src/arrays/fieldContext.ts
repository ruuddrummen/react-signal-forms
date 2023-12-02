import {
  FieldContext,
  FieldContextCollection,
  IFieldContext,
} from "@/fieldContext"

import { ArrayFieldBase, ArrayItemType, Field } from "@/fields"
import {
  IFormContextLike,
  ParentFormContext,
  addFieldExtensions,
} from "@/formContext"
import { SignalFormPlugin } from "@/plugins/types"
import { FormValues } from "@/types"
import { KeysOf, forEachKeyOf } from "@/utils"
import { Signal, computed, signal } from "@preact/signals-react"

export type IArrayFieldContext<
  TValue extends FormValues[] = FormValues[],
  TParents extends IFormContextLike[] = any,
  TPlugins extends SignalFormPlugin[] = [],
> = IFieldContext<TValue, TPlugins> & {
  arrayItems: Signal<ArrayFieldItemContext<TValue, TParents, TPlugins>[]>
  addItem: () => void
  removeItem: (id: number) => void
}

export type ArrayFieldItemContext<
  TValue = FormValues[],
  TParents extends IFormContextLike[] = any,
  TPlugins extends SignalFormPlugin[] = [],
> = IFormContextLike<ArrayItemType<TValue>, TParents, TPlugins> & {
  id: any
}

export class ArrayFieldContext<TValue extends FormValues[]>
  extends FieldContext<TValue>
  implements IArrayFieldContext<TValue>
{
  __parentForm: IFormContextLike
  protected __plugins: SignalFormPlugin[]
  lastItemId = 0

  constructor(
    formContext: IFormContextLike,
    field: Field<any, any, ArrayFieldBase<TValue>>,
    initialValue: TValue | undefined,
    plugins: SignalFormPlugin[]
  ) {
    super(field, initialValue)

    this.__parentForm = formContext
    this.__plugins = plugins

    this.arrayItems = signal(
      createContextForArrayField(
        field,
        this.__parentForm,
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
    const newItem = createContextForArrayFieldItem<TValue>(
      this.createItemId(),
      this.__field as ArrayFieldBase<TValue>,
      this.__parentForm,
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
  form: IFormContextLike,
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
      form,
      itemValue as ArrayItemType<TValue>
    )
  )

  return items
}

export function createContextForArrayFieldItem<
  TValue extends FormValues[] = FormValues[],
  TParents extends IFormContextLike[] = any,
>(
  id: any,
  field: ArrayFieldBase<TValue>,
  parent: ParentFormContext<TParents>,
  initialValues: ArrayItemType<TValue>
): ArrayFieldItemContext<TValue, TParents> {
  const fields = KeysOf(field.fields).reduce((contextItems, key) => {
    contextItems[key] = new FieldContext(
      field.fields[key],
      initialValues?.[key]
    )

    return contextItems
  }, {} as FieldContextCollection) as FieldContextCollection<
    ArrayItemType<TValue>
  >

  return {
    id,
    parent: parent,
    fields: fields,
  }
}

export function addFieldExtensionsToArrayItems(
  field: ArrayFieldBase,
  items: ArrayFieldItemContext[],
  plugins: SignalFormPlugin[]
) {
  forEachKeyOf(field.fields, (key) => {
    items.forEach((item) => {
      addFieldExtensions(item, field.fields[key], plugins)
    })
  })
}

export function isArrayFieldContext<
  TValue,
  TPlugins extends SignalFormPlugin[] = [],
>(
  fieldContext: IFieldContext<TValue, TPlugins>
): fieldContext is IArrayFieldContext<
  AsArrayFieldValue<TValue>,
  any,
  TPlugins
> {
  return (
    (
      fieldContext as IArrayFieldContext<
        AsArrayFieldValue<TValue>,
        any,
        TPlugins
      >
    ).arrayItems != null
  )
}

type AsArrayFieldValue<TValue> = TValue extends FormValues[]
  ? TValue
  : TValue & FormValues[]
