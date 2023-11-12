import { Typography } from "@mui/material"
import { useFormSignals } from "react-signal-forms"

export const FormValidationIndicator = () => {
  const context = useFormSignals()

  const formIsValid = Object.keys(context.fields).every((key) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const field = context.fields[key] as any // Yup this is a hack. Will be replaced with a `form.isValid` signal later.

    return field.isValid
  })

  return formIsValid ? (
    <Typography variant="button" color="success.main">
      ✔ Form is valid
    </Typography>
  ) : (
    <Typography variant="button" color="error.main">
      ❌ Some fields are invalid
    </Typography>
  )
}
