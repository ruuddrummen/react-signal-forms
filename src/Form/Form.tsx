import { Signal, computed, signal, useSignal } from "@preact/signals-react";
import React, {
  MutableRefObject,
  Ref,
  useEffect,
  useRef,
  useState,
} from "react";
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
    <FormContextProvider value={formContext.current}>
      <form>{props.children}</form>
      <FormStateManager fields={props.fields} />
    </FormContextProvider>
  );
};

const useFormContextProvider = (fields: FieldCollection) => {
  const formContext = useRef<FormContext>({
    fields: {},
  });

  const [isInitialized, setInitialized] = useState(false);

  useFields(fields, formContext);
  useValidation(fields, formContext);
  useApplicabilityRules(fields, formContext);

  useEffect(() => {
    setInitialized(true);
  }, []);

  return {
    formContext,
    isInitialized,
  };
};

function useFields(
  fields: FieldCollection,
  formContext: MutableRefObject<FormContext>
) {
  useEffect(() => {
    formContext.current = initFieldSignals(fields);
  }, [formContext, fields]);
}

function initFieldSignals(fields: FieldCollection) {
  console.log("(Form) Initializing field signals");

  const formState = JSON.parse(
    localStorage.getItem("FormState") ?? "[]"
  ) as FormState;

  const formContext = {
    fields: Object.keys(fields).reduce<FieldContextCollection>(
      (prev, currentName) => {
        const value =
          formState.find((field) => field.name === currentName)?.value ?? null;

        prev[currentName] = signal({
          value,
        });

        return prev;
      },
      {}
    ),
  };

  return formContext;
}

const alwaysTrueSignal = signal(true);

function useApplicabilityRules(
  fields: FieldCollection,
  formContext: MutableRefObject<FormContext>
) {
  useEffect(() => {
    console.log("(Form) Initializing applicability rules");

    Object.keys(fields).forEach((key) => {
      formContext.current.fields[key].value.isApplicableSignal =
        fields[key].createApplicabilitySignal?.(formContext.current.fields) ??
        alwaysTrueSignal;
    });
  }, [fields, formContext]);
}

function useValidation(
  fields: FieldCollection,
  formContext: React.MutableRefObject<FormContext>
) {
  useEffect(() => {
    console.log("(Form) Initializing validation rules");

    Object.keys(fields).forEach((key) => {
      const fieldContext = formContext.current.fields[key];

      fieldContext.value.isValidSignal =
        fields[key].isValid != null
          ? computed(() => {
              console.log(`(${key}) Checking validation rule`);
              return fields[key].isValid!(fieldContext.value.value);
            })
          : alwaysTrueSignal;
    });
  });
}
