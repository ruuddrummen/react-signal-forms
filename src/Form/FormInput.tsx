import React, { ChangeEvent } from "react";
import { Field, useFormContext } from "./types";

interface FormInputProps {
  field: Field;
}

export const FormInput: React.FC<FormInputProps> = ({ field }) => {
  const formContext = useFormContext();
  const fieldContext = formContext.fields[field.name];

  // if (fieldContext == null || !fieldContext.value.isApplicable) {
  if (fieldContext == null || !fieldContext.value.isApplicableSignal.value) {
    return null;
  }

  function onChange(event: ChangeEvent<HTMLInputElement>): void {
    console.log("Setting value to:", event.currentTarget.value);

    fieldContext.value = {
      ...fieldContext.value,
      value: event.currentTarget.value,
    };
  }

  console.log("Rendering input", field.name);

  return (
    <div>
      <label>{field.label}: </label>
      <input value={fieldContext.value.value} onChange={onChange} />
    </div>
  );
};
