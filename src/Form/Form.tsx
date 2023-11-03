import { signal, useSignal } from "@preact/signals-react";
import React from "react";
import {
  FieldCollection,
  FieldContextCollection,
  FormContext,
  FormContextProvider,
} from "./types";
import { FormState } from "./FormState";

interface FormProps {
  fields: FieldCollection;
  children: React.ReactNode;
}

const alwaysTrueSignal = signal(true);

export const Form: React.FC<FormProps> = (props) => {
  const { formContext } = useFormContextProvider(props.fields);

  return (
    <FormContextProvider value={formContext.value}>
      <form>{props.children}</form>
      <FormState fields={props.fields} />
    </FormContextProvider>
  );
};

const useFormContextProvider = (fields: FieldCollection) => {
  const formContext = useSignal<FormContext>(initFormContext(fields));

  return {
    formContext,
  };
};

const initFormContext = (fields: FieldCollection) => {
  console.log("Initializing form context...");

  const formContext = {
    fields: Object.keys(fields).reduce<FieldContextCollection>(
      (prev, current) => {
        prev[current] = signal({
          value: null,
          isApplicableSignal: alwaysTrueSignal,
        });

        return prev;
      },
      {}
    ),
  };

  // Initialize applicability signals.
  Object.keys(fields).forEach((key) => {
    formContext.fields[key].value.isApplicableSignal =
      fields[key].createApplicabilitySignal?.(formContext.fields) ??
      alwaysTrueSignal;
  });

  return formContext;
};
