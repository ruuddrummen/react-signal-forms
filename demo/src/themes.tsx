import {
  Stack,
  Switch,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material"
import { signal, useSignalEffect } from "@preact/signals-react"
import { useEffect } from "react"

const availableThemes = {
  light: createTheme(),
  dark: createTheme({
    palette: {
      mode: "dark",
    },
  }),
} as const

const storedTheme = localStorage.getItem("theme")

const initialTheme: keyof typeof availableThemes =
  storedTheme != null && Object.keys(availableThemes).includes(storedTheme)
    ? (storedTheme as keyof typeof availableThemes)
    : "light"

const themeSignal = signal<keyof typeof availableThemes>(initialTheme)

export const ThemeSelector = () => {
  const isDarkModeEnabled = useMediaQuery("(prefers-color-scheme: dark)")

  useEffect(() => {
    if (
      storedTheme != null &&
      Object.keys(availableThemes).includes(storedTheme)
    ) {
      return
    }

    const preferredTheme: keyof typeof availableThemes = isDarkModeEnabled
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

class Themes {
  get selected() {
    return availableThemes[themeSignal.value]
  }
}

export const themes = new Themes()
