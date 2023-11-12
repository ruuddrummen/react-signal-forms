import { Divider, Grid, Stack, Typography } from "@mui/material"
import { createFields } from "react-signal-forms"
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
import { FormValidationIndicator } from "./FormValidationIndicator"

interface FormData {
  text: string
  number: number
  boolean: boolean

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

const fields = createFields<FormData>((form) => {
  form.field("text", (field) => {
    field.label = "A text field"
    field.defaultValue = "Welcome to the demo"
  })

  form.field("number", (field) => {
    field.label = "A number field"
  })

  form.field("boolean", (field) => {
    field.label = "A boolean field"
  })

  form.field("alwaysRequired", (field) => {
    field.label = "Required field"
    field.rules = [required()]
  })

  form.field("mustBeEqualToOtherField", (field) => {
    field.label = "Must be equal to required field"

    // TODO: Get the field name with intellisense or context.
    field.rules = [mustBeEqualToField("alwaysRequired")]
  })

  form.field("hasMinimumLength", (field) => {
    field.label = "At least 6 characters long"
    field.rules = [required(), minLength(6)]
  })

  form.field("makeFieldRequired", (field) => {
    field.label = "Make next field required"
  })

  form.field("canBeRequired", (field) => {
    field.label = "Only rerenders if value or isValid changes"
    field.rules = [
      requiredIf(({ form }) => form.fields.makeFieldRequired.value === true),
    ]
  })

  form.field("showSecretField", (field) => {
    field.label = "Show secret field"
  })

  form.field("secret", (field) => {
    field.label = "Value is cleared when not applicable"
    field.defaultValue = "Default value"
    field.rules = [
      applicableIf(({ fields }) => fields.showSecretField.value === true),
    ]
  })

  form.field("makeComplicatedFieldApplicable", (field) => {
    field.label = "Make the field applicable"
  })

  form.field("complicatedField", (field) => {
    field.label = "Only validated if applicable"
    field.rules = [
      applicableIf(
        ({ fields }) => fields.makeComplicatedFieldApplicable.value === true
      ),
      required(),
      minLength(5),
      validIf(({ value }) => ({
        testResult: value?.endsWith("signals") ?? false,
        errorMessage: "Value must end with 'signals'",
      })),
    ]
  })
})

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
