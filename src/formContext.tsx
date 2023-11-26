import { Signal, signal } from "@preact/signals-react"
import { createContext, useContext, useRef } from "react"
import { FieldCollection } from "."
import { FieldContext, FieldContextCollection } from "./fieldContext"
import { PropertyDescriptors, SignalFormPlugin } from "./plugins/types"
import { FormValues } from "./types"

const noop = () => ({}) as any

const ReactFormContext = createContext<IFormContext>({
  fields: {},
  fieldSignals: {},
  isSubmitting: false,
  peekValues: noop,
  setValues: noop,
  submit: noop,
})

export const useFormSignals = () => useContext(ReactFormContext)

export interface IFormContext<TForm = any> {
  fields: FieldCollection<TForm>
  fieldSignals: FieldContextCollection<TForm>
  isSubmitting: boolean
  peekValues(): FormValues
  setValues(values: FormValues): void
  submit(values: FormValues): Promise<void>
}

// TODO: add and initialize with `initialValues` parameter.
export function useFormContextProvider(
  fields: FieldCollection,
  extensions: Array<SignalFormPlugin<any, any, any>>,
  onSubmit?: (values: FormValues) => Promise<void>
) {
  const formContext = useRef<IFormContext>(
    createFormContext(fields, extensions, onSubmit)
  )

  return {
    formContext,
    ContextProvider: ReactFormContext.Provider,
  }
}

function createFormContext(
  fields: FieldCollection,
  extensions: Array<SignalFormPlugin<any, any, any>>,
  onSubmit?: (values: FormValues) => Promise<void>
) {
  const formContext = new FormContext(fields, extensions, onSubmit)

  console.log("(Form) Created field signals", formContext)

  return formContext
}

class FormContext implements IFormContext {
  private __isSubmittingSignal: Signal<boolean>
  private __onSubmit: ((values: FormValues) => Promise<void>) | undefined
  fieldSignals: FieldContextCollection<any>
  fields: FieldCollection<any>

  get isSubmitting() {
    return this.__isSubmittingSignal.value
  }

  constructor(
    fields: FieldCollection,
    extensions: Array<SignalFormPlugin<any, any, any>>,
    onSubmit?: (values: FormValues) => Promise<void>
  ) {
    this.fields = fields
    this.__isSubmittingSignal = signal(false)
    this.__onSubmit = onSubmit

    this.fieldSignals = Object.keys(fields).reduce<FieldContextCollection>(
      (prev, key) => {
        prev[key] = new FieldContext(fields[key]) // TODO add initial value.

        return prev
      },
      {}
    )

    Object.keys(fields).forEach((key) => {
      const field = fields[key]
      const fieldContext = this.fieldSignals[key] as FieldContext

      extensions.forEach((ext) => {
        const fieldExtension = ext.createFieldExtension(field, this)

        fieldContext.addExtension(
          ext.name,
          fieldExtension,
          ext.createFieldProperties?.(fieldExtension)
        )
      })
    })

    extensions.forEach((ext) => {
      if (typeof ext.createFormProperties !== "function") {
        return
      }
      const fieldSignals = Object.keys(fields).map(
        (key) => this.fieldSignals[key]
      )
      const fieldExtensions = fieldSignals.map((field) =>
        (field as FieldContext).getExtension(ext.name)
      )
      const formContextProperties = ext.createFormProperties({
        fields: fieldSignals,
        extensions: fieldExtensions,
      })

      this.addProperties(formContextProperties)
    })
  }

  peekValues = () => {
    return Object.keys(this.fieldSignals).reduce<FormValues>(
      (values, current) => {
        const field = this.fieldSignals[current] as FieldContext
        values[current] = field.peekValue()

        return values
      },
      {}
    )
  }

  setValues = (values: FormValues): void => {
    Object.keys(values).forEach((key) => {
      const field = this.fieldSignals[key]

      if (field != null) {
        field.setValue(values[key])
      }
    })
  }

  submit = async (values: FormValues): Promise<void> => {
    if (this.__onSubmit == null) {
      throw new Error("Missing value for SignalForm.onSubmit prop.")
    }

    this.__isSubmittingSignal.value = true
    await this.__onSubmit(values)
    this.__isSubmittingSignal.value = false
  }

  addProperties = <TContext,>(
    formContextProperties: PropertyDescriptors<TContext>
  ) => {
    Object.defineProperties(this, formContextProperties)
  }
}
