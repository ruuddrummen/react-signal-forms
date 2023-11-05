import React from "react";
import {
  FieldCollection,
  useApplicabilityRules,
  useFormContextProvider,
  useValidationRules,
} from "@/signals-form";
import { FormStateManager } from "@/signals-form/helpers/FormStateManager";

interface FormProps {
  fields: FieldCollection;
  children: React.ReactNode;
}

export const MyForm: React.FC<FormProps> = (props) => {
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
