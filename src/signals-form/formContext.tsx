import { createContext, useContext, useRef } from "react";
import { FieldCollection } from ".";
import { SignalFormExtension } from "./extensions/types";
import { FieldContext, FieldContextCollection } from "./fieldContext";

const FormContext = createContext<IFormContext>({ fields: {} });

export const useFormContext = () => useContext(FormContext);

export interface IFormContext<TForm = any> {
  fields: FieldContextCollection<TForm>;
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
    ContextProvider: FormContext.Provider,
  };
}

function createFormContext(
  fields: FieldCollection,
  extensions: Array<SignalFormExtension<any, any>>
) {
  const formContext: IFormContext = {
    fields: Object.keys(fields).reduce<FieldContextCollection>(
      (prev, currentName) => {
        prev[currentName] = new FieldContext(null);

        return prev;
      },
      {}
    ),
  };

  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    const fieldContext = formContext.fields[key] as FieldContext;

    extensions.forEach((ext) => {
      const fieldExtension = ext.createFieldExtension(field, formContext);

      fieldContext.addExtension(
        ext.name,
        fieldExtension,
        ext.createFieldProperties(fieldExtension)
      );
    });
  });

  console.log("(Form) Created field signals", formContext);

  return formContext;
}
