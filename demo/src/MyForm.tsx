import { Divider, Grid, Stack } from "@mui/material";
import { createFields } from "react-signal-forms";
import { applicableIf, validIf } from "react-signal-forms/extensions";
import {
  NumberInput,
  SignalForm,
  SubmitBackdrop,
  SubmitButton,
  Switch,
  TextInput,
  useLocalStorageStore,
} from "./FormComponents";

interface FormData {
  textField: string;
  numberField: number;
  booleanField: boolean;
  makeFieldRequired: boolean;
  requiredField: string;
  showSecretField: boolean;
  secretField: string;
}

// todo: const requiredIf = createRule(...)

const fields = createFields<FormData>((form) => {
  form.field("textField", (field) => {
    field.label = "A text field";
  });

  form.field("numberField", (field) => {
    field.label = "A number field";
  });

  form.field("booleanField", (field) => {
    field.label = "A boolean field";
  });

  form.field("makeFieldRequired", (field) => {
    field.label = "Make next field required";
  });

  form.field("requiredField", (field) => {
    (field.label = "Won't rerender while valid"),
      (field.rules = [
        // todo: requiredIf(...)
        validIf(
          ({ context, value }) =>
            context.fields.makeFieldRequired.value !== true ||
            (value != null && value !== "")
        ),
      ]);
  });

  form.field("showSecretField", (field) => {
    field.label = "Show secret field";
  });

  form.field("secretField", (field) => {
    field.label = "My value is cleared when I'm hidden";
    field.rules = [
      applicableIf(({ fields }) => fields.showSecretField.value === true),
    ];
  });
});

const GridDivider = () => (
  <Grid item xs={12}>
    <Divider />
  </Grid>
);

export const MyForm = () => {
  const store = useLocalStorageStore();

  return (
    <SignalForm
      fields={fields}
      initialValues={store.getValues()}
      onSubmit={store.setValues}
    >
      <SubmitBackdrop>
        <Grid container spacing={2} alignItems="center" alignContent="start">
          <Grid item xs={12}>
            <TextInput field={fields.textField} />
          </Grid>
          <Grid item xs={12}>
            <NumberInput field={fields.numberField} />
          </Grid>
          <Grid item xs={12}>
            <Switch field={fields.booleanField} />
          </Grid>
          <GridDivider />
          <Grid item xs={6}>
            <Switch field={fields.makeFieldRequired} />
          </Grid>
          <Grid item xs={6}>
            <TextInput field={fields.requiredField} />
          </Grid>
          <GridDivider />
          <Grid item xs={6}>
            <Switch field={fields.showSecretField} />
          </Grid>
          <Grid item xs={6}>
            <TextInput field={fields.secretField} />
          </Grid>
        </Grid>
      </SubmitBackdrop>
      <Stack direction={"row"} justifyContent={"end"} margin={2}>
        <SubmitButton />
      </Stack>
    </SignalForm>
  );
};
