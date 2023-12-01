/** @jsxImportSource @emotion/react */

import { Box, Paper, Stack, css } from "@mui/material"
import { SubmitButton } from "."
import { TouchAllFieldsButton } from "../DemoForm"
import { FormValidationIndicator } from "./FormValidationIndicator"

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
