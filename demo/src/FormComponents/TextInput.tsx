import { FormControl, TextField as MuiTextField } from "@mui/material"
import { TextField } from "react-signal-forms"
import { useRenderCount } from "../utils"
import { useFieldSignals } from "./SignalForm"

interface FormInputProps {
  field: TextField
}

export const TextInput = ({ field }: FormInputProps) => {
  const {
    inputProps,
    value,
    setValue,
    isApplicable,
    isTouched,
    isValid,
    errors,
  } = useFieldSignals(field)

  const renderCount = useRenderCount()

  if (!isApplicable) {
    return null
  }

  return (
    <FormControl margin="normal" fullWidth {...inputProps}>
      <MuiTextField
        label={`${field.label} (rendered ${renderCount.current} times)`}
        value={value ?? ""}
        onChange={(e) => setValue(e.currentTarget.value)}
        error={isTouched && !isValid}
        helperText={isTouched && errors[0]}
      />
    </FormControl>
  )
}
