import {
  Stack,
  Switch,
  Theme,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material"
import { useEffect, useState } from "react"

const availableThemes = {
  light: createTheme(),
  dark: createTheme({
    palette: {
      mode: "dark",
    },
  }),
} as const

type ThemeSignal = {
  selectedName: keyof typeof availableThemes
  selected: Theme
  set: (name: keyof typeof availableThemes) => void
}

export const useTheme = (): ThemeSignal => {
  const storedTheme = localStorage.getItem("theme")

  const isDarkModeEnabled = useMediaQuery("(prefers-color-scheme: dark)")

  const preferredTheme: keyof typeof availableThemes = isDarkModeEnabled
    ? "dark"
    : "light"

  const initialTheme: keyof typeof availableThemes =
    storedTheme != null && Object.keys(availableThemes).includes(storedTheme)
      ? (storedTheme as keyof typeof availableThemes)
      : preferredTheme

  const [themeName, setThemeName] =
    useState<keyof typeof availableThemes>(initialTheme)

  useEffect(() => {
    localStorage.setItem("theme", themeName)
  }, [themeName])
  return {
    selectedName: themeName,
    selected: availableThemes[themeName],
    set: (name: keyof typeof availableThemes) => setThemeName(name),
  }
}

export const ThemeSelector = (props: { theme: ThemeSignal }) => {
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
        checked={props.theme.selectedName === "dark"}
        onChange={(_e, checked) => props.theme.set(checked ? "dark" : "light")}
      />
      <Typography variant="subtitle2">Dark</Typography>
    </Stack>
  )
}
