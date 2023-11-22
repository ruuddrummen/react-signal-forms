import {
  Stack,
  Switch,
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

const themeName = signal<keyof typeof availableThemes | null>(null)

themeName.subscribe((value) => {
  if (value != null) {
    localStorage.setItem("theme", value)
  }
})

export const useTheme = () => {
  const storedTheme = localStorage.getItem("theme")

  const isDarkModeEnabled = useMediaQuery("(prefers-color-scheme: dark)")

  const preferredTheme: keyof typeof availableThemes = isDarkModeEnabled
    ? "dark"
    : "light"

  const initialTheme: keyof typeof availableThemes =
    storedTheme != null && Object.keys(availableThemes).includes(storedTheme)
      ? (storedTheme as keyof typeof availableThemes)
      : preferredTheme

  themeName.value = initialTheme
  const theme = availableThemes[themeName.value]

  return theme
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
        checked={themeName.value === "dark"}
        onChange={(_e, checked) =>
          (themeName.value = checked ? "dark" : "light")
        }
      />
      <Typography variant="subtitle2">Dark</Typography>
    </Stack>
  )
}
