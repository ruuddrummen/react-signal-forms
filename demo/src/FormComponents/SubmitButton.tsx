import { Button } from "@mui/material"
import { useRenderCount } from "../utils"
import { useForm } from "./SignalForm"

export const SubmitButton: React.FC = () => {
  const { submit, isSubmitting, peekValues } = useForm()
  const renderCount = useRenderCount()

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => submit(peekValues())}
      disabled={isSubmitting}
    >
      Save {renderCount}
    </Button>
  )
}
