import {
  Button,
  Container,
  CssBaseline,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material"
import { useSignal } from "@preact/signals-react"
import React from "react"
import "./App.css"
import { MyForm } from "./DemoForm"
import { ThemeSelector, Themes } from "./themes"

export const App: React.FC = () => {
  const formKey = useSignal(1)

  const reload = () => {
    formKey.value++
  }

  const reset = () => {
    localStorage.clear()
    reload()
  }

  return (
    <ThemeProvider theme={Themes.selected}>
      <CssBaseline />
      <nav style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <Paper>
          <Container maxWidth="lg">
            <ThemeSelector />
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
        <MyForm key={formKey.value} />
      </Container>
    </ThemeProvider>
  )
}

export default App
