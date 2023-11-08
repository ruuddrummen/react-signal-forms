import { BooleanField } from "@/signal-forms";
import { useRenderCount } from "@/utils";
import { FormControl, FormControlLabel, Switch } from "@mui/material";
import React from "react";
import { useFieldSignals } from "./MyForm";

interface FormInputProps {
  field: BooleanField;
}

export const MySwitch: React.FC<FormInputProps> = ({ field }) => {
  const { value, setValue, isApplicable, isValid } = useFieldSignals(field);

  const renderCount = useRenderCount();

  if (!isApplicable) {
    return null;
  }

  return (
    <FormControl margin="normal" error={!isValid}>
      <FormControlLabel
        control={<Switch />}
        label={`${field.label} (rendered ${renderCount.current} times)`}
        checked={value ?? false}
        onChange={(_e, checked) => setValue(checked)}
      />
    </FormControl>
  );
};
