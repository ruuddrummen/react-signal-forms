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
  const isApplicable = useFieldApplicability(field, fieldContext);

  if (!isApplicable) {
    return null;
  }

  function onChange(event: ChangeEvent<HTMLInputElement>): void {
    console.log(`(${field.name}) Setting value to:`, event.currentTarget.value);

    patch(fieldContext, { value: event.currentTarget.value });
  }

  console.log(`(${field.name}) Rendering input`);

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

const useFieldApplicability = (
  field: Field,
  fieldContext: Signal<FieldContext>
) => {
  useSignalEffect(() => {
    if (!fieldContext.value.isApplicableSignal.value) {
      console.log(`(${field.name}) Clearing field value`);

      patch(fieldContext, { value: null });
    }
  });

  return fieldContext.value.isApplicableSignal.value;
};
