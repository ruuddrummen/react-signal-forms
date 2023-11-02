import { signal, useSignalEffect, Signal } from "@preact/signals-react";
import React, { useEffect, useRef } from "react";
import {
  FieldCollection,
  FieldContext,
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
  // Store form context in a ref.
  const formContext = useRef<FormContext>({
    fields: {},
  });

  // Initialize the form context.
  useEffect(() => {
    formContext.current = {
      fields: Object.keys(props.fields).reduce<FieldContextCollection>(
        (prev, current) => {
          prev[current] = signal({
            value: "",
            isApplicable: true,
            isApplicableSignal: alwaysTrueSignal,
          });

          return prev;
        },
        {}
      ),
    };

    // Initialize applicability signals.
    Object.keys(props.fields).forEach((key) => {
      formContext.current.fields[key].value.isApplicableSignal =
        props.fields[key].createApplicabilitySignal?.(
          formContext.current.fields
        ) ?? alwaysTrueSignal;
    });
  }, []);

  // Listen to changes on all signals and do global calculations on changes.
  // useSignalEffect(() => {
  //   console.log("Checking calculations on form");

  //   Object.keys(props.fields).forEach((key) => {
  //     const fieldContext = formContext.current.fields[key];

  //     const isApplicable =
  //       props.fields[key].applicableIf?.(formContext.current) ?? true;

  //     if (fieldContext.value.isApplicable !== isApplicable) {
  //       fieldContext.value = {
  //         ...fieldContext.value,
  //         isApplicable: isApplicable,
  //         ...(!isApplicable ? { value: "" } : {}),
  //       };
  //     }
  //   });
  // });

  return (
    <FormContextProvider value={formContext.current}>
      <form>{props.children}</form>
    </FormContextProvider>
  );
};
