import React from "react";
import "./App.css";
import { Form } from "./Form/Form";
import { FormInput } from "./Form/FormInput";
import { FieldCollection } from "./Form/types";
import { computed, useSignal } from "@preact/signals-react";
import { Button, Container } from "@mui/material";

const fields: FieldCollection = {
  field1: { name: "field1", label: "Field 1 (try typing SECRET)" },
  field2: {
    name: "field2",
    label: "Secret field",
    applicableIf: (context) => context.fields.field1.value.value === "SECRET",
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

  const resetForm = () => {
    formKey.value = Math.random().toString();
  };

  return (
    <Container className="App">
      <h2>
        React Signals Form <Button onClick={resetForm}>Reset</Button>
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
