import { signal } from "@preact/signals-react";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useRef,
} from "react";
import {
  FieldContextCollection,
  IFieldContext,
  FieldContext,
} from "./fieldContext";
import React from "react";
import { FieldCollection } from ".";
import { FieldBase } from "./fields";

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
  console.log("(Form) Creating field signals");

  const formContext: IFormContext = {
    fields: Object.keys(fields).reduce<FieldContextCollection>(
      (prev, currentName) => {
        prev[currentName] = new FieldContext(signal(null), {});

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
): IFieldContext<TValue> {
  const formContext = useFormContext();
  const fieldContext = formContext.fields[field.name];

  return fieldContext;
}
