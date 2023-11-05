import { useSignalEffect } from "@preact/signals-react";
import React from "react";
import { useFormContext } from "../formContext";
import { FieldCollection } from "../types";
import { Grid } from "@mui/material";

export const FormStateManager: React.FC<{ fields: FieldCollection }> = ({
  fields,
}) => {
  const formContext = useFormContext();

  useSignalEffect(() => {
    localStorage.setItem("FormState", JSON.stringify(formContext.fields));
  });

  return (
    <Grid container style={{ textAlign: "left" }}>
      <Grid item md={6}>
        <pre>fields: {JSON.stringify(fields, null, 2)}</pre>
      </Grid>
      <Grid item md={6}>
        <pre>
          formContext.fields: {JSON.stringify(formContext.fields, null, 2)}
        </pre>
      </Grid>
    </Grid>
  );
};
