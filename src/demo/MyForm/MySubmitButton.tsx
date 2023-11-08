import { useFormSignals } from "@/signal-forms";
import { useRenderCount } from "@/utils";
import { Button } from "@mui/material";

export const SubmitButton: React.FC = () => {
  const { submit, isSubmitting, peekValues } = useFormSignals();
  const renderCount = useRenderCount();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => submit(peekValues())}
      disabled={isSubmitting}
    >
      Save (rendered {renderCount.current} times)
    </Button>
  );
};
