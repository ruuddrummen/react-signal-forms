import { useFormContext } from "@/signal-forms";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { useRenderCount } from "@/utils";

export const SubmitButton: React.FC = () => {
  const { submit, isSubmitting, peekValues } = useFormContext();
  const renderCount = useRenderCount();

  return (
    <>
      <Button onClick={() => submit(peekValues())}>
        Submit (rendered {renderCount.current} times)
      </Button>
      <Backdrop sx={{ color: "#fff" }} open={isSubmitting}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};
