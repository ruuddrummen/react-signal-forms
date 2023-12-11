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
import {
  ExpandFormContextProperties,
  PropertyDescriptors,
  SignalFormPlugin,
} from "./plugins/types"
import { FormValues } from "./types"
import { forEachKeyOf } from "./utils"

const noop = () => ({}) as any

const ReactFormContext = createContext<IFormContext>({
  fieldSpecifications: {},
  plugins: [],
  fields: {},
  isSubmitting: false,
  parent: null,
  peekValues: noop,
  setValues: noop,
  submit: noop,
})

export const useFormContext = () => useContext(ReactFormContext)

export type IFormContextLike<
  TForm = FormValues,
  TParentForm extends IFormContextLike = any,
  TPlugins extends SignalFormPlugin[] = [],
> = {
  fields: FieldContextCollection<TForm, TPlugins>
  parent: TParentForm
} & ExpandFormContextProperties<TPlugins>

export type IFormContext<
  TForm = FormValues,
  TPlugins extends SignalFormPlugin[] = [],
> = IFormContextLike<TForm, any, TPlugins> & {
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

  return formContext
}

class FormContext implements IFormContext {
  private isSubmittingSignal: Signal<boolean>
  private onSubmit: ((values: FormValues) => Promise<void>) | undefined
  fields: FieldContextCollection<any>
  fieldSpecifications: FieldCollection<any>
  plugins: Array<SignalFormPlugin>

  /**
   * The root form context does not have a parent.
   */
  parent: undefined = undefined

  constructor(
    fields: FieldCollection,
    plugins: Array<SignalFormPlugin>,
    onSubmit?: (values: FormValues) => Promise<void>,
    initialValues?: FormValues
  ) {
    this.fieldSpecifications = fields
    this.plugins = plugins
    this.isSubmittingSignal = signal(false)
    this.onSubmit = onSubmit

    this.fields = this.createFieldContextCollection(
      fields,
      initialValues,
      plugins
    )

    this.initializeFieldExtensions(fields, plugins)
    this.initializeFormExtensions(plugins, fields)
  }

  private createFieldContextCollection(
    fields: FieldCollection,
    initialValues: FormValues | undefined,
    plugins: SignalFormPlugin[]
  ) {
    return Object.keys(fields).reduce<FieldContextCollection>((prev, key) => {
      const field = fields[key]
      const initialValue = initialValues?.[key]

      prev[key] = isArrayField(field)
        ? new ArrayFieldContext(
            this,
            field,
            initialValue as FormValues[],
            plugins
          )
        : new FieldContext(fields[key], initialValue)

      return prev
    }, {})
  }

  private initializeFieldExtensions(
    fields: FieldCollection,
    plugins: SignalFormPlugin[]
  ) {
    forEachKeyOf(fields, (key) => {
      const field = fields[key]

      addFieldExtensions(this, field, plugins)
    })
  }

  private initializeFormExtensions(
    plugins: SignalFormPlugin[],
    fields: FieldCollection
  ) {
    plugins.forEach((plugin) => {
      if (typeof plugin.createFormProperties !== "function") {
        return
      }
      const fieldContext = Object.keys(fields).map((key) => this.fields[key])
      const fieldExtensions = fieldContext.map((field) =>
        (field as FieldContext).getExtension(plugin.name)
      )
      const formContextProperties = plugin.createFormProperties({
        fields: fieldContext,
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
    if (this.onSubmit == null) {
      throw new Error("Missing value for SignalForm.onSubmit prop.")
    }

    this.isSubmittingSignal.value = true
    try {
      await this.onSubmit(values)
    } finally {
      this.isSubmittingSignal.value = false
    }
  }

  get isSubmitting() {
    return this.isSubmittingSignal.value
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
