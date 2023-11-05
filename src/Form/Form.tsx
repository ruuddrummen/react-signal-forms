import React from "react";
import { FieldCollection } from "./types";
import { FormStateManager } from "./FormStateManager";
import { useFormContextProvider } from "./formContext";
import { useApplicabilityRules } from "./extensions/applicabilityRules";
import { useValidation as useValidationRules } from "./extensions/validationRules";

interface FormProps {
  fields: FieldCollection;
  children: React.ReactNode;
}

export const Form: React.FC<FormProps> = (props) => {
  const { FormContextProvider } = useFormContextProvider(props.fields, [
    useApplicabilityRules,
    useValidationRules,
  ]);

  console.log("(Form) Rendering form");

  return (
    <FormContextProvider>
      <form>{props.children}</form>
      <FormStateManager fields={props.fields} />
    </FormContextProvider>
  );
};
