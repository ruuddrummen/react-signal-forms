import { createContext, useContext, useRef } from "react";
import { FieldCollection } from ".";
import { SignalFormExtension } from "./extensions/types";
import { FieldContext, FieldContextCollection } from "./fieldContext";
import { Signal, signal } from "@preact/signals-react";
import { alwaysFalseSignal } from "@/signals";

const ReactFormContext = createContext<IFormContext>({
  fields: {},
  isSubmitting: alwaysFalseSignal,
});

export const useFormContext = () => useContext(ReactFormContext);

export interface IFormContext<TForm = any> {
  fields: FieldContextCollection<TForm>;
  isSubmitting: Signal<boolean>;
}

export function useFormContextProvider(
  fields: FieldCollection,
  extensions: Array<SignalFormExtension<any, any>>
) {
  const formContext = useRef<IFormContext>(
    createFormContext(fields, extensions)
  );

  return {
    formContext,
    ContextProvider: ReactFormContext.Provider,
  };
}

function createFormContext(
  fields: FieldCollection,
  extensions: Array<SignalFormExtension<any, any>>
) {
  const formContext = new FormContext(fields, extensions);

  console.log("(Form) Created field signals", formContext);

  return formContext;
}

class FormContext implements IFormContext {
  fields: FieldContextCollection<any>;
  isSubmitting: Signal<boolean>;

  constructor(
    fields: FieldCollection,
    extensions: Array<SignalFormExtension<any, any>>
  ) {
    this.isSubmitting = signal(false);

    this.fields = Object.keys(fields).reduce<FieldContextCollection>(
      (prev, currentName) => {
        prev[currentName] = new FieldContext(null);

        return prev;
      },
      {}
    );

    Object.keys(fields).forEach((key) => {
      const field = fields[key];
      const fieldContext = this.fields[key] as FieldContext;

      extensions.forEach((ext) => {
        const fieldExtension = ext.createFieldExtension(field, this);

        fieldContext.addExtension(
          ext.name,
          fieldExtension,
          ext.createFieldProperties(fieldExtension)
        );
      });
    });
  }
}
