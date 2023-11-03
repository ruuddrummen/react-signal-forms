import React, { ChangeEvent } from "react";
import { Field, FieldContext, useFormContext } from "./types";
import { FormControl, TextField } from "@mui/material";
import { Signal, useSignalEffect } from "@preact/signals-react";
import { patch } from "../signals";

interface FormInputProps {
  field: Field;
}

export const FormInput: React.FC<FormInputProps> = ({ field }) => {
  const fieldContext = useFieldContext(field);
  const isApplicable = useFieldApplicability(fieldContext);

  if (!isApplicable) {
    return null;
  }

  function onChange(event: ChangeEvent<HTMLInputElement>): void {
    console.log("Setting value to:", event.currentTarget.value);

    patch(fieldContext, { value: event.currentTarget.value });
  }

  console.log("Rendering input", field.name);

  return (
    <FormControl fullWidth margin="normal">
      <TextField
        label={field.label}
        value={fieldContext.value.value ?? ""}
        onChange={onChange}
      />
    </FormControl>
  );
};

const useFieldContext = (field: Field): Signal<FieldContext> => {
  const formContext = useFormContext();
  const fieldContext = formContext.fields[field.name];

  return fieldContext;
};

const useFieldApplicability = (fieldContext: Signal<FieldContext>) => {
  useSignalEffect(() => {
    if (!fieldContext.value.isApplicableSignal.value) {
      console.log("Clearing field value");

      patch(fieldContext, { value: null });
    }
  });

  if (fieldContext == null) {
    console.log("Field context is null");

    return false;
  }

  return fieldContext.value.isApplicableSignal.value;
};
