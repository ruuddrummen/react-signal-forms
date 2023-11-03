import { Signal } from "@preact/signals-react";
import React, { useContext } from "react";

const ReactFormContext = React.createContext<FormContext>({
  fields: {},
});

export const FormContextProvider = ReactFormContext.Provider;

export const useFormContext = () => useContext(ReactFormContext);

export interface FormContext {
  fields: { [name: string]: Signal<FieldContext> };
}

export interface FieldContext {
  value: any;
  isApplicableSignal?: Signal<boolean>;
}

export type FieldContextCollection = { [name: string]: Signal<FieldContext> };

export interface Field {
  name: string;
  label: string;
  createApplicabilitySignal?: (
    fields: FieldContextCollection
  ) => Signal<boolean>;
}

export type FieldCollection = { [name: string]: Field };

export type FormState = Array<Field & FieldContext>;
