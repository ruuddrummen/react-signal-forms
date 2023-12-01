/** @jsxImportSource @emotion/react */

import EditOffIcon from "@mui/icons-material/EditOff"
import JoinFullIcon from "@mui/icons-material/JoinFull"
import ListAltIcon from "@mui/icons-material/ListAlt"
import RuleIcon from "@mui/icons-material/Rule"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { Button, Grid, Stack } from "@mui/material"
import React from "react"
import {
  FormState,
  NumberInput,
  SignalForm,
  SubmitBackdrop,
  Switch,
  TextInput,
  useForm,
  useLocalStorageStore,
} from "./FormComponents"
import { FormFooter } from "./FormComponents/FormFooter"
import { SelectInput } from "./FormComponents/SelectInput"
import { GridDivider, GridHeader, P } from "./Layout"
import { ArrayFieldDemoForm } from "./examples/arrayFields/ArrayFieldDemo"
import { fields } from "./fields"

export const DemoForm = React.memo(() => {
  const store = useLocalStorageStore("basics")

  return (
    <Stack spacing={2} marginBottom="20vh">
      {/* TODO separate examples into separte forms */}

      <SignalForm
        fields={fields}
        initialValues={store.getValues()}
        onSubmit={store.setValues}
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

      <ArrayFieldDemoForm />
    </Stack>
  )
})

export const TouchAllFieldsButton = () => {
  const form = useForm()

  return <Button onClick={() => form.touchAll()}>Touch all fields</Button>
}
