import { signal } from "@preact/signals-react";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useRef,
} from "react";
import { FieldContextCollection, FieldContext } from "./fieldContext";
import React from "react";
import { FieldCollection } from ".";

const FormContext = createContext<IFormContext>({ fields: {} });

export const useFormContext = () => useContext(FormContext);

export interface IFormContext<TForm = any> {
  fields: FieldContextCollection<TForm>;
}

type FormExtension = (
  fields: FieldCollection,
  formContext: IFormContext
) => void;

export function useFormContextProvider(
  fields: FieldCollection,
  extensions: Array<FormExtension>
) {
  const formContext = useRef<IFormContext>(
    createFormContext(fields, extensions)
  );

  // See: https://blog.bitsrc.io/new-react-design-pattern-return-component-from-hooks-79215c3eac00
  const ContextProvider = useMemo(() => {
    const ProviderComponent: React.FC<PropsWithChildren> = ({ children }) => {
      return (
        <FormContext.Provider value={formContext.current}>
          {children}
        </FormContext.Provider>
      );
    };

    return ProviderComponent;
  }, []);

  return {
    formContext,
    SignalsForm: ContextProvider,
  };
}

function createFormContext(
  fields: FieldCollection,
  extensions: Array<FormExtension>
) {
  const formContext: IFormContext = {
    fields: Object.keys(fields).reduce<FieldContextCollection>(
      (prev, currentName) => {
        prev[currentName] = new FieldContext(signal(null), {});

        return prev;
      },
      {}
    ),
  };

  console.log("(Form) Created field signals", formContext);

  extensions.forEach((ext) => ext(fields, formContext));

  return formContext;
}
