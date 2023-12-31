/** @jsxImportSource @emotion/react */

import DataArrayIcon from "@mui/icons-material/DataArray"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { Box, Button, Collapse, Grid, Stack } from "@mui/material"
import {
  FormFooter,
  FormState,
  SignalForm,
  SubmitBackdrop,
  Switch,
  TextInput,
  useLocalStorageStore,
} from "demo/FormComponents"
import { Header } from "demo/Layout"
import { memo } from "react"
import { signalForm } from "react-signal-forms"
import {
  ArrayItem,
  ArrayItemDescriptor,
  useArrayField,
} from "react-signal-forms/arrays"
import { applicableIf, requiredIf } from "react-signal-forms/rules"
import TransitionGroup from "react-transition-group/TransitionGroup"

type DemoData = {
  makeFieldsInArrayRequired: boolean

  arrayField: Array<{
    booleanField: boolean
    textField: string
  }>
}

const fields = signalForm<DemoData>().withFields((field) => ({
  ...field("makeFieldsInArrayRequired", "Make text fields in array required"),

  ...field("arrayField").asArray({
    fields: (field) => ({
      ...field("booleanField", "Toggle"),

      ...field("textField", "Text", {
        rules: [
          applicableIf(({ form }) => form.fields.booleanField.value === true),
          requiredIf(
            ({ form }) =>
              form.parent.fields.makeFieldsInArrayRequired.value === true
          ),
        ],
      }),
    }),

    defaultValue: [
      {
        booleanField: true,
        textField: "Item 1",
      },
      {
        booleanField: true,
        textField: "Item 2",
      },
      {
        booleanField: false,
        textField: "",
      },
    ],
  }),
}))

export const ArrayFieldDemoForm = () => {
  const { getValues, setValues } = useLocalStorageStore("array-field")

  return (
    <>
      <Box padding={2}>
        <Header id="array-fields">
          <DataArrayIcon /> Array fields
        </Header>
      </Box>

      <SignalForm
        fields={fields}
        initialValues={getValues()}
        onSubmit={setValues}
      >
        <Stack spacing={2}>
          <SubmitBackdrop>
            <Stack spacing={2} padding={2}>
              <ArrayFieldDemo />

              <FormState />
            </Stack>
          </SubmitBackdrop>

          <FormFooter />
        </Stack>
      </SignalForm>
    </>
  )
}

const ArrayFieldDemo = () => {
  const { items, add } = useArrayField(fields.arrayField)

  return (
    <Stack gap={2}>
      <Switch field={fields.makeFieldsInArrayRequired} />

      <TransitionGroup>
        {items.map((item) => (
          // ⚠ Make sure to set the `key` prop to `item.id`.
          <Collapse key={item.id}>
            <DemoArrayItem item={item} />
          </Collapse>
        ))}
      </TransitionGroup>

      <Grid container>
        <Grid item xs={11}>
          <AddItemButton onClick={add} />
        </Grid>
      </Grid>
    </Stack>
  )
}

/**
 * Adding and removing items will trigger a render on the array form. By
 * default, React will re-render all children when this happens. To prevent all
 * items from re-rendering, you can wrap your items in a component with memo.
 *
 * Check out the React docs to read more about memo:
 * https://react.dev/reference/react/memo.
 */
const DemoArrayItem: React.FC<{ item: ArrayItemDescriptor }> = memo(
  ({ item }) => {
    const arrayFields = fields.arrayField.fields

    return (
      <ArrayItem item={item}>
        <Grid container spacing={2} paddingTop={2}>
          <Grid item container xs={11} spacing={2}>
            <Grid item md={6} xs={12}>
              <Switch field={arrayFields.booleanField} />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextInput field={arrayFields.textField} />
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <RemoveItemButton onClick={item.remove} />
          </Grid>
        </Grid>
      </ArrayItem>
    )
  }
)

const AddItemButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <Button
    onClick={onClick}
    sx={{
      width: "100%",
    }}
  >
    Add item
  </Button>
)

const RemoveItemButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <Button
    onClick={onClick}
    color="error"
    sx={{
      width: "100%",
      height: "100%",
    }}
  >
    <DeleteOutlineIcon />
  </Button>
)
