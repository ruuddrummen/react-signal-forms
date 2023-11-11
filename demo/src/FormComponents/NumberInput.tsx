import { FormControl, TextField as MuiTextField } from "@mui/material"
import React, { ChangeEvent } from "react"
import { NumberField } from "react-signal-forms"
import { useRenderCount } from "../utils"
import { useFieldSignals } from "./SignalForm"

interface FormInputProps {
  field: NumberField
}

export const NumberInput: React.FC<FormInputProps> = ({ field }) => {
  const { value, setValue, isApplicable, isValid } = useFieldSignals(field)

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
    <FormControl margin="normal" fullWidth>
      <MuiTextField
        label={`${field.label} (rendered ${renderCount.current} times)`}
        type="number"
        value={value ?? ""}
        onChange={handleChange}
        error={!isValid}
      />
    </FormControl>
  )
}
