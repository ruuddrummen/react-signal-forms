import {
  Stack,
  Switch,
  Theme,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material"
import { signal } from "@preact/signals-react"

const availableThemes = {
  light: createTheme(),
  dark: createTheme({
    palette: {
      mode: "dark",
    },
  }),
} as const

type ThemeName = keyof typeof availableThemes

const themeNameSignal = signal<ThemeName | null>(null)

themeNameSignal.subscribe((value) => {
  if (value != null) {
    localStorage.setItem("theme", value)
  }
})

export const useTheme = (): Theme => {
  const isDarkModeEnabled = useMediaQuery("(prefers-color-scheme: dark)")

  if (themeNameSignal.value === null) {
    const storedTheme = localStorage.getItem("theme")

    const preferredTheme: keyof typeof availableThemes = isDarkModeEnabled
      ? "dark"
      : "light"

    themeNameSignal.value =
      storedTheme != null && Object.keys(availableThemes).includes(storedTheme)
        ? (storedTheme as keyof typeof availableThemes)
        : preferredTheme
  }

  return availableThemes[themeNameSignal.value]
}

export const ThemeSelector = () => {
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
        checked={themeNameSignal.value === "dark"}
        onChange={(_e, checked) =>
          (themeNameSignal.value = checked ? "dark" : "light")
        }
      />
      <Typography variant="subtitle2">Dark</Typography>
    </Stack>
  )
}
