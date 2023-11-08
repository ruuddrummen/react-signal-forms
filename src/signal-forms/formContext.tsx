import { createContext, useContext, useRef } from "react";
import { FieldCollection, FormValues } from ".";
import { SignalFormExtension } from "./extensions/types";
import { FieldContext, FieldContextCollection } from "./fieldContext";
import { Signal, signal } from "@preact/signals-react";

const noop = () => ({} as any);

const ReactFormContext = createContext<IFormContext>({
  fields: {},
  isSubmitting: false,
  peekValues: noop,
  setValues: noop,
  submit: noop,
});

export const useFormSignals = () => useContext(ReactFormContext);

export interface IFormContext<TForm = any> {
  fields: FieldContextCollection<TForm>;
  isSubmitting: boolean;
  peekValues(): FormValues;
  setValues(values: FormValues): void;
  submit(values: FormValues): Promise<void>;
}

export function useFormContextProvider(
  fields: FieldCollection,
  extensions: Array<SignalFormExtension<any, any>>,
  onSubmit?: (values: FormValues) => Promise<void>
) {
  const formContext = useRef<IFormContext>(
    createFormContext(fields, extensions, onSubmit)
  );

  return {
    formContext,
    ContextProvider: ReactFormContext.Provider,
  };
}

function createFormContext(
  fields: FieldCollection,
  extensions: Array<SignalFormExtension<any, any>>,
  onSubmit?: (values: FormValues) => Promise<void>
) {
  const formContext = new FormContext(fields, extensions, onSubmit);

  console.log("(Form) Created field signals", formContext);

  return formContext;
}

class FormContext implements IFormContext {
  private __isSubmittingSignal: Signal<boolean>;
  private __onSubmit: ((values: FormValues) => Promise<void>) | undefined;
  fields: FieldContextCollection<any>;

  get isSubmitting() {
    return this.__isSubmittingSignal.value;
  }

  constructor(
    fields: FieldCollection,
    extensions: Array<SignalFormExtension<any, any>>,
    onSubmit?: (values: FormValues) => Promise<void>
  ) {
    this.__isSubmittingSignal = signal(false);
    this.__onSubmit = onSubmit;

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

  peekValues = () => {
    return Object.keys(this.fields).reduce<FormValues>((values, current) => {
      const field = this.fields[current] as FieldContext;
      values[current] = field.__valueSignal.peek();

      return values;
    }, {});
  };

  setValues = (values: FormValues<any>): void => {
    Object.keys(values).forEach((key) => {
      const field = this.fields[key];

      if (field != null) {
        field.setValue(values[key]);
      }
    });
  };

  submit = async (values: FormValues<any>): Promise<void> => {
    if (this.__onSubmit == null) {
      throw new Error("Missing value for SignalForm.onSubmit prop.");
    }

    this.__isSubmittingSignal.value = true;
    await this.__onSubmit(values);
    this.__isSubmittingSignal.value = false;
  };
}
