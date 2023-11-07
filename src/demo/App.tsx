import { createFields, createSignalForm } from "@/signals-form";
import { Button, Container } from "@mui/material";
import { useSignal } from "@preact/signals-react";
import React from "react";
import "./App.css";
import { MyTextInput } from "./MyForm/MyTextInput";
import { FormStateManager } from "@/signals-form/helpers/FormStateManager";
import {
  validationExtension,
  applicabilityExtension,
  validIf,
  applicableIf,
} from "@/signals-form/extensions";

export const { SignalForm, useFieldSignals } = createSignalForm(
  validationExtension,
  applicabilityExtension
);

interface MyFormFields {
  simpleField: string;
  validatedField: string;
  secretField: string;
  numberField: number;
  booleanField: boolean;
}

const fields = createFields<MyFormFields>((form) => {
  form.field("simpleField", (field) => {
    field.label = "Simple field with no rules";
    field.defaultValue = "test";
  });

  form.field("validatedField", (field) => {
    field.label = "Field with validation - try typing SECRET";
    field.rules = [validIf(({ value }) => value?.startsWith("SECRET"))];
  });

  form.field("secretField", (field) => {
    field.label = "Secret field";
    field.rules = [
      applicableIf(({ fields }) =>
        fields.validatedField.value?.startsWith("SECRET")
      ),
    ];
  });
});

console.log("(App) Created field collection", fields);

export const App: React.FC = () => {
  const formKey = useSignal(Math.random().toString());

  const refresh = () => {
    formKey.value = Math.random().toString();
  };

  const reset = () => {
    localStorage.clear();
    refresh();
  };

  return (
    <Container className="App">
      <h2>
        React Signals Form <Button onClick={refresh}>Refresh</Button>
        <Button onClick={reset}>Reset</Button>
      </h2>
      <SignalForm fields={fields} key={formKey.value}>
        <MyTextInput field={fields.simpleField} />
        <MyTextInput field={fields.validatedField} />
        <MyTextInput field={fields.secretField} />
        {/* <MyTextInput field={fields.numberField} /> */}
        {/* <MyTextInput field={fields.booleanField} /> */}
        <FormStateManager fields={fields} />
      </SignalForm>
    </Container>
  );
};

export default App;
