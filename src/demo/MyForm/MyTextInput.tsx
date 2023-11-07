import { TextField } from "@/signals-form";
import { useRenderCount } from "@/utils";
import { FormControl, TextField as MuiTextField } from "@mui/material";
import React, { ChangeEvent } from "react";
import { useFieldSignals } from "./MyForm";

interface FormInputProps {
  field: TextField;
}

export const MyTextInput: React.FC<FormInputProps> = ({ field }) => {
  const { value, setValue, isApplicable, isValid } = useFieldSignals(field);

  const renderCount = useRenderCount();

  if (!isApplicable) {
    return null;
  }

  return (
    <FormControl fullWidth margin="normal">
      <MuiTextField
        label={`${field.label} (rendered ${renderCount.current} times)`}
        value={value ?? ""}
        onChange={(e) => setValue(e.currentTarget.value)}
        error={!isValid}
      />
    </FormControl>
  );
};
