import { Signal, signal } from "@preact/signals-react"
import {
  FieldContextExtension,
  FieldContextExtensions,
  PropertyDescriptors,
} from "./extensions/types"
import { KeyOf } from "./utils"

export type FieldContextCollection<TForm = any> = {
  [Key in KeyOf<TForm>]: IFieldContext<TForm[Key]>
}

export interface IFieldContext<TValue = any> {
  value: TValue | null
  setValue(value: TValue | null): void
  peekValue(): TValue
  handleBlur(event: React.FocusEvent<HTMLElement, Element>): void
}

export class FieldContext<TValue = any> implements IFieldContext<TValue> {
  private __valueSignal: Signal<TValue>
  private __extensions: FieldContextExtensions

  constructor(value: TValue) {
    this.__valueSignal = signal(value)
    this.__extensions = {}
  }

  addBlurEffect = (
    effect: (event: React.FocusEvent<HTMLElement, Element>) => void
  ) => {
    this.handleBlur = (event: React.FocusEvent<HTMLElement, Element>) => {
      effect(event)
      this.handleBlur(event)
    }
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

  handleBlur = (_event: React.FocusEvent<HTMLElement, Element>) => {
    /* Do nothing */
  }

  addExtension = <TExtension extends FieldContextExtension, TContext>(
    name: string,
    fieldExtension: TExtension,
    fieldContextProperties: PropertyDescriptors<TContext>
  ) => {
    this.__extensions[name] = fieldExtension

    Object.defineProperties(this, fieldContextProperties)
  }

  getExtension = (name: string) => {
    return this.__extensions[name]
  }
}
