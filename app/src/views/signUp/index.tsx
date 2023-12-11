import React, { useState } from "react"

import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import CssBaseline from "@mui/material/CssBaseline"
import TextField from "@mui/material/TextField"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import Link from "@mui/material/Link"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import { createTheme, ThemeProvider } from "@mui/material/styles"

const defaultTheme = createTheme()

export const SignUp = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    })
  }

  const [data, setData] = useState({})

  const fields = [
    {
      autoComplete: "given-name",
      name: "firstName",
      label: "First Name",
      type: "text",
      required: true,
      autoFocus: true,
      id: "firstName",
      fullWidth: true,
      sm: 6,
    },
    {
      autoComplete: "family-name",
      name: "lastName",
      label: "Last Name",
      type: "text",
      required: true,
      autoFocus: false,
      id: "lastName",
      fullWidth: true,
      sm: 6,
    },
    {
      autoComplete: "email",
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      autoFocus: false,
      id: "email",
      fullWidth: true,
      sm: 12,
    },
    {
      autoComplete: "new-password",
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      autoFocus: false,
      id: "password",
      fullWidth: true,
      sm: 12,
    },
  ]

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              {
                fields.map((field) => {
                  return (
                    <Grid item xs={12} sm={field.sm}>
                      <TextField
                        {...field}
                      />
                    </Grid>
                  )
                })
              }
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
