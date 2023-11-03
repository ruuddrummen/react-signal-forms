import React from "react";
import { useComputed, useSignalEffect } from "@preact/signals-react";
import { FieldCollection, FormState, useFormContext } from "./types";

export const FormStateManager: React.FC<{ fields: FieldCollection }> = ({
  fields,
}) => {
  const formContext = useFormContext();

  const formState = useComputed<FormState>(() => {
    const formState = Object.keys(fields).map((key) => {
      const fieldContext = formContext.fields[key];

      return {
        ...fields[key],
        ...fieldContext.value,
      };
    });

    console.log("(FormState) Got new state:", formState);

    return formState;
  });

  useSignalEffect(() => {
    localStorage.setItem("FormState", JSON.stringify(formState.value));
  });

  return (
    <div style={{ textAlign: "left" }}>
      <pre>{JSON.stringify(formState, null, 2)}</pre>
    </div>
  );
};
