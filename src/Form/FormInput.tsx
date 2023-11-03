import React, { ChangeEvent } from "react";
import { Field, FieldContext, useFormContext } from "./types";
import { FormControl, TextField } from "@mui/material";
import { Signal, useSignalEffect } from "@preact/signals-react";
import { patch } from "../signals";
import { ensureNotNull, useRenderCount } from "../utils";

interface FormInputProps {
  field: Field;
}

export const FormInput: React.FC<FormInputProps> = ({ field }) => {
  const fieldContext = useFieldContext(field);
  const isApplicable = useFieldApplicability(field, fieldContext);
  const isValid = useFieldValidation(field, fieldContext);
  const renderCount = useRenderCount();

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
        label={`${field.label} (rendered ${renderCount.current} times)`}
        value={fieldContext.value.value ?? ""}
        onChange={onChange}
        error={!isValid}
      />
    </FormControl>
  );
};

const useFieldContext = (field: Field): Signal<FieldContext> => {
  const formContext = useFormContext();
  const fieldContext = formContext.value.fields[field.name];

  return fieldContext;
};

const useFieldApplicability = (
  field: Field,
  fieldContext: Signal<FieldContext>
) => {
  useSignalEffect(() => {
    if (fieldContext == null) {
      return;
    }

    ensureNotNull("isApplicableSignal", fieldContext.value.isApplicableSignal);

    if (!fieldContext.value.isApplicableSignal!.value) {
      console.log(`(${field.name}) Clearing field value`);

      patch(fieldContext, { value: null });
    }
  });

  if (fieldContext == null) {
    return false;
  }

  return fieldContext.value.isApplicableSignal!.value;
};

const useFieldValidation = (
  field: Field,
  fieldContext: Signal<FieldContext>
) => {
  if (fieldContext == null) {
    return true;
  }

  return fieldContext.value.isValidSignal!.value;
};
