import { MergeTypes, SignalFormExtension } from "./extensions/types";
import { IFieldContext } from "./fieldContext";
import { FieldBase, FieldCollection } from "./fields";
import { useFormContext, useFormContextProvider2 } from "./formContext";

export function initSignalForms<TExtensions extends SignalFormExtension[]>(
  ...extensions: TExtensions
): {
  SignalsForm: React.ComponentType<{
    fields: FieldCollection;
    children: React.ReactNode;
  }>;
  useFieldContext: <TValue>(
    field: FieldBase<TValue>
  ) => IFieldContext<TValue> & MergeTypes<TExtensions>;
} {
  return {
    SignalsForm: ({ fields, children }) => {
      const { ContextProvider } = useFormContextProvider2(fields, extensions);

      return <ContextProvider>{children}</ContextProvider>;
    },
    useFieldContext: function <TValue>(field: FieldBase<TValue>) {
      const formContext = useFormContext();
      let fieldContext = formContext.fields[field.name];

      return fieldContext as IFieldContext & MergeTypes<TExtensions>;
    },
  };
}
