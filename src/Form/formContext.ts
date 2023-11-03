import { useSignal, computed, Signal, signal } from "@preact/signals-react";
import { createContext, useContext, useEffect } from "react";
import { patch } from "../signals";
import { useApplicabilityRules } from "./applicabilityRules";
import {
  FieldCollection,
  FormContext,
  FormState,
  FieldContextCollection,
  Field,
  FieldContext,
} from "./types";
import { useValidation } from "./validationRules";

const ReactFormContext = createContext<FormContext>({ fields: {} });

export const FormContextProvider = ReactFormContext.Provider;

export const useFormContext = () => useContext(ReactFormContext);

export function useFormContextProvider(fields: FieldCollection) {
  const formContext = useSignal<FormContext>({
    fields: {},
  });

  const isInitialized = computed(
    () => Object.keys(formContext.value.fields).length > 0
  );

  useFields(fields, formContext);
  useValidation(fields, formContext);
  useApplicabilityRules(fields, formContext);

  return {
    formContext: formContext.value,
    isInitialized: isInitialized.value,
  };
}

function useFields(fields: FieldCollection, formContext: Signal<FormContext>) {
  useEffect(() => {
    patch(formContext, createFieldSignals(fields));
  }, [formContext, fields]);
}

function createFieldSignals(fields: FieldCollection) {
  console.log("(Form) Creating field signals");

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

export function useFieldContext(field: Field): Signal<FieldContext> {
  const formContext = useFormContext();
  const fieldContext = formContext.fields[field.name];

  return fieldContext;
}
