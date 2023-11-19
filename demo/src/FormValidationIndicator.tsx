import { Typography } from "@mui/material"
import { useComputed } from "@preact/signals-react"
import { useFormSignals } from "react-signal-forms"

export const FormValidationIndicator = () => {
  const form = useFormSignals()

  const formIsValidSignal = useComputed(() =>
    Object.keys(form.fields).every((key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const field = form.fields[key] as any // Yup this is a hack. Will be replaced with a `form.isValid` signal later.

      return field.isValid
    })
  )

  return formIsValidSignal.value ? (
    <Typography variant="button" color="success.main">
      ✔ Form is valid
    </Typography>
  ) : (
    <Typography variant="button" color="error.main">
      ❌ Some fields are invalid
    </Typography>
  )
}
