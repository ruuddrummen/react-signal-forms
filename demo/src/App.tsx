/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
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
import { signal } from "@preact/signals-react"
import React, { useState } from "react"
import "./App.css"
import { MyForm } from "./DemoForm"
import { clearStorage } from "./FormComponents"
import { ThemeSelector, useTheme } from "./themes"

const count = signal(1)

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
      <Header>
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
              <Button onClick={() => count.value++}>
                Count is {count.value}
              </Button>
            </Typography>
          </Container>
        </Paper>
      </Header>
      <Container className="App" maxWidth="lg">
        <MyForm key={formKey} />
      </Container>
      <div style={{ position: "fixed" }}>
        {/* an empty fixed div should fix issues with sticky elements in mobile browsers. */}
      </div>
    </ThemeProvider>
  )
}

const Header = (props: React.PropsWithChildren<object>) => {
  return (
    <nav
      css={css`
        @media (min-height: 800px) {
          position: sticky;
          top: 0;
          z-index: 100;
        }
      `}
    >
      {props.children}
    </nav>
  )
}

export default App
