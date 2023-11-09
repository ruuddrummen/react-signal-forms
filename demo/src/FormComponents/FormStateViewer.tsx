import { Grid } from "@mui/material";
import React from "react";
import { FieldCollection, useFormSignals } from "react-signal-forms";
export const FormStateViewer: React.FC<{ fields: FieldCollection }> = ({
  fields,
}) => {
  const formContext = useFormSignals();

  return (
    <Grid container style={{ textAlign: "left" }}>
      <Grid item md={6}>
        <pre>fields: {JSON.stringify(fields, null, 2)}</pre>
      </Grid>
      <Grid item md={6}>
        <pre>formContext.fields: {JSON.stringify(formContext, null, 2)}</pre>
      </Grid>
    </Grid>
  );
};
