import { Backdrop, CircularProgress, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { useFormSignals } from "react-signal-forms"

export const SubmitBackdrop: React.FC<{ children?: ReactNode | undefined }> = ({
  children,
}) => {
  const form = useFormSignals()

  return (
    <div style={{ position: "relative" }}>
      {children}
      <Backdrop
        sx={{
          color: "#fff",
          position: "absolute",
          zIndex: 1,
        }}
        open={form.isSubmitting}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <CircularProgress color="inherit" />
          <Typography variant="button">Submitting...</Typography>
        </Stack>
      </Backdrop>
    </div>
  )
}
