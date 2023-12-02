import EditOffIcon from "@mui/icons-material/EditOff"
import JoinFullIcon from "@mui/icons-material/JoinFull"
import ListAltIcon from "@mui/icons-material/ListAlt"
import RuleIcon from "@mui/icons-material/Rule"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { Grid, Stack } from "@mui/material"
import {
  FormFooter,
  FormState,
  NumberInput,
  SelectInput,
  SignalForm,
  SubmitBackdrop,
  Switch,
  TextInput,
  useLocalStorageStore,
} from "demo/FormComponents"
import { GridDivider, GridHeader, P } from "demo/Layout"
import React from "react"
import { SelectField, signalForm } from "react-signal-forms"
import {
  applicableIf,
  minLength,
  mustBeEqualToField,
  readonly,
  readonlyIf,
  required,
  requiredIf,
  validIf,
} from "react-signal-forms/rules"

/**
 * Your data type or interface.
 */
export interface DemoData {
  // Just inputs.

  text: string
  number: number
  boolean: boolean

  select: string

  // Validation rules.

  alwaysRequired: string
  mustBeEqualToOtherField: string

  hasMinimumLength: string

  makeFieldRequired: boolean
  canBeRequired: string

  // Applicability rules.

  showSecretField: boolean
  secret: string

  // Readonly rules.

  alwaysReadonly: string
  makeFieldReadonly: boolean
  canBeReadOnly: string

  // Combining rules.

  makeComplicatedFieldApplicable: boolean
  complicatedField: string
}

/**
 * Create specifications for your fields.
 */
const fields = signalForm<DemoData>().withFields((field) => ({
  // Just fields.

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

  // Validation rules.

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

  // Applicability rules.

  ...field("showSecretField", "Show secret field"),
  ...field("secret", "Value is cleared when not applicable", {
    defaultValue: "Default value",
    rules: [
      applicableIf(({ fields }) => fields.showSecretField.value === true),
    ],
  }),

  // Readonly rules.

  ...field("alwaysReadonly", "Readonly field", {
    defaultValue: "Always readonly",
    rules: [readonly()],
  }),
  ...field("makeFieldReadonly", "Make the next field readonly"),
  ...field("canBeReadOnly", "Can be readonly", {
    rules: [readonlyIf((form) => form.fields.makeFieldReadonly.value === true)],
  }),

  // Combining rules.

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

/**
 * Compose your form. Note this demo uses Material UI, but you can use any UI
 * library or your own components.
 */
export const BasicsDemoForm: React.FC = () => {
  const { getValues, setValues } = useLocalStorageStore("basics")

  return (
    <SignalForm
      fields={fields}
      initialValues={getValues()}
      onSubmit={setValues}
    >
      <SubmitBackdrop>
        <Stack padding={2} gap={2}>
          <Grid container spacing={2}>
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
            <Grid item md={6} xs={12}>
              <TextInput field={fields.alwaysRequired} />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextInput field={fields.mustBeEqualToOtherField} />
            </Grid>
            <Grid item xs={12}>
              <TextInput field={fields.hasMinimumLength} />
            </Grid>
            <Grid item md={5} xs={12}>
              <Switch field={fields.makeFieldRequired} />
            </Grid>
            <Grid item md={7} xs={12}>
              <TextInput field={fields.canBeRequired} />
            </Grid>
            <GridDivider />

            <GridHeader>
              <VisibilityIcon /> Applicability rules
            </GridHeader>
            <Grid item md={6} xs={12}>
              <Switch field={fields.showSecretField} />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextInput field={fields.secret} />
            </Grid>

            <GridDivider />
            <GridHeader>
              <EditOffIcon /> Readonly rules
            </GridHeader>
            <Grid item xs={12}>
              <TextInput field={fields.alwaysReadonly} />
            </Grid>
            <Grid item md={6} xs={12}>
              <Switch field={fields.makeFieldReadonly} />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextInput field={fields.canBeReadOnly} />
            </Grid>

            <GridDivider />
            <GridHeader>
              <JoinFullIcon /> Combining rules
            </GridHeader>
            <Grid item xs={12}>
              <P>
                Rules can be combined. Priority on error messages is based on
                the order in which the rules are specified. Also, validation
                rules are not applied if a field is not applicable.
              </P>
            </Grid>
            <Grid item md={6} xs={12}>
              <Switch field={fields.makeComplicatedFieldApplicable} />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextInput field={fields.complicatedField} />
            </Grid>
          </Grid>

          <FormState />
        </Stack>
      </SubmitBackdrop>

      <FormFooter />
    </SignalForm>
  )
}
