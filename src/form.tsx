import React from "react"
import { IArrayFieldContext } from "./arrays/fieldContext"
import { useArrayFieldItem } from "./arrays/reactContext"
import { IFieldContext } from "./fieldContext"
import { FieldBase, FieldCollection } from "./fields"
import {
  IFormContext,
  useFormContext,
  useFormContextProvider,
} from "./formContext"
import { ExpandFieldContextProperties, SignalFormPlugin } from "./plugins/types"
import { FormValues } from "./types"

interface SignalsFormProps {
  fields: FieldCollection
  children: React.ReactNode
  initialValues?: FormValues
  onSubmit?: (values: FormValues) => Promise<void>
}

interface SignalsFormInnerProps extends SignalsFormProps {
  plugins: Array<SignalFormPlugin<any, any, any>>
}

export function configureSignalForm<
  TPlugins extends SignalFormPlugin<any, any, any>[],
>(
  ...plugins: TPlugins
): {
  SignalForm: React.ComponentType<SignalsFormProps>
  useField: <TValue>(
    field: FieldBase<TValue>
  ) => IFieldContext<TValue, TPlugins>
  useForm: () => IFormContext<FormValues, TPlugins>
} {
  return {
    SignalForm(props) {
      return <SignalForm {...props} plugins={plugins} />
    },

    useField<TValue>(field: FieldBase<TValue>) {
      if (field == null) {
        throw new Error(
          `Missing field configuration. Did you forget to add a field in createFields?`
        )
      }

      const formContext = useFormContext()
      const arrayFormItemContext = useArrayFieldItem()

      if (arrayFormItemContext != null) {
        const arrayFieldContext = formContext.fields[
          arrayFormItemContext.arrayField.name
        ] as IArrayFieldContext

        const fieldContext = arrayFieldContext.arrayItems
          .peek()
          .find((i) => i.id === arrayFormItemContext.itemId)?.fields[field.name]

        return fieldContext as IFieldContext<any, TPlugins>
      }

      const fieldContext = formContext.fields[field.name]
      return fieldContext as IFieldContext &
        ExpandFieldContextProperties<TPlugins>
    },

    useForm() {
      const formContext = useFormContext()

      return formContext as IFormContext<FormValues, TPlugins> // & ExpandFormContextProperties<TPlugins>
    },
  }
}

const SignalForm: React.FC<SignalsFormInnerProps> = ({
  fields,
  initialValues,
  plugins,
  onSubmit,
  children,
}) => {
  const { ContextProvider, formContext } = useFormContextProvider(
    fields,
    plugins,
    onSubmit,
    initialValues
  )

  console.log("Rendering SignalForm")

  return (
    <ContextProvider value={formContext.current}>{children}</ContextProvider>
  )
}
