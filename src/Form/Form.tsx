import React from "react";
import { FieldCollection } from "./types";
import { FormStateManager } from "./FormStateManager";
import { CircularProgress } from "@mui/material";
import { FormContextProvider, useFormContextProvider } from "./formContext";

interface FormProps {
  fields: FieldCollection;
  children: React.ReactNode;
}

export const Form: React.FC<FormProps> = (props) => {
  const { formContext, isInitialized } = useFormContextProvider(props.fields);

  if (!isInitialized) {
    console.log("(Form) Rendering spinner");
    return <CircularProgress />;
  }

  console.log("(Form) Rendering form");

  return (
    <FormContextProvider value={formContext}>
      <form>{props.children}</form>
      <FormStateManager fields={props.fields} />
    </FormContextProvider>
  );
};
