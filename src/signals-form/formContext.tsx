import { signal } from "@preact/signals-react";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useRef,
} from "react";
import {
  FieldCollection,
  FormContext,
  FormState,
  FieldContextCollection,
  Field,
  FieldContext,
} from "./types";
import React from "react";

const ReactFormContext = createContext<FormContext>({ fields: {} });

const FormContextProvider = ReactFormContext.Provider;

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

  // See: https://blog.bitsrc.io/new-react-design-pattern-return-component-from-hooks-79215c3eac00
  const ContextProvider = useMemo(() => {
    const ProviderComponent: React.FC<PropsWithChildren> = ({ children }) => {
      return (
        <FormContextProvider value={formContext.current}>
          {children}
        </FormContextProvider>
      );
    };

    return ProviderComponent;
  }, []);

  return {
    FormContextProvider: ContextProvider,
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

  const formContext: FormContext = {
    fields: Object.keys(fields).reduce<FieldContextCollection>(
      (prev, currentName) => {
        const value =
          formState.find((field) => field.name === currentName)?.valueSignal ??
          null;

        prev[currentName] = {
          valueSignal: signal(value),
        };

        return prev;
      },
      {}
    ),
  };

  extensions.forEach((ext) => ext(fields, formContext));

  return formContext;
}

export function useFieldContext(field: Field): FieldContext {
  const formContext = useFormContext();
  const fieldContext = formContext.fields[field.name];

  return fieldContext;
}
