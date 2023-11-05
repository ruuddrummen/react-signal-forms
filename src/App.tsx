import { Button, Container } from "@mui/material";
import { useSignal } from "@preact/signals-react";
import React from "react";
import "./App.css";
import { applicableIf, createFields, validIf } from "./signals-form";
import { MyForm } from "./MyForm/MyForm";
import { FormInput } from "./MyForm/MyFormInput";

interface MyFormFields {
  simpleField: string;
  validatedField: string;
  secretField: string;
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
        fields.validatedField.valueSignal.value?.startsWith("SECRET")
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
      <MyForm fields={fields} key={formKey.value}>
        <FormInput field={fields.simpleField} />
        <FormInput field={fields.validatedField} />
        <FormInput field={fields.secretField} />
        {/* <FormInput field={fields.secretField} /> */}
      </MyForm>
    </Container>
  );
};

export default App;
