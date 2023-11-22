import { Box, Paper, Typography } from "@mui/material"
import { Field } from "react-signal-forms"
import { FieldInfo } from "./FieldInfo"
import { useFieldSignals } from "./SignalForm"

interface InputContainerProps {
  field: Field
  boxHeight?: number
  paddingLeft?: number
}

export const InputContainer = ({
  field,
  children,
  boxHeight = 120,
  paddingLeft,
}: React.PropsWithChildren<InputContainerProps>) => {
  const { isApplicable } = useFieldSignals(field)

  return (
    <Paper variant="outlined">
      <Box padding={2} height={boxHeight} paddingLeft={paddingLeft}>
        {isApplicable ? (
          children
        ) : (
          <Typography variant="button">Not applicable</Typography>
        )}
      </Box>
      <FieldInfo for={field} />
    </Paper>
  )
}
