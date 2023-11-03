import { Signal, signal, useSignalEffect } from "@preact/signals-react";
import { Field, FieldCollection, FieldContext, FormContext } from "./types";
import { useEffect } from "react";
import { patch } from "../signals";

const alwaysTrueSignal = signal(true);

export function useApplicabilityRules(
  fields: FieldCollection,
  formContext: Signal<FormContext>
) {
  useEffect(() => {
    console.log("(Form) Initializing applicability rules");

    Object.keys(fields).forEach((key) => {
      formContext.value.fields[key].value.isApplicableSignal =
        fields[key].createApplicabilitySignal?.(formContext.value.fields) ??
        alwaysTrueSignal;
    });
  }, [fields, formContext]);
}

export function useFieldApplicability(
  field: Field,
  fieldContext: Signal<FieldContext>
) {
  useSignalEffect(() => {
    if (!fieldContext.value.isApplicableSignal!.value) {
      console.log(`(${field.name}) Clearing field value`);

      patch(fieldContext, { value: null });
    }
  });

  return fieldContext.value.isApplicableSignal!.value;
}
