import {
  FieldCollection,
  useApplicabilityRules,
  useFormContextProvider,
  useValidationRules,
} from "@/signals-form";
import { FormStateManager } from "@/signals-form/helpers/FormStateManager";
import React from "react";

interface FormProps {
  fields: FieldCollection;
  children: React.ReactNode;
}

export const MyForm: React.FC<FormProps> = (props) => {
  const { SignalsForm: FormContextProvider } = useFormContextProvider(
    props.fields,
    [useApplicabilityRules, useValidationRules]
  );

  console.log("(Form) Rendering form");

  return (
    <FormContextProvider>
      <form>{props.children}</form>
      <FormStateManager fields={props.fields} />
    </FormContextProvider>
  );
};
