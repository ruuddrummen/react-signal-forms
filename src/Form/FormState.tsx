import React from "react";
import { useComputed } from "@preact/signals-react";
import { FieldCollection, useFormContext } from "./types";

export const FormState: React.FC<{ fields: FieldCollection }> = ({
  fields,
}) => {
  const formContext = useFormContext();

  const formState = useComputed(() => {
    const formState = Object.keys(fields).map((key) => {
      const fieldContext = formContext.fields[key];

      return {
        ...fields[key],
        ...fieldContext.value,
      };
    });

    console.log("Form state", formState);

    return formState;
  });

  return (
    <div style={{ textAlign: "left" }}>
      <pre>{JSON.stringify(formState, null, 2)}</pre>
    </div>
  );
};
