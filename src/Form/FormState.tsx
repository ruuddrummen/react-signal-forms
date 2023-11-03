import React from "react";
import { Signal, useComputed, useSignalEffect } from "@preact/signals-react";
import {
  FieldCollection,
  FormContext,
  FormState,
  useFormContext,
} from "./types";

export const FormStateManager: React.FC<{ fields: FieldCollection }> = ({
  fields,
}) => {
  const formContext = useFormContext();
  const formState = useFormState(fields, formContext);

  useSignalEffect(() => {
    localStorage.setItem("FormState", JSON.stringify(formState.value));
  });

  return (
    <div style={{ textAlign: "left" }}>
      <pre>{JSON.stringify(formState.value, null, 2)}</pre>
    </div>
  );
};

function useFormState(
  fields: FieldCollection,
  formContext: Signal<FormContext>
) {
  return useComputed<FormState | null>(() => {
    const formState = Object.keys(fields).map((key) => {
      const fieldContext = formContext.value.fields[key]?.value;

      return {
        ...fields[key],
        ...fieldContext,
      };
    });

    console.log("(FormState) Got new state:", formState);

    return formState;
  });
}
