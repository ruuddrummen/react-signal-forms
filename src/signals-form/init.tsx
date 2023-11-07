import { useMemo } from "react";
import { MergeTypes, SignalFormExtension } from "./extensions/types";
import { IFieldContext } from "./fieldContext";
import { FieldBase, FieldCollection } from "./fields";
import { useFormContext, useFormContextProvider } from "./formContext";

interface SignalsFormProps {
  fields: FieldCollection;
  extensions: Array<SignalFormExtension>;
  children: React.ReactNode;
}

export function createSignalForm<TExtensions extends SignalFormExtension[]>(
  ...extensions: TExtensions
): {
  SignalForm: React.ComponentType<{
    fields: FieldCollection;
    children: React.ReactNode;
  }>;
  useFieldSignals: <TValue>(
    field: FieldBase<TValue>
  ) => IFieldContext<TValue> & MergeTypes<TExtensions>;
} {
  return {
    SignalForm: ({ fields, children }) => {
      const SignalFormComponent = useMemo(() => {
        return (
          <SignalForm fields={fields} extensions={extensions}>
            {children}
          </SignalForm>
        );
      }, []);

      return SignalFormComponent;
    },
    useFieldSignals: function <TValue>(field: FieldBase<TValue>) {
      const formContext = useFormContext();
      let fieldContext = formContext.fields[field.name];

      return fieldContext as IFieldContext & MergeTypes<TExtensions>;
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
