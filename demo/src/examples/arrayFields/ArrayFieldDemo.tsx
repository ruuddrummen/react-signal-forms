/** @jsxImportSource @emotion/react */

import DataArrayIcon from "@mui/icons-material/DataArray"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import { Button, Collapse, Grid, Link } from "@mui/material"
import { SignalForm, Switch, TextInput } from "demo/FormComponents"
import { GridHeader, P, Span } from "demo/Layout"
import { FC, memo } from "react"
import {
  ArrayItem,
  ArrayItemDescriptor,
  useArrayField,
} from "react-signal-forms/arrays"
import TransitionGroup from "react-transition-group/TransitionGroup"
import { fields } from "./config"

export const ArrayFieldDemoForm = () => {
  return (
    <SignalForm fields={fields}>
      <GridHeader>
        <DataArrayIcon /> Array forms
      </GridHeader>

      <Grid item xs={12}>
        <P>
          <Span color="warning.main">
            <WarningAmberIcon />
          </Span>{" "}
          This feature is in development. Expect changes to DX, extended context
          awareness to field rules, and render optimizations. Progress is
          tracked in{" "}
          <Link href="https://github.com/ruuddrummen/react-signal-forms/issues/61">
            #61
          </Link>
          .
        </P>
      </Grid>

      <ArrayFieldDemo />
    </SignalForm>
  )
}

const ArrayFieldDemo = () => {
  const { items, add } = useArrayField(fields.arrayField)

  return (
    <Grid item container spacing={2}>
      <Grid item xs={12}>
        <TransitionGroup>
          {items.map((item) => (
            // ⚠ Make sure to set the `key` prop to `item.id`.
            <Collapse key={item.id}>
              <DemoArrayItem key={item.id} item={item} />
            </Collapse>
          ))}
        </TransitionGroup>
      </Grid>

      <Grid item xs={11}>
        <AddItemButton onClick={add} />
      </Grid>
    </Grid>
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
const DemoArrayItem: FC<{ item: ArrayItemDescriptor }> = memo(({ item }) => {
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
})

const AddItemButton: FC<{ onClick: () => void }> = ({ onClick }) => (
  <Button
    onClick={onClick}
    sx={{
      width: "100%",
      height: "100%",
    }}
  >
    Add item
  </Button>
)

const RemoveItemButton: FC<{ onClick: () => void }> = ({ onClick }) => (
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
