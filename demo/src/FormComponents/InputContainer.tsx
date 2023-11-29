import { Box, Collapse, Paper, Typography } from "@mui/material"
import { Field } from "react-signal-forms"
import { FieldInfo } from "./FieldInfo"
import { useFieldSignals } from "./SignalForm"

interface InputContainerProps {
  field: Field
}

const CONTAINER_HEIGHT = 120

export const InputContainer = ({
  field,
  children,
}: React.PropsWithChildren<InputContainerProps>) => {
  const { isApplicable } = useFieldSignals(field)

  return (
    <>
      <Paper
        variant="elevation"
        elevation={2}
        sx={{ borderRadius: "4px 4px 0 0" }}
      >
        <Box height={CONTAINER_HEIGHT} overflow="hidden">
          <Collapse in={isApplicable}>
            <Box
              height={CONTAINER_HEIGHT}
              padding={3}
              display="flex"
              alignItems="center"
            >
              {children}
            </Box>
          </Collapse>
          <Box height={CONTAINER_HEIGHT} display="flex" alignItems="center">
            <Typography variant="button" width={1} textAlign="center">
              Not applicable
            </Typography>
          </Box>
        </Box>
      </Paper>
      <FieldInfo for={field} />
    </>
  )
}
