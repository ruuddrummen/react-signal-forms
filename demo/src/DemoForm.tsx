/** @jsxImportSource @emotion/react */

import EditOffIcon from "@mui/icons-material/EditOff"
import JoinFullIcon from "@mui/icons-material/JoinFull"
import ListAltIcon from "@mui/icons-material/ListAlt"
import RuleIcon from "@mui/icons-material/Rule"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { Box, Button, Grid, Paper, Stack, css } from "@mui/material"
import React from "react"
import { DemoArrayForm } from "./DemoArrayForm"
import {
  FormState,
  NumberInput,
  SignalForm,
  SubmitBackdrop,
  SubmitButton,
  Switch,
  TextInput,
  useForm,
  useLocalStorageStore,
} from "./FormComponents"
import { FormValidationIndicator } from "./FormComponents/FormValidationIndicator"
import { SelectInput } from "./FormComponents/SelectInput"
import { GridDivider, GridHeader, P } from "./Layout"
import { fields } from "./fields"

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

            <DemoArrayForm />
          </Grid>
        </SubmitBackdrop>
        <Box
          marginTop={2}
          css={css`
            @media (min-width: 769px) {
              position: sticky;
              bottom: -4px;
              z-index: 99;
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

const TouchAllFieldsButton = () => {
  const form = useForm()

  return <Button onClick={() => form.touchAll()}>Touch all fields</Button>
}
