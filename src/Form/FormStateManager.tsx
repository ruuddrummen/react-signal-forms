import React from "react";
import { useComputed, useSignalEffect } from "@preact/signals-react";
import { FieldCollection, FormContext, FormState } from "./types";
import { useFormContext } from "./formContext";

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

function useFormState(fields: FieldCollection, formContext: FormContext) {
  return useComputed<FormState>(() => {
    const formState = Object.keys(fields).map((key) => {
      const fieldContext = formContext.fields[key];

      return {
        ...fields[key],
        ...fieldContext,
      };
    });

    console.log("(FormState) Got new state:", formState);

    return formState;
  });
}
