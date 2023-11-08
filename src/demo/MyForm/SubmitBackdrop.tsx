import { useFormSignals } from "@/signal-forms";
import { Backdrop, CircularProgress, Stack, Typography } from "@mui/material";

export const SubmitBackdrop: React.FC = () => {
  const form = useFormSignals();

  return (
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
  );
};
