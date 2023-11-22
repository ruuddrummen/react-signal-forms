import {
  Box,
  FormControl,
  FormControlLabel,
  Switch as MuiSwitch,
  Paper,
} from "@mui/material"
import React from "react"
import { BooleanField } from "react-signal-forms"
import { useRenderCount } from "../utils"
import { FieldInfo } from "./FieldInfo"
import { useFieldSignals } from "./SignalForm"

interface FormInputProps {
  field: BooleanField
}

export const Switch: React.FC<FormInputProps> = ({ field }) => {
  const { value, setValue, handleBlur, isApplicable, isValid } =
    useFieldSignals(field)

  const renderCount = useRenderCount()

  if (!isApplicable) {
    return null
  }

  return (
    <Paper variant="outlined">
      <Box height={60} marginBottom={2} padding={1} paddingLeft={4}>
        <FormControl margin="dense" fullWidth error={!isValid}>
          <FormControlLabel
            control={<MuiSwitch />}
            label={`${field.label} (rendered ${renderCount} times)`}
            checked={value ?? false}
            onChange={(_e, checked) => setValue(checked)}
            onBlurCapture={handleBlur}
          />
        </FormControl>
      </Box>
      <FieldInfo for={field} />
    </Paper>
  )
}
