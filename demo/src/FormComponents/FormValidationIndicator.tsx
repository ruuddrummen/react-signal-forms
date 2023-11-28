import { Typography } from "@mui/material"
import { useRenderCount } from "../utils"
import { useFormSignals } from "./SignalForm"

export const FormValidationIndicator = () => {
  const form = useFormSignals()
  const renderCount = useRenderCount()

  return form.isValid ? (
    <Typography variant="button" color="success.main">
      ✔ Form is valid {renderCount}
    </Typography>
  ) : (
    <Typography variant="button" color="error.main">
      ❌ {form.invalidFields.length} fields are invalid {renderCount}
    </Typography>
  )
}
