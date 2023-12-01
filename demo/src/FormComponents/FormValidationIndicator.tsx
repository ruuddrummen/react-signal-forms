import { Typography } from "@mui/material"
import { useRenderCount } from "../utils"
import { useForm } from "./SignalForm"

export const FormValidationIndicator = () => {
  const form = useForm()
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
