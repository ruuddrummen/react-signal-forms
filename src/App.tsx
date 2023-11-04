import React from "react";
import "./App.css";
import { Form } from "./Form/Form";
import { FormInput } from "./Form/FormInput";
import { useSignal } from "@preact/signals-react";
import { Button, Container } from "@mui/material";
import { applicableIf } from "./Form/rules/applicabilityRules";
import { isValid } from "./Form/rules/validationRules";
import { createFields } from "./Form/createFields";

interface MyForm {
  field0: string;
  field1: string;
  field2: string;
}

const fields = createFields<MyForm>((form) => {
  form.field("field0", (field) => {
    field.label = "Simple field with no rules";
    field.defaultValue = "test";
  });

  form.field("field1", (field) => {
    field.label = "Field with validation - try typing SECRET";
    field.rules = [isValid(({ value }) => value === "SECRET")];
  });

  form.field("field2", (field) => {
    field.label = "Secret field";
    field.rules = [
      applicableIf(({ fields }) => fields.field1.value.value === "SECRET"),
    ];
  });
});

console.log("Created field collection", fields);

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
        <FormInput field={fields.field0} />
        <FormInput field={fields.field1} />
        <FormInput field={fields.field2} />
        <FormInput field={fields.field2} />
      </Form>
    </Container>
  );
};

export default App;
