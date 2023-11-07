import { TextField } from "@/signals-form";
import { useRenderCount } from "@/utils";
import { FormControl, TextField as MuiTextField } from "@mui/material";
import React, { ChangeEvent } from "react";
import { useFieldSignals } from "../App";

interface FormInputProps {
  field: TextField;
}

export const MyTextInput: React.FC<FormInputProps> = ({ field }) => {
  const { value, setValue, isApplicable, isValid } = useFieldSignals(field);

  const renderCount = useRenderCount();

  if (!isApplicable) {
    return null;
  }

  function onChange(event: ChangeEvent<HTMLInputElement>): void {
    console.log(`(${field.name}) Setting value to:`, event.currentTarget.value);

    setValue(event.currentTarget.value);
  }

  // console.log(`(${field.name}) Rendering input`);

  return (
    <FormControl fullWidth margin="normal">
      <MuiTextField
        label={`${field.label} (rendered ${renderCount.current} times)`}
        value={value ?? ""}
        onChange={onChange}
        error={!isValid}
      />
    </FormControl>
  );
};
