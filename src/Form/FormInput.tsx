import React, { ChangeEvent } from "react";
import { Field } from "./types";
import { FormControl, TextField } from "@mui/material";
import { patch } from "../signals";
import { useRenderCount } from "../utils";
import { useFieldContext } from "./formContext";
import { useFieldApplicability } from "./applicabilityRules";
import { useFieldValidation } from "./validationRules";

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
