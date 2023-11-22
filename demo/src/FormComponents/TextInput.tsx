import {
  Box,
  FormControl,
  TextField as MuiTextField,
  Paper,
  Typography,
} from "@mui/material"
import { TextField } from "react-signal-forms"
import { useRenderCount } from "../utils"
import { FieldInfo } from "./FieldInfo"
import { useFieldSignals } from "./SignalForm"

interface FormInputProps {
  field: TextField
}

export const TextInput = ({ field }: FormInputProps) => {
  const {
    value,
    setValue,
    handleBlur,
    isApplicable,
    isTouched,
    isRequired,
    isValid,
    errors,
  } = useFieldSignals(field)

  const renderCount = useRenderCount()

  return (
    <Paper variant="outlined">
      <Box padding={2} height={120}>
        {isApplicable ? (
          <FormControl margin="dense" fullWidth>
            <MuiTextField
              label={`${field.label} (rendered ${renderCount} times)`}
              value={value ?? ""}
              onChange={(e) => setValue(e.currentTarget.value)}
              onBlurCapture={handleBlur}
              required={isRequired}
              error={isTouched && !isValid}
              helperText={isTouched && errors[0]}
            />
          </FormControl>
        ) : (
          <Typography variant="button">Not applicable</Typography>
        )}
      </Box>
      <FieldInfo for={field} />
    </Paper>
  )
}
