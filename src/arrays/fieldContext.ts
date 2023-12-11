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

export type IArrayFieldContext<
  TValue extends FormValues[] = FormValues[],
  TParentForm extends IFormContextLike = any,
  TPlugins extends SignalFormPlugin[] = [],
> = IFieldContext<TValue, TPlugins> & {
  arrayItems: Signal<ArrayFieldItemContext<TValue, TParentForm, TPlugins>[]>
  addItem: () => void
  removeItem: (id: number) => void
}

export type ArrayFieldItemContext<
  TValue = FormValues[],
  TParentForm extends IFormContextLike = any,
  TPlugins extends SignalFormPlugin[] = [],
> = IFormContextLike<ArrayItemType<TValue>, TParentForm, TPlugins> & {
  id: any
}

export class ArrayFieldContext<TValue extends FormValues[]>
  extends FieldContext<TValue>
  implements IArrayFieldContext<TValue>
{
  protected plugins: SignalFormPlugin[]
  private lastItemId = 0
  parentForm: IFormContextLike

  constructor(
    parentForm: IFormContextLike,
    field: Field<any, any, ArrayFieldBase<TValue>>,
    initialValue: TValue | undefined,
    plugins: SignalFormPlugin[]
  ) {
    super(field, initialValue)

    this.parentForm = parentForm
    this.plugins = plugins

    this.arrayItems = signal(
      createContextForArrayField(
        field,
        this.parentForm,
        this.createItemId,
        initialValue as FormValues[]
      )
    )

    this.valueSignal = computed<TValue>(() => {
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
      this.field as ArrayFieldBase<TValue>,
      this.parentForm,
      this.field.defaultValue as ArrayItemType<TValue>
    )

    addFieldExtensionsToArrayItems(
      this.field as ArrayFieldBase,
      [newItem],
      this.plugins
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
  parentForm: IFormContextLike,
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
      parentForm,
      itemValue as ArrayItemType<TValue>
    )
  )

  return items
}

export function createContextForArrayFieldItem<
  TValue extends FormValues[] = FormValues[],
  TParentForm extends IFormContextLike = any,
>(
  id: any,
  field: ArrayFieldBase<TValue>,
  parentForm: TParentForm,
  initialValues: ArrayItemType<TValue>
): ArrayFieldItemContext<TValue, TParentForm> {
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
    parent: parentForm,
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
