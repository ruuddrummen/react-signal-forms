import { Button, Container, Typography } from "@mui/material"
import { useSignal } from "@preact/signals-react"
import React from "react"
import "./App.css"
import { MyForm } from "./DemoForm"

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
    <Container className="App" maxWidth="md">
      <Typography variant="h2" textAlign="center">
        React Signal Forms <Button onClick={reload}>Reload form</Button>
        <Button color="primary" onClick={reset}>
          Reset stored values
        </Button>
      </Typography>
      <MyForm key={formKey.value} />
    </Container>
  )
}

export default App
