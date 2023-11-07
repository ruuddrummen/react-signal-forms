import { Grid } from "@mui/material";
import { useSignalEffect } from "@preact/signals-react";
import React, { useEffect } from "react";
import { FieldCollection, useFormContext } from "..";
import { IFormContext } from "../formContext";

type FieldValues = Record<string, any>;

export const FormStateManager: React.FC<{ fields: FieldCollection }> = ({
  fields,
}) => {
  const formContext = useFormContext();

  useEffect(() => {
    // console.log("(FormStateManager) Loading values");

    try {
      const storedValues = JSON.parse(
        localStorage.getItem("FormState") ?? "{}"
      ) as FieldValues;

      Object.keys(storedValues).forEach((key) => {
        if (formContext.fields[key] != null) {
          formContext.fields[key].setValue(storedValues[key]);
        }
      });
    } catch (error) {
      console.error(`(FormStateManager) Failed to load values: ${error}`);
    }
  }, [formContext]);

  useSignalEffect(() => {
    // console.log("(FormStateManager) Saving values");
    localStorage.setItem("FormState", JSON.stringify(toValues(formContext)));
  });

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

function toValues(formContext: IFormContext): FieldValues {
  return Object.keys(formContext.fields).reduce<FieldValues>(
    (prev, current) => {
      prev[current] = formContext.fields[current].value;

      return prev;
    },
    {}
  );
}
