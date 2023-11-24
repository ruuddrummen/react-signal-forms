import { FormControl, TextField as MuiTextField } from "@mui/material"
import React, { ChangeEvent } from "react"
import { NumberField } from "react-signal-forms"
import { useRenderCount } from "../utils"
import { InputContainer } from "./InputContainer"
import { useFieldSignals } from "./SignalForm"

interface FormInputProps {
  field: NumberField
}

export const NumberInput: React.FC<FormInputProps> = ({ field }) => {
  const { value, setValue, handleBlur, isApplicable, isValid } =
    useFieldSignals(field)

  const renderCount = useRenderCount()

  if (!isApplicable) {
    return null
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const value = event.currentTarget.value

    if (value !== "" && !isNaN(+value)) {
      setValue(parseFloat(value))
    } else {
      setValue(null)
    }
  }

  return (
    <InputContainer field={field}>
      <FormControl margin="dense" fullWidth>
        <MuiTextField
          variant="standard"
          label={`${field.label} (rendered ${renderCount} times)`}
          type="number"
          value={value ?? ""}
          onChange={handleChange}
          onBlurCapture={handleBlur}
          error={!isValid}
        />
      </FormControl>
    </InputContainer>
  )
}
