/** @jsxImportSource @emotion/react */

import DataArrayIcon from "@mui/icons-material/DataArray"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import EditOffIcon from "@mui/icons-material/EditOff"
import JoinFullIcon from "@mui/icons-material/JoinFull"
import ListAltIcon from "@mui/icons-material/ListAlt"
import RuleIcon from "@mui/icons-material/Rule"
import VisibilityIcon from "@mui/icons-material/Visibility"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import {
  Box,
  Button,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
  css,
} from "@mui/material"
import React from "react"
import { SelectField, signalForm } from "react-signal-forms"
import { ArrayForm, ArrayFormItem } from "react-signal-forms/arrays"
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

/* Define a form data interface or type */

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

  alwaysReadonly: string
  makeFieldReadonly: boolean
  canBeReadOnly: string

  makeComplicatedFieldApplicable: boolean
  complicatedField: string

  arrayField: Array<{
    textFieldInArray: string
  }>
}

/* Create a specification for your fields */

const fields = signalForm<FormData>().withFields((field) => ({
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

  // Required rules.

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

  // Array forms (WIP).

  ...field("arrayField").asArray({
    fields: (arrayField) => ({
      ...arrayField("textFieldInArray", "Text field in array", {
        defaultValue: "New item",
        rules: [required()],
      }),
    }),
    defaultValue: [
      {
        textFieldInArray: "Item 1",
      },
      {
        textFieldInArray: "Item 2",
      },
      {
        textFieldInArray: "Item 3",
      },
    ],
  }),
}))

/* Render your form */

export const DemoForm = React.memo(() => {
  const store = useLocalStorageStore()

  return (
    <SignalForm
      fields={fields}
      initialValues={store.getValues()}
      onSubmit={store.setValues}
    >
      <Box marginBottom={5}>
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

            <GridDivider />
            <GridHeader>
              <DataArrayIcon /> Array forms
            </GridHeader>
            <Grid item xs={12}>
              <P>
                <Span color="warning.main">
                  <WarningAmberIcon />
                </Span>{" "}
                This feature is in development. Expect changes to DX, extended
                context awareness to field rules, and render optimizations.
                Progress is tracked in{" "}
                <Link href="https://github.com/ruuddrummen/react-signal-forms/issues/61">
                  #61
                </Link>
                .
              </P>
            </Grid>

            <ArrayForm arrayField={fields.arrayField}>
              {({ items, arrayFields, removeItem, addItem }) => (
                <>
                  {items.map((item) => (
                    <ArrayFormItem item={item} key={item.id}>
                      <Grid item md={6} xs={12}>
                        <TextInput field={arrayFields.textFieldInArray} />
                        <Button
                          onClick={() => removeItem(item)}
                          color="error"
                          sx={{ width: "100%" }}
                        >
                          <DeleteOutlineIcon /> Remove item
                        </Button>
                      </Grid>
                    </ArrayFormItem>
                  ))}
                  <Grid item md={6} xs={12}>
                    <Button
                      onClick={addItem}
                      sx={{ width: "100%", height: "100%" }}
                    >
                      Add item
                    </Button>
                  </Grid>
                </>
              )}
            </ArrayForm>
          </Grid>
        </SubmitBackdrop>
        <Box
          marginTop={2}
          css={css`
            @media (min-width: 769px) {
              position: sticky;
              bottom: -4px;
              z-index: 100;
            }
          `}
        >
          <Paper variant="outlined">
            <Stack
              direction="row"
              justifyContent="end"
              alignItems="center"
              margin={2}
              spacing={2}
            >
              <FormValidationIndicator /> <TouchAllFieldsButton />{" "}
              <SubmitButton />
            </Stack>
          </Paper>
        </Box>
        <FormState />
      </Box>
    </SignalForm>
  )
})

const GridHeader = ({ children }: React.PropsWithChildren<object>) => (
  <Grid item xs={12} marginTop={2}>
    <Typography variant="h4">{children}</Typography>
  </Grid>
)

const GridDivider = () => (
  <Grid item xs={12} marginTop={2}>
    <Divider />
  </Grid>
)

const P = ({
  children,
  color,
}: React.PropsWithChildren<{ color?: string }>) => (
  <Typography paragraph color={color}>
    {children}
  </Typography>
)

const Span = ({
  children,
  color,
}: React.PropsWithChildren<{ color?: string }>) => (
  <Typography component="span" color={color}>
    {children}
  </Typography>
)

const TouchAllFieldsButton = () => {
  const form = useFormSignals()

  return <Button onClick={() => form.touchAll()}>Touch all fields</Button>
}
