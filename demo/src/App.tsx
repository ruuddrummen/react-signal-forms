import GitHubIcon from "@mui/icons-material/GitHub"
import {
  Button,
  Container,
  CssBaseline,
  Link,
  Paper,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material"
import React, { useState } from "react"
import "./App.css"
import { MyForm } from "./DemoForm"
import { clearStorage } from "./FormComponents"
import { ThemeSelector, useTheme } from "./themes"

export const App: React.FC = () => {
  const theme = useTheme()
  const [formKey, setFormKey] = useState(1)

  const reload = () => {
    setFormKey((key) => key + 1)
  }

  const reset = () => {
    clearStorage()
    reload()
  }

  return (
    <ThemeProvider theme={theme.selected}>
      <CssBaseline />
      <nav style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <Paper>
          <Container maxWidth="lg">
            <Stack direction="row" alignItems="center" justifyContent="right">
              <Link
                href="https://github.com/ruuddrummen/react-signal-forms"
                target="_blank"
              >
                <GitHubIcon />
              </Link>
              <Typography marginLeft={2}>|</Typography>
              <ThemeSelector theme={theme} />
            </Stack>
            <Typography variant="h2" textAlign="center" paddingBottom={2}>
              React Signal Forms <Button onClick={reload}>Reload form</Button>
              <Button color="primary" onClick={reset}>
                Clear store
              </Button>
            </Typography>
          </Container>
        </Paper>
      </nav>
      <Container className="App" maxWidth="lg">
        <MyForm key={formKey} />
      </Container>
    </ThemeProvider>
  )
}

export default App
