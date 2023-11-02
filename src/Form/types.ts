import { ReadonlySignal, Signal, computed } from "@preact/signals-react";
import React, { useContext } from "react";

const FormContext = React.createContext<FormContext>({
  fields: {},
});

export const FormContextProvider = FormContext.Provider;

export const useFormContext = () => useContext(FormContext);

export interface FormContext {
  fields: { [name: string]: Signal<FieldContext> };
}

export interface FieldContext {
  value: any;
  isApplicable: boolean;
  isApplicableSignal: Signal<boolean>;
}

export type FieldContextCollection = { [name: string]: Signal<FieldContext> };

export interface Field {
  name: string;
  label: string;
  applicableIf?: (formContext: FormContext) => boolean;
  createApplicabilitySignal?: (
    fields: FieldContextCollection
  ) => Signal<boolean>;
}

export type FieldCollection = { [name: string]: Field };
