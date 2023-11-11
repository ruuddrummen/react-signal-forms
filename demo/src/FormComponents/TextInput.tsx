import { FormControl, TextField as MuiTextField } from "@mui/material"
import { TextField } from "react-signal-forms"
import { useRenderCount } from "../utils"
import { useFieldSignals } from "./SignalForm"

interface FormInputProps {
  field: TextField
}

export const TextInput = ({ field }: FormInputProps) => {
  const { value, setValue, isApplicable, isValid, errors } =
    useFieldSignals(field)

  const renderCount = useRenderCount()

  if (!isApplicable) {
    return null
  }

  return (
    <FormControl margin="normal" fullWidth>
      <MuiTextField
        label={`${field.label} (rendered ${renderCount.current} times)`}
        value={value ?? ""}
        onChange={(e) => setValue(e.currentTarget.value)}
        error={!isValid}
        helperText={errors[0]}
      />
    </FormControl>
  )
}
