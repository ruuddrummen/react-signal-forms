import { FormControl, MenuItem, Select } from "@mui/material"
import { SelectField } from "react-signal-forms"
import { useFieldSignals } from "."

interface SelectInputProps {
  field: SelectField
}

export const SelectInput = ({ field }: SelectInputProps) => {
  const { value, setValue } = useFieldSignals(field)

  return (
    <FormControl fullWidth>
      <Select
        label={field.label}
        value={value}
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
