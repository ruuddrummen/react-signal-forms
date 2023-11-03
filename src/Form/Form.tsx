import { signal, useSignalEffect } from "@preact/signals-react";
import React, { useEffect, useRef, useState } from "react";
import {
  FieldCollection,
  FieldContextCollection,
  FormContext,
  FormContextProvider,
} from "./types";

interface FormProps {
  fields: FieldCollection;
  children: React.ReactNode;
}

const alwaysTrueSignal = signal(true);

export const Form: React.FC<FormProps> = (props) => {
  const { formContext, isInitializing } = useFormContextProvider(props.fields);

  if (isInitializing) {
    return null;
  }

  return (
    <FormContextProvider value={formContext.current}>
      <form>{props.children}</form>
    </FormContextProvider>
  );
};

const useFormContextProvider = (fields: FieldCollection) => {
  // Store form context in a ref.
  const formContext = useRef<FormContext>({
    fields: {},
  });

  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize the form context.
  useEffect(() => {
    formContext.current = {
      fields: Object.keys(fields).reduce<FieldContextCollection>(
        (prev, current) => {
          prev[current] = signal({
            value: null,
            isApplicable: true,
            isApplicableSignal: alwaysTrueSignal,
          });

          return prev;
        },
        {}
      ),
    };

    // Initialize applicability signals.
    Object.keys(fields).forEach((key) => {
      formContext.current.fields[key].value.isApplicableSignal =
        fields[key].createApplicabilitySignal?.(formContext.current.fields) ??
        alwaysTrueSignal;
    });

    setIsInitializing(false);
  }, [fields]);

  // Listen to changes on all signals and do global calculations on changes.
  useSignalEffect(() => {
    const formState = Object.keys(fields).map((key) => {
      const fieldContext = formContext.current.fields[key];

      return {
        ...fields[key],
        ...fieldContext.value,
      };
    });

    console.log("Form state", formState);
  });

  return {
    formContext,
    isInitializing,
  };
};
