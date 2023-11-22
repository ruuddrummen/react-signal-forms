import {
  Stack,
  Switch,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material"
import { signal, useSignalEffect } from "@preact/signals-react"
import { useEffect } from "react"

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

export const ThemeSelector = () => {
  const isDarkModeEnabled = useMediaQuery("(prefers-color-scheme: dark)")

  useEffect(() => {
    if (storedTheme != null && Object.keys(themes).includes(storedTheme)) {
      return
    }

    const preferredTheme: keyof typeof themes = isDarkModeEnabled
      ? "dark"
      : "light"

    themeSignal.value = preferredTheme
  }, [isDarkModeEnabled])

  useSignalEffect(() => {
    localStorage.setItem("theme", themeSignal.value)
  })

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="end"
      padding={2}
      margin={0}
    >
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
