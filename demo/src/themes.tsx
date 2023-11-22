import { Stack, Switch, Typography, createTheme } from "@mui/material"
import { signal } from "@preact/signals-react"

const themes = {
  light: createTheme(),
  dark: createTheme({
    palette: {
      mode: "dark",
    },
  }),
} as const

const storedTheme = localStorage.getItem("theme")

const initialTheme: keyof typeof themes =
  storedTheme != null && Object.keys(themes).includes(storedTheme)
    ? (storedTheme as keyof typeof themes)
    : "light"

const themeSignal = signal<keyof typeof themes>(initialTheme)

themeSignal.subscribe((value) => {
  localStorage.setItem("theme", value)
})

export const ThemeSelector = () => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="end" padding={2}>
      <Typography variant="subtitle2">Light</Typography>
      <Switch
        checked={themeSignal.value === "dark"}
        onChange={(_e, checked) =>
          (themeSignal.value = checked ? "dark" : "light")
        }
      />
      <Typography variant="subtitle2">Dark</Typography>
    </Stack>
  )
}

export class Themes {
  static get selected() {
    return themes[themeSignal.value]
  }
}
