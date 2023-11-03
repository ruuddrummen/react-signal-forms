import { signal, Signal, computed } from "@preact/signals-react";
import { useEffect } from "react";
import { Field, FieldCollection, FieldContext, FormContext } from "./types";

const alwaysTrueSignal = signal(true);

export function useValidation(
  fields: FieldCollection,
  formContext: Signal<FormContext>
) {
  useEffect(() => {
    console.log("(Form) Initializing validation rules");

    Object.keys(fields).forEach((key) => {
      const fieldContext = formContext.value.fields[key];

      fieldContext.value.isValidSignal =
        fields[key].isValid != null
          ? computed(() => {
              console.log(`(${key}) Checking validation rule`);
              return fields[key].isValid!(fieldContext.value.value);
            })
          : alwaysTrueSignal;
    });
  }, [fields, formContext]);
}

export function useFieldValidation(
  _field: Field,
  fieldContext: Signal<FieldContext>
) {
  return fieldContext.value.isValidSignal!.value;
}
