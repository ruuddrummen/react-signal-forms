import { FormControl, TextField as MuiTextField } from "@mui/material";
import React from "react";
import { TextField } from "react-signal-forms";
import { useRenderCount } from "../utils";
import { useFieldSignals } from "./SignalForm";

interface FormInputProps {
  field: TextField;
}

export const TextInput: React.FC<FormInputProps> = ({ field }) => {
  const { value, setValue, isApplicable, isValid } = useFieldSignals(field);

  const renderCount = useRenderCount();

  if (!isApplicable) {
    return null;
  }

  return (
    <FormControl margin="normal" fullWidth>
      <MuiTextField
        label={`${field.label} (rendered ${renderCount.current} times)`}
        value={value ?? ""}
        onChange={(e) => setValue(e.currentTarget.value)}
        error={!isValid}
      />
    </FormControl>
  );
};
