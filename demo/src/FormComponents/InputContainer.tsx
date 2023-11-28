import { Box, Collapse, Paper, Typography } from "@mui/material"
import { Field } from "react-signal-forms"
import { FieldInfo } from "./FieldInfo"
import { useFieldSignals } from "./SignalForm"

interface InputContainerProps {
  field: Field
}

export const InputContainer = ({
  field,
  children,
}: React.PropsWithChildren<InputContainerProps>) => {
  const { isApplicable } = useFieldSignals(field)

  return (
    <>
      <Box height={120} overflow="hidden">
        <Paper variant="elevation" elevation={2}>
          <Collapse in={isApplicable}>
            <Box padding={3} height={120} display="flex" alignItems="center">
              {children}
            </Box>
          </Collapse>
          <Box height={120} display="flex" alignItems="center">
            <Typography variant="button" width={1} textAlign="center">
              Not applicable
            </Typography>
          </Box>
        </Paper>
      </Box>
      <FieldInfo for={field} />
    </>
  )
}
