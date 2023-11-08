import { FormValues, createFields, createSignalForm } from "@/signal-forms";
import {
  applicabilityRules,
  applicableIf,
  isRequired,
  validIf,
  validationRules,
} from "@/signal-forms/extensions";
import { Stack } from "@mui/material";
import { FormStateViewer } from "./FormStateViewer";
import { MyNumberInput } from "./MyNumberInput";
import { SubmitButton } from "./MySubmitButton";
import { MySwitch } from "./MySwitchInput";
import { MyTextInput } from "./MyTextInput";
import { SubmitBackdrop } from "./SubmitBackdrop";
import { useLocalStorageStore } from "./localStorageStore";

// Create the form and hook with the extensions you want to use.
export const { SignalForm, useFieldSignals } = createSignalForm(
  validationRules, // adds validation rule support and field signals.
  applicabilityRules // adds applicability rule support and field signals.
);

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

  const storeValues = async (values: FormValues) => {
    await store.setValues(values);
  };

  return (
    <SignalForm
      fields={fields}
      initialValues={store.getValues()}
      onSubmit={storeValues}
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
