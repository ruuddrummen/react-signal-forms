import { MergeTypes, SignalFormExtension } from "./extensions/types";
import { IFieldContext } from "./fieldContext";
import { FieldBase } from "./fields";
import { useFormContext } from "./formContext";

export function initSignalForms<TExtensions extends SignalFormExtension[]>(
  ...extensions: TExtensions
): {
  useFieldContext: <TValue>(
    field: FieldBase<TValue>
  ) => IFieldContext<TValue> & MergeTypes<TExtensions>;
} {
  return {
    useFieldContext: <TValue>(field: FieldBase<TValue>) => {
      const formContext = useFormContext();
      let fieldContext = formContext.fields[field.name];

      extensions.forEach((ext) => {
        ext.extendFieldContext(fieldContext);
      });

      return fieldContext as IFieldContext & MergeTypes<TExtensions>;
    },
  };
}
