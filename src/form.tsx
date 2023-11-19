import React, { useMemo } from "react"
import {
  ExpandFieldContextProperties,
  ExpandFormContextProperties,
  SignalFormExtension,
} from "./extensions/types"
import { IFieldContext } from "./fieldContext"
import { FieldBase, FieldCollection } from "./fields"
import {
  IFormContext,
  useFormContextProvider,
  useFormSignals,
} from "./formContext"
import { FormValues } from "./types"

interface SignalsFormProps {
  fields: FieldCollection
  children: React.ReactNode
  initialValues?: any
  onSubmit?: (values: FormValues) => Promise<void>
}

interface SignalsFormInnerProps extends SignalsFormProps {
  extensions: Array<SignalFormExtension<any, any, any>>
}

export function configureSignalForm<
  TExtensions extends SignalFormExtension<any, any, any>[],
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
      const SignalFormComponent = useMemo(() => {
        return <SignalForm {...props} extensions={extensions} />
      }, [props])

      return SignalFormComponent
    },
    useFieldSignals: function <TValue>(field: FieldBase<TValue>) {
      if (field == null) {
        throw new Error(
          `Missing field configuration. Did you forget to add a field in createFields?`
        )
      }

      const formContext = useFormSignals()
      return formContext.fields[field.name] as IFieldContext &
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
