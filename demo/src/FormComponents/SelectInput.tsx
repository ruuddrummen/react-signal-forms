import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { SelectField } from "react-signal-forms"
import { useFieldSignals } from "."

interface SelectInputProps {
  field: SelectField
}

export const SelectInput = ({ field }: SelectInputProps) => {
  const { value, setValue } = useFieldSignals(field)
  const labelId = field.name + "-select-label"

  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{field.label}</InputLabel>
      <Select
        labelId={labelId}
        label={field.label}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
      >
        {field.options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
