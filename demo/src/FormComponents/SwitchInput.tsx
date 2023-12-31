import {
  FormControl,
  FormControlLabel,
  Switch as MuiSwitch,
} from "@mui/material"
import React from "react"
import { BooleanField } from "react-signal-forms"
import { useRenderCount } from "../utils"
import { InputContainer } from "./InputContainer"
import { useField } from "./SignalForm"

interface FormInputProps {
  field: BooleanField
}

export const Switch: React.FC<FormInputProps> = ({ field }) => {
  const { value, setValue, handleBlur, isApplicable, isValid } = useField(field)

  const renderCount = useRenderCount()

  if (!isApplicable) {
    return null
  }

  return (
    <InputContainer field={field}>
      <FormControl fullWidth error={!isValid}>
        <FormControlLabel
          control={<MuiSwitch />}
          label={`${field.label} ${renderCount}`}
          checked={value ?? false}
          onChange={(_e, checked) => setValue(checked)}
          onBlurCapture={handleBlur}
        />
      </FormControl>
    </InputContainer>
  )
}
