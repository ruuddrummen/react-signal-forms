import DataArrayIcon from "@mui/icons-material/DataArray"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import { Button, Grid, Link } from "@mui/material"
import { ArrayForm } from "react-signal-forms/arrays"
import { TextInput } from "./FormComponents"
import { GridHeader, P, Span } from "./Layout"
import { fields } from "./fields"

export const DemoArrayForm = () => (
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
        awareness to field rules, and render optimizations. Progress is tracked
        in{" "}
        <Link href="https://github.com/ruuddrummen/react-signal-forms/issues/61">
          #61
        </Link>
        .
      </P>
    </Grid>

    <ArrayForm
      arrayField={fields.arrayField}
      renderItem={(fields) => (
        <>
          <TextInput field={fields.textFieldInArray} />
          <RemoveArrayItemButton />
        </>
      )}
    >
      {({ items, addItem }) => (
        <>
          {items.map((item, i) => (
            <Grid ref={item.containerRef} key={i} item md={6} xs={12} />
          ))}
          <Grid item md={6} xs={12}>
            <AddArrayItemButton addItem={addItem} />
          </Grid>
        </>
      )}
    </ArrayForm>
  </>
)

const AddArrayItemButton = ({ addItem }: { addItem: () => void }) => (
  <Button
    onClick={addItem}
    sx={{
      width: "100%",
      height: "100%",
    }}
  >
    Add item
  </Button>
)

const RemoveArrayItemButton = () => (
  <Button // onClick={() => removeItem(item)}
    color="error"
    sx={{
      width: "100%",
    }}
  >
    <DeleteOutlineIcon /> Remove item
  </Button>
)
