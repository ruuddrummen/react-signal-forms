import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material"
import { Field } from "react-signal-forms"
import { useFieldSignals } from "./SignalForm"

export const FieldInfo = (props: { for: Field }) => {
  const fieldSignals = useFieldSignals(props.for)

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="button">Toggle field info</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <pre style={{ fontSize: "12px" }}>
          specs: {JSON.stringify(props.for, null, 2)}
        </pre>
        <pre style={{ fontSize: "12px" }}>
          signals: {JSON.stringify(fieldSignals, null, 2)}
        </pre>
      </AccordionDetails>
    </Accordion>
  )
}
