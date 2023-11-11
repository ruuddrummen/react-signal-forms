import { Divider, Grid, Stack, Typography } from "@mui/material";
import { createFields } from "react-signal-forms";
import {
  applicableIf,
  createValidationRule,
  isEqualTo,
  isRequired,
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
  hasMinimumLength: string;
  showSecretField: boolean;
  secret: string;
}

/**
 * Add your own rules with `createValidationRule<TArgs>(...)`. The type
 * parameter describes the arguments you can provide when using the rule.
 * In this case the required length.
 */
const minLength = createValidationRule<number>((context, length) =>
  typeof context.value === "string" && context.value.length >= length
    ? null
    : `Must be at least ${length} characters long`
);

/**
 * A validation rule can also have `() => T` as type parameter, in which case it can be used as
 * `rule(context: RuleContext) => T`.
 */
const requiredIf = createValidationRule<() => boolean>((context, test) =>
  !test(context) || (context.value != null && context.value !== "")
    ? null
    : "This field is required"
);

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
    field.rules = [isEqualTo("alwaysRequired")];
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

  form.field("hasMinimumLength", (field) => {
    field.label = "At least 6 characters long";
    field.rules = [minLength(6)];
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

export const MyForm = () => {
  const store = useLocalStorageStore();

  return (
    <SignalForm
      fields={fields}
      initialValues={store.getValues()}
      onSubmit={store.setValues}
    >
      <SubmitBackdrop>
        <Grid container padding={2} columnSpacing={2} alignItems="start">
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

          <GridHeader>Validation rules</GridHeader>
          <Grid item xs={6}>
            <TextInput field={fields.alwaysRequired} />
          </Grid>
          <Grid item xs={6}>
            <TextInput field={fields.mustBeEqualToOtherField} />
          </Grid>
          <Grid item xs={12}>
            <TextInput field={fields.hasMinimumLength} />
          </Grid>
          <Grid item xs={6}>
            <Switch field={fields.makeFieldRequired} />
          </Grid>
          <Grid item xs={6}>
            <TextInput field={fields.canBeRequired} />
          </Grid>
          <GridDivider />

          <GridHeader>Applicability rules</GridHeader>
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

interface GridHeaderProps {
  children: string;
}

const GridHeader = ({ children }: GridHeaderProps) => (
  <Grid item xs={12}>
    <Typography variant="h6">{children}</Typography>
  </Grid>
);

const GridDivider = () => (
  <Grid item xs={12} marginBottom={2}>
    <Divider />
  </Grid>
);
