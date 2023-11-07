import { Button, Container } from "@mui/material";
import { useSignal } from "@preact/signals-react";
import React from "react";
import "./App.css";
import { MyForm } from "./MyForm/MyForm";

export const App: React.FC = () => {
  const formKey = useSignal(Math.random().toString());

  const refresh = () => {
    formKey.value = Math.random().toString();
  };

  const reset = () => {
    localStorage.clear();
    refresh();
  };

  return (
    <Container className="App">
      <h2>
        React Signals Form <Button onClick={refresh}>Refresh</Button>
        <Button onClick={reset}>Reset</Button>
      </h2>
      <MyForm key={formKey.value} />
    </Container>
  );
};

export default App;
