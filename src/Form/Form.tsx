import {
  signal,
  useComputed,
  useSignal,
  useSignalEffect,
} from "@preact/signals-react";
import React, { useEffect, useRef, useState } from "react";
import {
  FieldCollection,
  FieldContextCollection,
  FormContext,
  FormContextProvider,
  useFormContext,
} from "./types";

interface FormProps {
  fields: FieldCollection;
  children: React.ReactNode;
}

const alwaysTrueSignal = signal(true);

export const Form: React.FC<FormProps> = (props) => {
  const { formContext } = useFormContextProvider(props.fields);

  return (
    <FormContextProvider value={formContext.value}>
      <form>{props.children}</form>
      <FormState fields={props.fields} />
    </FormContextProvider>
  );
};

const initFormContext = (fields: FieldCollection) => {
  console.log("Initializing form context...");

  const formContext = {
    fields: Object.keys(fields).reduce<FieldContextCollection>(
      (prev, current) => {
        prev[current] = signal({
          value: null,
          isApplicableSignal: alwaysTrueSignal,
        });

        return prev;
      },
      {}
    ),
  };

  // Initialize applicability signals.
  Object.keys(fields).forEach((key) => {
    formContext.fields[key].value.isApplicableSignal =
      fields[key].createApplicabilitySignal?.(formContext.fields) ??
      alwaysTrueSignal;
  });

  return formContext;
};

const useFormContextProvider = (fields: FieldCollection) => {
  const formContext = useSignal<FormContext>(initFormContext(fields));

  return {
    formContext,
  };
};

const FormState: React.FC<{ fields: FieldCollection }> = ({ fields }) => {
  const formContext = useFormContext();

  const formState = useComputed(() => {
    const formState = Object.keys(fields).map((key) => {
      const fieldContext = formContext.fields[key];

      return {
        ...fields[key],
        ...fieldContext.value,
      };
    });

    console.log("Form state", formState);

    return formState;
  });

  return (
    <div style={{ textAlign: "left" }}>
      <pre>{JSON.stringify(formState, null, 2)}</pre>
    </div>
  );
};
