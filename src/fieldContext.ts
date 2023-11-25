import {
  FieldContextExtension,
  FieldContextExtensions,
  PropertyDescriptors,
} from "@/plugins/types"
import { KeyOf } from "@/utils"
import { Signal, signal } from "@preact/signals-react"
import { ArrayItemType, Field, FieldBase, isArrayField } from "./fields"
import { FormValues } from "./types"

export type FieldContextCollection<TForm = any> = {
  [Key in KeyOf<TForm>]: IFieldContext<TForm[Key]>
}

export interface IFieldContext<TValue = any> {
  value: TValue | null
  setValue(value: TValue | null): void
  peekValue(): TValue
  handleBlur(event: React.FocusEvent<HTMLElement, Element>): void
}

export interface IArrayFieldContext<TValue = FormValues[]>
  extends IFieldContext<TValue> {
  items: ArrayFieldContextItem<TValue>[]
}

export class FieldContext<TValue = any>
  implements IFieldContext<TValue>, IArrayFieldContext<TValue>
{
  private __valueSignal: Signal<TValue>
  private __extensions: FieldContextExtensions
  private _blurEffects: Array<
    (event: React.FocusEvent<HTMLElement, Element>) => void
  > = []

  constructor(field: Field, initialValue?: TValue) {
    this.__valueSignal = signal(initialValue ?? field.defaultValue ?? null)
    this.__extensions = {}

    this.items = isArrayField(field)
      ? createContextItemsForArrayField(field)
      : []
  }

  addBlurEffect = (
    effect: (event: React.FocusEvent<HTMLElement, Element>) => void
  ) => {
    this._blurEffects.push(effect)
  }

  get value() {
    return this.__valueSignal.value
  }

  peekValue = () => {
    return this.__valueSignal.peek()
  }

  setValue = (value: TValue) => {
    this.__valueSignal.value = value
  }

  handleBlur = (event: React.FocusEvent<HTMLElement, Element>) => {
    this._blurEffects.forEach((effect) => effect(event))
  }

  addExtension = <TExtension extends FieldContextExtension, TContext>(
    name: string,
    fieldExtension: TExtension,
    fieldContextProperties: PropertyDescriptors<TContext> | undefined
  ) => {
    this.__extensions[name] = fieldExtension

    if (fieldContextProperties != null) {
      Object.defineProperties(this, fieldContextProperties)
    }
  }

  getExtension = (name: string) => {
    return this.__extensions[name]
  }

  /**
   * Only relevant for array form fields.
   */
  items: ArrayFieldContextItem<TValue>[]

  toJSON() {
    const proto = Object.getPrototypeOf(this)
    const jsonObj: any = {}

    Object.entries(Object.getOwnPropertyDescriptors(proto))
      .concat(Object.entries(Object.getOwnPropertyDescriptors(this)))
      .filter(([_key, descriptor]) => typeof descriptor.get === "function")
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== "_") {
          try {
            const val = (this as any)[key]
            jsonObj[key] = val
          } catch (error) {
            console.error(`Error calling getter ${key}`, error)
          }
        }
      })

    return jsonObj
  }
}

function createContextItemsForArrayField<
  TValue extends FormValues[] = FormValues[],
>(field: FieldBase<TValue>): ArrayFieldContextItem<TValue>[] {
  if (!isArrayField(field) || field.defaultValue == null) {
    return []
  }

  const items = field.defaultValue.map<ArrayFieldContextItem<TValue>>(
    (itemValue) => {
      return {
        fields: Object.keys(field.fields).reduce(
          (contextItems, key) => {
            contextItems[key] = new FieldContext(
              field.fields[key],
              itemValue[key]
            )

            return contextItems
          },
          {} as Record<string, IFieldContext<any>>
        ),
      }
    }
  )

  return items
}

interface ArrayFieldContextItem<TValue> {
  fields: Record<KeyOf<ArrayItemType<TValue>>, IFieldContext<any>>
}
