import { useMemo } from "react";
import {
  MergeFieldContextProperties,
  SignalFormExtension,
} from "./extensions/types";
import { IFieldContext } from "./fieldContext";
import { FieldBase, FieldCollection } from "./fields";
import { useFormSignals, useFormContextProvider } from "./formContext";

interface SignalsFormProps {
  fields: FieldCollection;
  extensions: Array<SignalFormExtension<any, any>>;
  children: React.ReactNode;
}

export function createSignalForm<
  TExtensions extends SignalFormExtension<any, any>[]
>(
  ...extensions: TExtensions
): {
  SignalForm: React.ComponentType<{
    fields: FieldCollection;
    children: React.ReactNode;
  }>;
  useFieldSignals: <TValue>(
    field: FieldBase<TValue>
  ) => IFieldContext<TValue> & MergeFieldContextProperties<TExtensions>;
} {
  return {
    SignalForm: ({ fields, children }) => {
      const SignalFormComponent = useMemo(() => {
        return (
          <SignalForm fields={fields} extensions={extensions}>
            {children}
          </SignalForm>
        );
      }, [children, fields]);

      return SignalFormComponent;
    },
    useFieldSignals: function <TValue>(field: FieldBase<TValue>) {
      if (field == null) {
        throw new Error(
          `Missing field configuration. Did you forget to add a field in createFields?`
        );
      }

      const formContext = useFormSignals();
      return formContext.fields[field.name] as IFieldContext &
        MergeFieldContextProperties<TExtensions>;
    },
  };
}

const SignalForm: React.FC<SignalsFormProps> = ({
  fields,
  extensions,
  children,
}) => {
  const { ContextProvider, formContext } = useFormContextProvider(
    fields,
    extensions
  );

  return (
    <ContextProvider value={formContext.current}>{children}</ContextProvider>
  );
};
