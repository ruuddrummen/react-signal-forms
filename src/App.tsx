import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Form } from "./Form/Form";
import { FormInput } from "./Form/FormInput";
import { FieldCollection } from "./Form/types";
import { computed } from "@preact/signals-react";

const fields: FieldCollection = {
  field1: { name: "field1", label: "Field 1 (try typing TEST)" },
  field2: {
    name: "field2",
    label: "Field 2",
    applicableIf: (context) => context.fields.field1.value.value === "TEST",
    createApplicabilitySignal: (fields) =>
      computed(() => fields.field1.value.value === "TEST"),
  },
};

export const App: React.FC = () => {
  return (
    <div className="App">
      <Form fields={fields}>
        <FormInput field={fields.field1} />
        <FormInput field={fields.field2} />
      </Form>
    </div>
  );
};

export default App;
