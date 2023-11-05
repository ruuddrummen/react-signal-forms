import React from "react";
import "./App.css";
import { Form } from "./Form/Form";
import { FormInput } from "./Form/FormInput";
import { useSignal } from "@preact/signals-react";
import { Button, Container } from "@mui/material";
import { applicableIf } from "./Form/extensions/applicabilityRules";
import { validIf } from "./Form/extensions/validationRules";
import { createFields } from "./Form/createFields";

interface MyForm {
  simpleField: string;
  validatedField: string;
  secretField: string;
}

const fields = createFields<MyForm>((form) => {
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
        fields.validatedField.value.value?.startsWith("SECRET")
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
      <Form fields={fields} key={formKey.value}>
        <FormInput field={fields.simpleField} />
        <FormInput field={fields.validatedField} />
        <FormInput field={fields.secretField} />
        {/* <FormInput field={fields.secretField} /> */}
      </Form>
    </Container>
  );
};

export default App;
