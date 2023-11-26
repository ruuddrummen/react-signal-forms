import React from "react"
import { useArrayFormContext, useArrayFormItemContext } from "./arrays/context"
import { IArrayFieldContext, IFieldContext } from "./fieldContext"
import { FieldBase, FieldCollection } from "./fields"
import {
  IFormContext,
  useFormContextProvider,
  useFormSignals,
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
  initialValues?: any
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

      const formContext = useFormSignals()
      const arrayFormContext = useArrayFormContext()
      const arrayFormItemContext = useArrayFormItemContext()

      if (arrayFormContext != null && arrayFormItemContext != null) {
        const arrayFieldContext = formContext.fields[
          arrayFormContext.arrayField.name
        ] as IArrayFieldContext

        const fieldContext =
          arrayFieldContext.arrayItems![arrayFormItemContext.index].fields[
            field.name
          ]
        return fieldContext as IFieldContext &
          ExpandFieldContextProperties<TExtensions>
      }

      const fieldContext = formContext.fields[field.name]
      return fieldContext as IFieldContext &
        ExpandFieldContextProperties<TExtensions>
    },

    useFormSignals: function () {
      const formContext = useFormSignals()

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
    onSubmit
  )

  if (initialValues != null) {
    formContext.current.setValues(initialValues)
  }

  return (
    <ContextProvider value={formContext.current}>{children}</ContextProvider>
  )
}
