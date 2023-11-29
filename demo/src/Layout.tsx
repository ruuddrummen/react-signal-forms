import { Divider, Grid, Typography } from "@mui/material"
import React from "react"

export const GridHeader = ({ children }: React.PropsWithChildren<object>) => (
  <Grid item xs={12} marginTop={2}>
    <Typography variant="h4">{children}</Typography>
  </Grid>
)
export const GridDivider = () => (
  <Grid item xs={12} marginTop={2}>
    <Divider />
  </Grid>
)
export const P = ({
  children,
  color,
}: React.PropsWithChildren<{ color?: string }>) => (
  <Typography paragraph color={color}>
    {children}
  </Typography>
)

export const Span = ({
  children,
  color,
}: React.PropsWithChildren<{ color?: string }>) => (
  <Typography component="span" color={color}>
    {children}
  </Typography>
)
