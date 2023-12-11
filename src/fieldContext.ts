import {
  ExpandFieldContextProperties,
  FieldContextExtension,
  FieldContextExtensions,
  FieldExtension,
  PropertyDescriptors,
  SignalFormPlugin,
} from "@/plugins/types"
import { KeyOf } from "@/utils"
import { Signal, signal } from "@preact/signals-react"
import { Field, isArrayField } from "./fields"

export type FieldContextCollection<
  TForm = any,
  TPlugins extends SignalFormPlugin[] = [],
> = unknown extends TForm
  ? // Fall back to a less specific type if `TForm` is unknown.
    Record<string, IFieldContext<any, TPlugins>>
  : {
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
} & ExpandFieldContextProperties<TPlugins, TValue>

export class FieldContext<TValue = any> implements IFieldContext<TValue> {
  protected field: Field
  protected valueSignal: Signal<TValue>
  private extensions: FieldContextExtensions

  private blurEffects: Array<
    (event: React.FocusEvent<HTMLElement, Element>) => void
  > = []

  constructor(field: Field, initialValue?: TValue) {
    this.field = field
    this.extensions = {}
    this.valueSignal = signal(initialValue ?? field.defaultValue ?? null)
  }

  get name() {
    return this.field.name
  }

  get value() {
    return this.valueSignal.value
  }

  addBlurEffect = (
    effect: (event: React.FocusEvent<HTMLElement, Element>) => void
  ) => {
    this.blurEffects.push(effect)
  }

  peekValue = () => {
    return this.valueSignal.peek()
  }

  setValue = (value: TValue) => {
    // TODO: handle computed array field values, which cannot be set.
    if (!isArrayField(this.field)) {
      this.valueSignal.value = value
    }
  }

  handleBlur = (event: React.FocusEvent<HTMLElement, Element>) => {
    this.blurEffects.forEach((effect) => effect(event))
  }

  addExtension = <TExtension extends FieldContextExtension, TContext>(
    name: string,
    fieldExtension: TExtension,
    fieldContextProperties: PropertyDescriptors<TContext> | undefined
  ) => {
    this.extensions[name] = fieldExtension

    if (fieldContextProperties != null) {
      Object.defineProperties(this, fieldContextProperties)
    }
  }

  getExtension = <TPlugin extends SignalFormPlugin>(name: string) => {
    return this.extensions[name] as FieldExtension<TPlugin>
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
