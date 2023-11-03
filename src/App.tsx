import React from "react";
import "./App.css";
import { Form } from "./Form/Form";
import { FormInput } from "./Form/FormInput";
import { FieldCollection } from "./Form/types";
import { computed, useSignal } from "@preact/signals-react";
import { Button, Container } from "@mui/material";

const fields: FieldCollection = {
  field1: {
    name: "field1",
    label: "Field 1 - try typing SECRET",
    isValid: (value) => value === "SECRET",
  },
  field2: {
    name: "field2",
    label: "Secret field",
    createApplicabilitySignal: (fields) =>
      computed(() => {
        console.log("(field2) Checking applicability rule");
        return fields.field1.value.value === "SECRET";
      }),
  },
  field3: { name: "field3", label: "Field 3" },
};

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
        <FormInput field={fields.field1} />
        <FormInput field={fields.field1} />
        <FormInput field={fields.field2} />
        <FormInput field={fields.field3} />
      </Form>
    </Container>
  );
};

export default App;
