import {
  FieldContextExtension,
  FieldContextExtensions,
  PropertyDescriptors,
} from "@/plugins/types"
import { KeyOf, KeysOf } from "@/utils"
import { Signal, computed, signal } from "@preact/signals-react"
import {
  ArrayFieldItemContext,
  IArrayFieldContext,
  createContextForArrayField,
} from "./arrays/fieldContext"
import { Field, isArrayField } from "./fields"
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

export class FieldContext<TValue = any>
  implements IFieldContext<TValue>, IArrayFieldContext<TValue>
{
  private __field: Field
  private __valueSignal: Signal<TValue>
  private __extensions: FieldContextExtensions
  private _blurEffects: Array<
    (event: React.FocusEvent<HTMLElement, Element>) => void
  > = []

  constructor(field: Field, initialValue?: TValue) {
    this.__field = field
    this.__extensions = {}

    if (isArrayField(field)) {
      this.arrayItems = signal(
        createContextForArrayField(field, initialValue as FormValues[])
      )
      this.__valueSignal = computed<TValue>(() => {
        return this.arrayItems!.value.map((item) => {
          return KeysOf(item.fields).reduce((itemValues, key) => {
            itemValues[key] = item.fields[key].value

            return itemValues
          }, {} as FormValues)
        }) as TValue
      })
    } else {
      this.__valueSignal = signal(initialValue ?? field.defaultValue ?? null)
    }
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
    // TODO: handle computed array field values, which cannot be set.
    if (!isArrayField(this.__field)) {
      this.__valueSignal.value = value
    }
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
  arrayItems: Signal<ArrayFieldItemContext<TValue>[]> | undefined

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
