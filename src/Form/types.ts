import { Signal } from "@preact/signals-react";
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
}

export interface Field {
  name: string;
  label: string;
  applicableIf?: (formContext: FormContext) => boolean;
}

export type FieldCollection = { [name: string]: Field };
