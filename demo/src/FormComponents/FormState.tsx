import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@mui/material"
import React from "react"
import { useFormSignals } from "./SignalForm"

export const FormState: React.FC = () => {
  const formContext = useFormSignals()
  const values = Object.keys(formContext.fields).reduce(
    (result, key) => {
      result[key] = formContext.fields[key].value

      return result
    },
    {} as Record<string, unknown>
  )

  return (
    <Box padding={2}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="button">Toggle form info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container padding={2}>
            <Grid item md={6}>
              <pre>values: {JSON.stringify(values, null, 2)}</pre>
            </Grid>
            <Grid item md={6}>
              <pre>
                invalidFields:{" "}
                {JSON.stringify(formContext.invalidFields, null, 2)}
              </pre>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
