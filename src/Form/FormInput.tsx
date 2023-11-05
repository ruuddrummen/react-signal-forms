import React, { ChangeEvent } from "react";
import { Field } from "./types";
import { FormControl, TextField } from "@mui/material";
import { useRenderCount } from "@/utils";
import { useFieldContext } from "./formContext";
import { isApplicable } from "./extensions/applicabilityRules";
import { isValid } from "./extensions/validationRules";

interface FormInputProps {
  field: Field;
}

export const FormInput: React.FC<FormInputProps> = ({ field }) => {
  const fieldContext = useFieldContext(field);
  const renderCount = useRenderCount();

  if (!isApplicable(fieldContext)) {
    return null;
  }

  function onChange(event: ChangeEvent<HTMLInputElement>): void {
    console.log(`(${field.name}) Setting value to:`, event.currentTarget.value);

    fieldContext.valueSignal.value = event.currentTarget.value;
  }

  console.log(`(${field.name}) Rendering input`);

  return (
    <FormControl fullWidth margin="normal">
      <TextField
        label={`${field.label} (rendered ${renderCount.current} times)`}
        value={fieldContext.valueSignal.value ?? ""}
        onChange={onChange}
        error={!isValid(fieldContext)}
      />
    </FormControl>
  );
};
