import React from "react"
import { IArrayFieldContext } from "./arrays/fieldContext"
import { useArrayFormItem } from "./arrays/reactContext"
import { IFieldContext } from "./fieldContext"
import { FieldBase, FieldCollection } from "./fields"
import {
  IFormContext,
  useFormContext,
  useFormContextProvider,
} from "./formContext"
import {
  ExpandFieldContextProperties,
  ExpandFormContextProperties,
  SignalFormPlugin,
} from "./plugins/types"
import { FormValues } from "./types"

interface SignalsFormProps {
  fields: FieldCollection
  children: React.ReactNode
  initialValues?: FormValues
  onSubmit?: (values: FormValues) => Promise<void>
}

interface SignalsFormInnerProps extends SignalsFormProps {
  extensions: Array<SignalFormPlugin<any, any, any>>
}

export function configureSignalForm<
  TExtensions extends SignalFormPlugin<any, any, any>[],
>(
  ...extensions: TExtensions
): {
  SignalForm: React.ComponentType<SignalsFormProps>
  useFieldSignals: <TValue>(
    field: FieldBase<TValue>
  ) => IFieldContext<TValue> & ExpandFieldContextProperties<TExtensions>
  useFormSignals: () => IFormContext & ExpandFormContextProperties<TExtensions>
} {
  return {
    SignalForm: (props) => {
      return <SignalForm {...props} extensions={extensions} />
    },

    useFieldSignals: function <TValue>(field: FieldBase<TValue>) {
      if (field == null) {
        throw new Error(
          `Missing field configuration. Did you forget to add a field in createFields?`
        )
      }

      const formContext = useFormContext()
      // const arrayFormContext = useArrayFormContext()
      const arrayFormItemContext = useArrayFormItem()

      if (arrayFormItemContext != null) {
        const arrayFieldContext = formContext.fields[
          arrayFormItemContext.arrayField.name
        ] as IArrayFieldContext

        const fieldContext = arrayFieldContext.arrayItems
          .peek()
          .find((i) => i.id === arrayFormItemContext.itemId)?.fields[field.name]

        return fieldContext as IFieldContext &
          ExpandFieldContextProperties<TExtensions>
      }

      const fieldContext = formContext.fields[field.name]
      return fieldContext as IFieldContext &
        ExpandFieldContextProperties<TExtensions>
    },

    useFormSignals: function () {
      const formContext = useFormContext()

      return formContext as IFormContext &
        ExpandFormContextProperties<TExtensions>
    },
  }
}

const SignalForm: React.FC<SignalsFormInnerProps> = ({
  fields,
  initialValues,
  extensions,
  onSubmit,
  children,
}) => {
  const { ContextProvider, formContext } = useFormContextProvider(
    fields,
    extensions,
    onSubmit,
    initialValues
  )

  console.log("Rendering SignalForm")

  return (
    <ContextProvider value={formContext.current}>{children}</ContextProvider>
  )
}
