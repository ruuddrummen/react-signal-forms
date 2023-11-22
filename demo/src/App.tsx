import {
  Button,
  Container,
  CssBaseline,
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
      <Container className="App" maxWidth="lg">
        <ThemeSelector />
        <Typography variant="h2" textAlign="center">
          React Signal Forms <Button onClick={reload}>Reload form</Button>
          <Button color="primary" onClick={reset}>
            Clear store
          </Button>
        </Typography>
        <MyForm key={formKey.value} />
      </Container>
    </ThemeProvider>
  )
}

export default App
