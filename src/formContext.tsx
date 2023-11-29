import { Signal, signal } from "@preact/signals-react"
import { createContext, useContext, useRef } from "react"
import { Field, FieldCollection } from "."
import {
  ArrayFieldContext,
  addFieldExtensionsToArrayItems,
  isArrayFieldContext,
} from "./arrays/fieldContext"
import { FieldContext, FieldContextCollection } from "./fieldContext"
import { FieldBase, isArrayField } from "./fields"
import { PropertyDescriptors, SignalFormPlugin } from "./plugins/types"
import { FormValues } from "./types"
import { forEachKeyOf } from "./utils"

const noop = () => ({}) as any

const ReactFormContext = createContext<IFormContext>({
  fieldSpecifications: {},
  plugins: [],
  fields: {},
  isSubmitting: false,
  peekValues: noop,
  setValues: noop,
  submit: noop,
})

export const useFormContext = () => useContext(ReactFormContext)

export interface IFormContextLike<TForm = any> {
  // TODO: Add parent form context here or in array form context.
  fields: FieldContextCollection<TForm>
}

export interface IFormContext<TForm = any> extends IFormContextLike<TForm> {
  fieldSpecifications: FieldCollection<TForm>
  plugins: Array<SignalFormPlugin>
  isSubmitting: boolean
  peekValues(): FormValues
  setValues(values: FormValues): void
  submit(values: FormValues): Promise<void>
}

// TODO: add and initialize with `initialValues` parameter.
export function useFormContextProvider(
  fields: FieldCollection,
  plugins: Array<SignalFormPlugin<any, any, any>>,
  onSubmit?: (values: FormValues) => Promise<void>,
  initialValues?: FormValues
) {
  const formContext = useRef<IFormContext>(
    createFormContext(fields, plugins, onSubmit, initialValues)
  )

  return {
    formContext,
    ContextProvider: ReactFormContext.Provider,
  }
}

function createFormContext(
  fields: FieldCollection,
  extensions: Array<SignalFormPlugin<any, any, any>>,
  onSubmit?: (values: FormValues) => Promise<void>,
  initialValues?: FormValues
): IFormContext {
  const formContext = new FormContext(
    fields,
    extensions,
    onSubmit,
    initialValues
  )

  console.log("(Form) Created field signals", formContext)

  return formContext
}

class FormContext implements IFormContext {
  private __isSubmittingSignal: Signal<boolean>
  private __onSubmit: ((values: FormValues) => Promise<void>) | undefined
  fields: FieldContextCollection<any>
  fieldSpecifications: FieldCollection<any>
  plugins: Array<SignalFormPlugin>

  get isSubmitting() {
    return this.__isSubmittingSignal.value
  }

  constructor(
    fields: FieldCollection,
    plugins: Array<SignalFormPlugin<any, any, any>>,
    onSubmit?: (values: FormValues) => Promise<void>,
    initialValues?: FormValues
  ) {
    this.fieldSpecifications = fields
    this.plugins = plugins
    this.__isSubmittingSignal = signal(false)
    this.__onSubmit = onSubmit

    this.fields = Object.keys(fields).reduce<FieldContextCollection>(
      (prev, key) => {
        const field = fields[key]

        const fieldInitialValues = initialValues?.[key]

        prev[key] = isArrayField(field)
          ? new ArrayFieldContext(field, fieldInitialValues as FormValues[])
          : new FieldContext(fields[key], fieldInitialValues)

        return prev
      },
      {}
    )

    forEachKeyOf(fields, (key) => {
      const field = fields[key]

      addFieldExtensions(this, field, plugins)
    })

    plugins.forEach((ext) => {
      if (typeof ext.createFormProperties !== "function") {
        return
      }
      const fieldSignals = Object.keys(fields).map((key) => this.fields[key])
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
    return Object.keys(this.fields).reduce<FormValues>((values, current) => {
      const field = this.fields[current] as FieldContext
      values[current] = field.peekValue()

      return values
    }, {})
  }

  setValues = (values: FormValues): void => {
    Object.keys(values).forEach((key) => {
      const field = this.fields[key]

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

export function addFieldExtensions(
  formContext: IFormContextLike,
  field: Field<any, string, FieldBase<any>>,
  plugins: SignalFormPlugin<any, any, any>[]
) {
  const fieldContext = formContext.fields[field.name] as FieldContext

  plugins.forEach((plugin) => {
    const fieldExtension = plugin.createFieldExtension(field, formContext)

    fieldContext.addExtension(
      plugin.name,
      fieldExtension,
      plugin.createFieldProperties?.(fieldExtension)
    )
  })

  if (isArrayField(field) && isArrayFieldContext(fieldContext)) {
    addFieldExtensionsToArrayItems(
      field,
      fieldContext.arrayItems.value,
      plugins
    )
  }
}
