import {
  ExpandFieldContextProperties,
  FieldContextExtension,
  FieldContextExtensions,
  PropertyDescriptors,
  SignalFormPlugin,
} from "@/plugins/types"
import { KeyOf } from "@/utils"
import { Signal, signal } from "@preact/signals-react"
import { Field, isArrayField } from "./fields"

export type FieldContextCollection<
  TForm = any,
  TPlugins extends SignalFormPlugin[] = [],
> = {
  [Key in KeyOf<TForm>]: IFieldContext<TForm[Key], TPlugins>
}

export type IFieldContext<
  TValue = any,
  TPlugins extends SignalFormPlugin[] = [],
> = {
  name: string
  value: TValue | null
  setValue(value: TValue | null): void
  peekValue(): TValue
  handleBlur(event: React.FocusEvent<HTMLElement, Element>): void
} & ExpandFieldContextProperties<TPlugins>

export class FieldContext<TValue = any> implements IFieldContext<TValue> {
  protected __field: Field
  protected __valueSignal: Signal<TValue>
  private __extensions: FieldContextExtensions

  private __blurEffects: Array<
    (event: React.FocusEvent<HTMLElement, Element>) => void
  > = []

  constructor(field: Field, initialValue?: TValue) {
    this.__field = field
    this.__extensions = {}
    this.__valueSignal = signal(initialValue ?? field.defaultValue ?? null)
  }

  get name() {
    return this.__field.name
  }

  get value() {
    return this.__valueSignal.value
  }

  addBlurEffect = (
    effect: (event: React.FocusEvent<HTMLElement, Element>) => void
  ) => {
    this.__blurEffects.push(effect)
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
    this.__blurEffects.forEach((effect) => effect(event))
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

  toJSON() {
    const entries = Object.entries(Object.getOwnPropertyDescriptors(this))
    let proto = Object.getPrototypeOf(this)

    while (proto != null) {
      entries.push(...Object.entries(Object.getOwnPropertyDescriptors(proto)))
      proto = Object.getPrototypeOf(proto)
    }

    const jsonObj = entries
      .filter(([_key, descriptor]) => typeof descriptor.get === "function")
      .reduce((obj, [key, descriptor]) => {
        if (descriptor && key[0] !== "_") {
          try {
            const val = (this as any)[key]
            obj[key] = val
          } catch (error) {
            console.error(`Error calling getter ${key}`, error)
          }
        }

        return obj
      }, {} as any)

    return jsonObj
  }
}
