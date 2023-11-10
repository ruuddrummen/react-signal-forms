import { Divider, Grid, Stack, Typography } from "@mui/material";
import { createFields } from "react-signal-forms";
import {
  applicableIf,
  isRequired,
  requiredIf,
  validIf,
} from "react-signal-forms/extensions";
import {
  FormStateViewer,
  NumberInput,
  SignalForm,
  SubmitBackdrop,
  SubmitButton,
  Switch,
  TextInput,
  useLocalStorageStore,
} from "./FormComponents";

interface FormData {
  text: string;
  number: number;
  boolean: boolean;
  alwaysRequired: string;
  mustBeEqualToOtherField: string;
  makeFieldRequired: boolean;
  canBeRequired: string;
  showSecretField: boolean;
  secret: string;
}

const fields = createFields<FormData>((form) => {
  form.field("text", (field) => {
    field.label = "A text field";
  });

  form.field("number", (field) => {
    field.label = "A number field";
  });

  form.field("boolean", (field) => {
    field.label = "A boolean field";
  });

  form.field("alwaysRequired", (field) => {
    field.label = "Required field";
    field.rules = [isRequired()];
  });

  form.field("mustBeEqualToOtherField", (field) => {
    field.label = "Must be equal to required field";
    field.rules = [
      validIf(({ form, value }) => value == form.fields.alwaysRequired.value),
    ];
  });

  form.field("makeFieldRequired", (field) => {
    field.label = "Make next field required";
  });

  form.field("canBeRequired", (field) => {
    field.label = "Only rerenders if value or isValid changes";
    field.rules = [
      requiredIf(({ form }) => form.fields.makeFieldRequired.value === true),
    ];
  });

  form.field("showSecretField", (field) => {
    field.label = "Show secret field";
  });

  form.field("secret", (field) => {
    field.label = "My value is cleared when I'm hidden";
    field.rules = [
      applicableIf(({ fields }) => fields.showSecretField.value === true),
    ];
  });
});

interface GridHeaderProps {
  children: string;
}

const GridHeader = ({ children }: GridHeaderProps) => (
  <Grid item xs={12}>
    <Typography variant="h6">{children}</Typography>
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
        <Grid container padding={2} alignItems="center">
          <GridHeader>Just inputs</GridHeader>
          <Grid item xs={12}>
            <TextInput field={fields.text} />
          </Grid>
          <Grid item xs={12}>
            <NumberInput field={fields.number} />
          </Grid>
          <Grid item xs={12}>
            <Switch field={fields.boolean} />
          </Grid>
          <GridDivider />
          <GridHeader>Validation</GridHeader>
          <Grid item xs={12}>
            <TextInput field={fields.alwaysRequired} />
          </Grid>
          <Grid item xs={12}>
            <TextInput field={fields.mustBeEqualToOtherField} />
          </Grid>
          <Grid item xs={6}>
            <Switch field={fields.makeFieldRequired} />
          </Grid>
          <Grid item xs={6}>
            <TextInput field={fields.canBeRequired} />
          </Grid>
          <GridDivider />
          <GridHeader>Applicability</GridHeader>
          <Grid item xs={6}>
            <Switch field={fields.showSecretField} />
          </Grid>
          <Grid item xs={6}>
            <TextInput field={fields.secret} />
          </Grid>
        </Grid>
      </SubmitBackdrop>
      <Stack direction={"row"} justifyContent={"end"} margin={2}>
        <SubmitButton />
      </Stack>
      <FormStateViewer fields={fields} />
    </SignalForm>
  );
};

const GridDivider = () => (
  <Grid item xs={12} marginBottom={2}>
    <Divider />
  </Grid>
);
