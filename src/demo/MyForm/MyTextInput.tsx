import { TextField } from "@/signals-form";
import { useRenderCount } from "@/utils";
import { FormControl, TextField as MuiTextField } from "@mui/material";
import React, { ChangeEvent } from "react";
import { useFieldContext } from "../App";

interface FormInputProps {
  field: TextField;
}

export const MyTextInput: React.FC<FormInputProps> = ({ field }) => {
  const fieldContext = useFieldContext(field);

  const renderCount = useRenderCount();

  // if (!fieldContext.isApplicable) {
  //   return null;
  // }

  function onChange(event: ChangeEvent<HTMLInputElement>): void {
    console.log(`(${field.name}) Setting value to:`, event.currentTarget.value);

    fieldContext.setValue(event.currentTarget.value);
  }

  console.log(`(${field.name}) Rendering input`, fieldContext.isValid);

  return (
    <FormControl fullWidth margin="normal">
      <MuiTextField
        label={`${field.label} (rendered ${renderCount.current} times)`}
        value={fieldContext.value ?? ""}
        onChange={onChange}
        error={!fieldContext.isValid}
      />
    </FormControl>
  );
};
