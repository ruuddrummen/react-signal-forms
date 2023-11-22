import JoinFullIcon from "@mui/icons-material/JoinFull"
import ListAltIcon from "@mui/icons-material/ListAlt"
import RuleIcon from "@mui/icons-material/Rule"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material"
import React from "react"
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
  FormState,
  NumberInput,
  SignalForm,
  SubmitBackdrop,
  SubmitButton,
  Switch,
  TextInput,
  useFormSignals,
  useLocalStorageStore,
} from "./FormComponents"
import { FormValidationIndicator } from "./FormComponents/FormValidationIndicator"
import { SelectInput } from "./FormComponents/SelectInput"

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
  ...field("canBeRequired", "Required depending on other values", {
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
        validIf: value?.endsWith("signals") ?? false,
        errorMessage: "Value must end with 'signals'",
      })),
    ],
  }),
}))

export const MyForm = React.memo(() => {
  const store = useLocalStorageStore()

  return (
    <Box marginBottom={10}>
      <SignalForm
        fields={fields}
        initialValues={store.getValues()}
        onSubmit={store.setValues}
      >
        <SubmitBackdrop>
          <Grid container padding={2} columnSpacing={2} rowSpacing={2}>
            <GridHeader>
              <ListAltIcon /> Just inputs
            </GridHeader>
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

            <GridHeader>
              <RuleIcon /> Validation rules
            </GridHeader>
            <Grid item xs={6}>
              <TextInput field={fields.alwaysRequired} />
            </Grid>
            <Grid item xs={6}>
              <TextInput field={fields.mustBeEqualToOtherField} />
            </Grid>
            <Grid item xs={12}>
              <TextInput field={fields.hasMinimumLength} />
            </Grid>
            <Grid item xs={5}>
              <Switch field={fields.makeFieldRequired} />
            </Grid>
            <Grid item xs={7}>
              <TextInput field={fields.canBeRequired} />
            </Grid>
            <GridDivider />

            <GridHeader>
              <VisibilityIcon /> Applicability rules
            </GridHeader>
            <Grid item xs={6}>
              <Switch field={fields.showSecretField} />
            </Grid>
            <Grid item xs={6}>
              <TextInput field={fields.secret} />
            </Grid>

            <GridDivider />
            <GridHeader>
              <JoinFullIcon /> Combining rules
            </GridHeader>
            <Grid item xs={12}>
              <Paragraph>
                Rules can be combined. Priority on error messages is based on
                the order in which the rules are specified. Also, validation
                rules are not applied if a field is not applicable.
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
          <FormValidationIndicator /> <TouchAllFieldsButton /> <SubmitButton />
        </Stack>
        <FormState />
      </SignalForm>
    </Box>
  )
})

const GridHeader = ({ children }: React.PropsWithChildren<object>) => (
  <Grid item xs={12}>
    <Typography variant="h4">{children}</Typography>
  </Grid>
)

const GridDivider = () => (
  <Grid item xs={12} marginTop={2} marginBottom={2}>
    <Divider />
  </Grid>
)

const Paragraph = ({ children }: React.PropsWithChildren<object>) => (
  <Typography paragraph>{children}</Typography>
)

const TouchAllFieldsButton = () => {
  const form = useFormSignals()

  return <Button onClick={() => form.touchAll()}>Touch all fields</Button>
}
