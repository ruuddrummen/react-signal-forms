/** @jsxImportSource @emotion/react */

import { Box, Button, Paper, Stack, Typography, css } from "@mui/material"
import { useRenderCount } from "demo/utils"
import { SubmitButton, useForm } from "."

export const FormFooter = () => (
  <Box
    css={css`
      @media (min-width: 769px) {
        position: sticky;
        bottom: -4px;
        z-index: 99;
      }
    `}
  >
    <Paper variant="outlined">
      <Stack
        direction="row"
        justifyContent="end"
        alignItems="center"
        margin={2}
        spacing={2}
      >
        <FormValidationIndicator /> <TouchAllFieldsButton /> <SubmitButton />
      </Stack>
    </Paper>
  </Box>
)

const FormValidationIndicator: React.FC = () => {
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

const TouchAllFieldsButton: React.FC = () => {
  const form = useForm()

  return <Button onClick={() => form.touchAll()}>Touch all fields</Button>
}
