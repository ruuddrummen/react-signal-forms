import { FormControl, TextField as MuiTextField } from "@mui/material"
import { TextField } from "react-signal-forms"
import { useRenderCount } from "../utils"
import { InputContainer } from "./InputContainer"
import { useFieldSignals } from "./SignalForm"

interface FormInputProps {
  field: TextField
}

export const TextInput = ({ field }: FormInputProps) => {
  const {
    value,
    setValue,
    handleBlur,
    isTouched,
    isRequired,
    isValid,
    errors,
  } = useFieldSignals(field)

  const renderCount = useRenderCount()

  return (
    <InputContainer field={field}>
      <FormControl margin="dense" fullWidth>
        <MuiTextField
          variant="standard"
          label={`${field.label} (rendered ${renderCount} times)`}
          value={value ?? ""}
          onChange={(e) => setValue(e.currentTarget.value)}
          onBlurCapture={handleBlur}
          required={isRequired}
          error={isTouched && !isValid}
          helperText={isTouched && errors[0]}
        />
      </FormControl>
    </InputContainer>
  )
}
