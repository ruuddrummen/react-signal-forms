import { IArrayFieldContext } from "@/arrays/fieldContext"
import { ArrayFormItemContextProvider } from "@/arrays/reactContext"
import { ArrayFieldBase } from "@/fields"
import { useFormContext } from "@/formContext"
import { FormValues } from "@/types"
import DataArrayIcon from "@mui/icons-material/DataArray"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import { Button, Grid, Link } from "@mui/material"
import { PropsWithChildren } from "react"
import { TextInput } from "./FormComponents"
import { GridHeader, P, Span } from "./Layout"
import { fields } from "./fields"

interface ArrayFormItemDescriptor {
  arrayField: ArrayFieldBase
  id: number
}

const useArrayField = <TArray extends FormValues[]>(
  field: ArrayFieldBase<TArray>
) => {
  const { fields } = useFormContext()

  const arrayFieldContext = fields[field.name] as IArrayFieldContext

  const items = arrayFieldContext.arrayItems.value.map<ArrayFormItemDescriptor>(
    (_item) => ({
      arrayField: field,
      id: _item.id,
    })
  )

  return {
    items,
    arrayFields: field.fields,
    add: () => arrayFieldContext.addItem(),
  }
}

const ArrayFormItem: React.FC<
  PropsWithChildren<{ item: ArrayFormItemDescriptor }>
> = ({ item, children }) => {
  return (
    <ArrayFormItemContextProvider
      value={{ arrayField: item.arrayField, id: item.id }}
    >
      {children}
    </ArrayFormItemContextProvider>
  )
}

export const DemoArrayForm2 = () => {
  const { items, arrayFields, add } = useArrayField(fields.arrayField)

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

      {items.map((item, i) => (
        <ArrayFormItem item={item} key={i}>
          <Grid item md={6} xs={12}>
            <TextInput field={arrayFields.textFieldInArray} />
            <RemoveArrayItemButton />
          </Grid>
        </ArrayFormItem>
      ))}

      <Grid item md={6} xs={12}>
        <AddArrayItemButton addItem={add} />
      </Grid>
    </>
  )
}

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
