import { Stack } from "@mui/material";
import { createFields } from "signal-forms";
import { applicableIf, isRequired, validIf } from "signal-forms/extensions";
import {
  FormStateViewer,
  MyNumberInput,
  MySwitch,
  MyTextInput,
  SubmitBackdrop,
  SubmitButton,
  useLocalStorageStore,
} from ".";
import { SignalForm } from "./SignalForm";

// Create a data interface.
interface MyFormData {
  simpleField: string;
  requiredField: string;
  validatedField: string;
  secretField: string;
  numberField: number;
  booleanField: boolean;
}

// Create the fields you want to use, based on you data interface.
const fields = createFields<MyFormData>((form) => {
  form.field("simpleField", (field) => {
    field.label = "Simple field with no rules";
    field.defaultValue = "test";
  });

  form.field("requiredField", (field) => {
    field.label = "Required field";
    field.rules = [
      // A validation rule making the field required.
      isRequired(),
    ];
  });

  form.field("validatedField", (field) => {
    field.label = "Field with validation - try typing SECRET";
    field.rules = [
      // A custom validation rule.
      validIf(({ value }) => value?.startsWith("SECRET")),
    ];
  });

  form.field("secretField", (field) => {
    field.label = "Secret field";
    field.rules = [
      // An applicability rule.
      applicableIf(({ fields }) =>
        fields.validatedField.value?.startsWith("SECRET")
      ),
    ];
  });

  form.field("numberField", (field) => {
    field.label = "Number field";
  });

  form.field("booleanField", (field) => {
    field.label = "Boolean field";
  });
});

console.log("(App) Created field collection", fields);

export const MyForm: React.FC = () => {
  const store = useLocalStorageStore();

  return (
    <SignalForm
      fields={fields}
      initialValues={store.getValues()}
      onSubmit={(values) => store.setValues(values)}
    >
      <SubmitBackdrop>
        <Stack padding={2}>
          <MyTextInput field={fields.simpleField} />
          <MyTextInput field={fields.requiredField} />
          <MyTextInput field={fields.validatedField} />
          <MyTextInput field={fields.secretField} />
          <MyNumberInput field={fields.numberField} />
          <MySwitch field={fields.booleanField} />
        </Stack>
      </SubmitBackdrop>
      <Stack direction={"row"} justifyContent={"end"} margin={2}>
        <SubmitButton />
      </Stack>
      <FormStateViewer fields={fields} />
    </SignalForm>
  );
};
