import { Divider, Grid, Stack, Typography } from "@mui/material"
import { SelectField, signalForm } from "react-signal-forms"
import {
  applicableIf,
  minLength,
  mustBeEqualToField,
  required,
  requiredIf,
  validIf,
} from "react-signal-forms/rules"
import {
  FormStateViewer,
  NumberInput,
  SignalForm,
  SubmitBackdrop,
  SubmitButton,
  Switch,
  TextInput,
  useLocalStorageStore,
} from "./FormComponents"
import { SelectInput } from "./FormComponents/SelectInput"
import { FormValidationIndicator } from "./FormValidationIndicator"

interface FormData {
  text: string
  number: number
  boolean: boolean

  select: string

  alwaysRequired: string
  mustBeEqualToOtherField: string

  hasMinimumLength: string

  makeFieldRequired: boolean
  canBeRequired: string

  showSecretField: boolean
  secret: string

  makeComplicatedFieldApplicable: boolean
  complicatedField: string
}

const fields = signalForm<FormData>().withFields((field) => ({
  ...field("text", "A text field", {
    defaultValue: "Welcome to the demo",
  }),
  ...field("number", "A number field"),
  ...field("boolean", "A boolean field"),
  ...field("select", "A select field").as<SelectField>({
    options: [
      {
        label: "Option 1",
        value: "Value 1",
      },
      {
        label: "Option 2",
        value: "Value 2",
      },
      {
        label: "Option 3",
        value: "Value 3",
      },
    ],
  }),
  ...field("alwaysRequired", "Required field", {
    rules: [required()],
  }),
  ...field("mustBeEqualToOtherField", "Must be equal to required field", {
    rules: [mustBeEqualToField("alwaysRequired")],
  }),
  ...field("hasMinimumLength", "At least 6 characters long", {
    rules: [required(), minLength(6)],
  }),
  ...field("makeFieldRequired", "Make next field required"),
  ...field("canBeRequired", "Only rerenders if value or isValid changes", {
    rules: [
      requiredIf(({ form }) => form.fields.makeFieldRequired.value === true),
    ],
  }),
  ...field("showSecretField", "Show secret field"),
  ...field("secret", "Value is cleared when not applicable", {
    defaultValue: "Default value",
    rules: [
      applicableIf(({ fields }) => fields.showSecretField.value === true),
    ],
  }),
  ...field("makeComplicatedFieldApplicable", "Make the field applicable"),
  ...field("complicatedField", "Only validated if applicable", {
    rules: [
      applicableIf(
        ({ fields }) => fields.makeComplicatedFieldApplicable.value === true
      ),
      required(),
      minLength(5),
      validIf(({ value }) => ({
        testResult: value?.endsWith("signals") ?? false,
        errorMessage: "Value must end with 'signals'",
      })),
    ],
  }),
}))

export const MyForm = () => {
  const store = useLocalStorageStore()

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
          <Grid item xs={12}>
            <SelectInput field={fields.select} />
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

          <GridDivider />
          <GridHeader>Combining rules</GridHeader>
          <Grid item xs={12}>
            <Paragraph>
              Rules can be combined. Priority on error messages is based on the
              order in which the rules are specified. Also, validation rules are
              not applied if a field is not applicable.
            </Paragraph>
          </Grid>
          <Grid item xs={6}>
            <Switch field={fields.makeComplicatedFieldApplicable} />
          </Grid>
          <Grid item xs={6}>
            <TextInput field={fields.complicatedField} />
          </Grid>
        </Grid>
      </SubmitBackdrop>
      <Stack
        direction="row"
        justifyContent="end"
        alignItems="center"
        margin={2}
        spacing={2}
      >
        <FormValidationIndicator /> <SubmitButton />
      </Stack>
      <FormStateViewer fields={fields} />
    </SignalForm>
  )
}

interface StringChild {
  children: string
}

const GridHeader = ({ children }: StringChild) => (
  <Grid item xs={12}>
    <Typography variant="h6">{children}</Typography>
  </Grid>
)

const GridDivider = () => (
  <Grid item xs={12} marginBottom={2}>
    <Divider />
  </Grid>
)

const Paragraph = ({ children }: StringChild) => (
  <Typography paragraph>{children}</Typography>
)
