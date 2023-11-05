import { Signal, signal } from "@preact/signals-react";
import { createContext, useContext, useRef } from "react";
import {
  FieldCollection,
  FormContext,
  FormState,
  FieldContextCollection,
  Field,
  FieldContext,
} from "./types";

const ReactFormContext = createContext<FormContext>({ fields: {} });

export const FormContextProvider = ReactFormContext.Provider;

export const useFormContext = () => useContext(ReactFormContext);

type FormExtension = (
  fields: FieldCollection,
  formContext: FormContext
) => void;

export function useFormContextProvider(
  fields: FieldCollection,
  extensions: Array<FormExtension>
) {
  const formContext = useRef<FormContext>(
    createFieldSignals(fields, extensions)
  );

  return {
    formContext: formContext.current,
  };
}

function createFieldSignals(
  fields: FieldCollection,
  extensions: Array<FormExtension>
) {
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

  extensions.forEach((ext) => ext(fields, formContext));

  return formContext;
}

export function useFieldContext(field: Field): Signal<FieldContext> {
  const formContext = useFormContext();
  const fieldContext = formContext.fields[field.name];

  return fieldContext;
}
