import { signal } from "@preact/signals-react";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useRef,
} from "react";
import {
  FormContext,
  FieldContextCollection,
  FieldContext,
} from "./fieldContext";
import React from "react";
import { FieldCollection } from ".";
import { FieldBase } from "./fields";

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
    createFormContext(fields, extensions)
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
    formContext,
    SignalsForm: ContextProvider,
  };
}

function createFormContext(
  fields: FieldCollection,
  extensions: Array<FormExtension>
) {
  console.log("(Form) Creating field signals");

  const formState = JSON.parse(
    localStorage.getItem("FormState") ?? "[]"
  ) as FieldContextCollection;

  const formContext: FormContext = {
    fields: Object.keys(fields).reduce<FieldContextCollection>(
      (prev, currentName) => {
        const value = formState[currentName]?.valueSignal ?? null;

        prev[currentName] = {
          valueSignal: signal(value),
          extensions: {},
        };

        return prev;
      },
      {}
    ),
  };

  extensions.forEach((ext) => ext(fields, formContext));

  return formContext;
}

export function useFieldContext<TValue>(
  field: FieldBase<TValue>
): FieldContext<TValue> {
  const formContext = useFormContext();
  const fieldContext = formContext.fields[field.name];

  return fieldContext;
}
