import React from "react";
import "./App.css";
import { Form } from "./Form/Form";
import { FormInput } from "./Form/FormInput";
import { FieldCollection } from "./Form/types";
import { computed } from "@preact/signals-react";
import { Container } from "@mui/material";

const fields: FieldCollection = {
  field1: { name: "field1", label: "Field 1 (try typing SECRET)" },
  field2: {
    name: "field2",
    label: "Secret field",
    applicableIf: (context) => context.fields.field1.value.value === "SECRET",
    createApplicabilitySignal: (fields) =>
      computed(() => fields.field1.value.value === "SECRET"),
  },
  field3: { name: "field3", label: "Field 3" },
};

export const App: React.FC = () => {
  return (
    <Container className="App">
      <h2>React Signals Form</h2>
      <Form fields={fields}>
        <FormInput field={fields.field1} />
        <FormInput field={fields.field1} />
        <FormInput field={fields.field2} />
        <FormInput field={fields.field3} />
      </Form>
    </Container>
  );
};

export default App;
