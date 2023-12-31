import { FormControl, TextField as MuiTextField } from "@mui/material"
import { TextField } from "react-signal-forms"
import { useRenderCount } from "../utils"
import { InputContainer } from "./InputContainer"
import { useField } from "./SignalForm"

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
    readonly,
    isValid,
    errors,
  } = useField(field)

  const renderCount = useRenderCount()

  return (
    <InputContainer field={field}>
      <FormControl fullWidth>
        <MuiTextField
          variant="standard"
          label={`${field.label} ${renderCount}`}
          value={value ?? ""}
          onChange={(e) => setValue(e.currentTarget.value)}
          onBlurCapture={handleBlur}
          disabled={readonly}
          required={isRequired}
          error={isTouched && !isValid}
          helperText={isTouched && errors[0]}
        />
      </FormControl>
    </InputContainer>
  )
}
