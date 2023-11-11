import { Button, Container, Typography } from "@mui/material";
import { useSignal } from "@preact/signals-react";
import React from "react";
import "./App.css";
import { MyForm } from "./MyForm";

export const App: React.FC = () => {
  const formKey = useSignal(Math.random().toString());

  const reload = () => {
    formKey.value = Math.random().toString();
  };

  const reset = () => {
    localStorage.clear();
    reload();
  };

  return (
    <Container className="App" maxWidth="md">
      <Typography variant="h2">
        React Signals Form <Button onClick={reload}>Reload form</Button>
        <Button color="primary" onClick={reset}>
          Reset stored values
        </Button>
      </Typography>
      <MyForm key={formKey.value} />
    </Container>
  );
};

export default App;
