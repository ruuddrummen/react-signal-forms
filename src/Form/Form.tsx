import { Signal, signal, useSignal } from "@preact/signals-react";
import React, { useEffect, useState } from "react";
import {
  FieldCollection,
  FieldContextCollection,
  FormContext,
  FormContextProvider,
  FormState,
} from "./types";
import { FormStateManager } from "./FormState";
import { CircularProgress } from "@mui/material";

interface FormProps {
  fields: FieldCollection;
  children: React.ReactNode;
}

export const Form: React.FC<FormProps> = (props) => {
  const { formContext, isInitialized } = useFormContextProvider(props.fields);

  if (!isInitialized) {
    return <CircularProgress />;
  }

  return (
    <FormContextProvider value={formContext.value}>
      <form>{props.children}</form>
      <FormStateManager fields={props.fields} />
    </FormContextProvider>
  );
};

const useFormContextProvider = (fields: FieldCollection) => {
  const formContext = useSignal<FormContext>({
    fields: {},
  });

  const [isInitialized, setInitialized] = useState(false);

  useFields(fields, formContext);
  useApplicabilityRules(fields, formContext);

  useEffect(() => {
    setInitialized(true);
  }, []);

  return {
    formContext,
    isInitialized,
  };
};

const useFields = (
  fields: FieldCollection,
  formContext: Signal<FormContext>
) => {
  useEffect(() => {
    formContext.value = initFieldSignals(fields);
  }, [formContext, fields]);
};

const initFieldSignals = (fields: FieldCollection) => {
  console.log("(Form) Initializing field signals");

  const formState = JSON.parse(
    localStorage.getItem("FormState") ?? "[]"
  ) as FormState;

  const formContext = {
    fields: Object.keys(fields).reduce<FieldContextCollection>(
      (prev, current) => {
        prev[current] = signal({
          value:
            formState.find((field) => field.name === current)?.value ?? null,
        });

        return prev;
      },
      {}
    ),
  };

  return formContext;
};

const alwaysTrueSignal = signal(true);

const useApplicabilityRules = (
  fields: FieldCollection,
  formContext: Signal<FormContext>
) => {
  useEffect(() => {
    console.log("(Form) Initializing applicability rules");

    Object.keys(fields).forEach((key) => {
      formContext.value.fields[key].value.isApplicableSignal =
        fields[key].createApplicabilitySignal?.(formContext.value.fields) ??
        alwaysTrueSignal;
    });
  }, [fields, formContext]);
};
