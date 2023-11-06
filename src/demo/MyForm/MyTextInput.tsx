import {
  TextField,
  isApplicable,
  isValid,
  useFieldContext,
} from "@/signals-form";
import { useRenderCount } from "@/utils";
import { FormControl, TextField as MuiTextField } from "@mui/material";
import React, { ChangeEvent } from "react";

interface FormInputProps {
  field: TextField;
}

export const MyTextInput: React.FC<FormInputProps> = ({ field }) => {
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
      <MuiTextField
        label={`${field.label} (rendered ${renderCount.current} times)`}
        value={fieldContext.valueSignal.value ?? ""}
        onChange={onChange}
        error={!isValid(fieldContext)}
      />
    </FormControl>
  );
};
