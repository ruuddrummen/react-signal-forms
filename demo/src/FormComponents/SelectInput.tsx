import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { SelectField } from "react-signal-forms"
import { useFieldSignals } from "."
import { useRenderCount } from "../utils"

interface SelectInputProps {
  field: SelectField
}

export const SelectInput = ({ field }: SelectInputProps) => {
  const { value, setValue, handleBlur } = useFieldSignals(field)
  const renderCount = useRenderCount()
  const label = `${field.label} (rendered ${renderCount} times)`
  const labelId = field.name + "-select-label"

  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
        onBlurCapture={handleBlur}
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
