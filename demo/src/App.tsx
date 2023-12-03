/** @jsxImportSource @emotion/react */
import GitHubIcon from "@mui/icons-material/GitHub"
import {
  Button,
  Container,
  CssBaseline,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  ThemeProvider,
  Typography,
  css,
} from "@mui/material"
import { signal } from "@preact/signals-react"
import React, { useEffect } from "react"
import { clearStorage } from "./FormComponents"
import { ArrayFieldDemoForm } from "./examples/ArrayFieldDemo"
import { BasicsDemoForm } from "./examples/BasicsDemoForm"
import { ThemeSelector, useTheme } from "./themes"

const formKey = signal(1)

export const App: React.FC = () => {
  const theme = useTheme()

  useScrollToHash()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container className="App" maxWidth="lg" key={formKey.value}>
        <Stack spacing={2} marginBottom="20vh">
          <BasicsDemoForm />

          <ArrayFieldDemoForm />
        </Stack>
      </Container>
      <StickyElementFix />
    </ThemeProvider>
  )
}

const Header = () => {
  const reload = () => {
    formKey.value++
  }

  const reset = () => {
    clearStorage()
    reload()
  }

  return (
    <Paper
      elevation={4}
      css={css`
        position: sticky;
        top: 0;
        z-index: 100;
        border-radius: 0;

        @media (max-width: 768px) {
          top: -4rem;
        }
      `}
    >
      <Container maxWidth="lg">
        <Grid container>
          <Grid item md={6} alignItems="center">
            <Typography variant="h4" textAlign="left" lineHeight="4rem" noWrap>
              React Signal Forms
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="end"
              height="4rem"
              spacing={2}
            >
              <Button onClick={reload}>Reload forms</Button>
              <Button color="primary" onClick={reset}>
                Clear stores
              </Button>
              <Divider variant="inset" orientation="vertical" flexItem />
              <Link
                href="https://github.com/ruuddrummen/react-signal-forms"
                target="_blank"
              >
                <GitHubIcon />
              </Link>
              <ThemeSelector />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  )
}

const StickyElementFix = () => (
  <div
    style={{
      position: "fixed",
    }}
  >
    {/* an empty fixed div should fix issues with sticky elements in mobile browsers. */}
  </div>
)

/**
 * Yup this is hacky, but it works for now.
 */
function useScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash

    if (hash != null) {
      setTimeout(() => {
        const element = document.querySelector(hash)

        if (element != null) {
          element.scrollIntoView({
            behavior: "smooth",
          })
        }
      }, 50)
    }
  })
}
