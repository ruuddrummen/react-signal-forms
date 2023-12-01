import DataArrayIcon from "@mui/icons-material/DataArray"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import { Button, Grid, Link } from "@mui/material"
import { FC, memo } from "react"
import {
  ArrayItem,
  ArrayItemDescriptor,
  useArrayField,
} from "react-signal-forms/arrays"
import { TextInput } from "./FormComponents"
import { GridHeader, P, Span } from "./Layout"
import { fields } from "./fields"

export const DemoArrayForm2 = () => {
  const { items, add } = useArrayField(fields.arrayField)

  return (
    <>
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

      {items.map((item) => (
        // ⚠ Make sure to set the `key` prop to `item.id`.
        <DemoArrayFormItem key={item.id} item={item} />
      ))}

      <Grid item md={6} xs={12}>
        <AddArrayItemButton onClick={add} />
      </Grid>
    </>
  )
}

/**
 * Adding and removing items will trigger a render on the array form. By default
 * React will re-render all children when this happens. To prevent all items
 * from re-rendering, you can wrap your items in a component with memo.
 *
 * Check out the React docs if you want to read more about memo:
 * https://react.dev/reference/react/memo.
 */
const DemoArrayFormItem: FC<{ item: ArrayItemDescriptor }> = memo((props) => {
  const arrayFields = fields.arrayField.fields

  return (
    <ArrayItem item={props.item}>
      <Grid item md={6} xs={12}>
        <TextInput field={arrayFields.textFieldInArray} />
        <RemoveArrayItemButton onClick={props.item.remove} />
      </Grid>
    </ArrayItem>
  )
})

const AddArrayItemButton: FC<{ onClick: () => void }> = ({ onClick }) => (
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

const RemoveArrayItemButton: FC<{ onClick: () => void }> = ({ onClick }) => (
  <Button
    onClick={onClick}
    color="error"
    sx={{
      width: "100%",
    }}
  >
    <DeleteOutlineIcon /> Remove item
  </Button>
)
