import React, { useEffect, useState } from "react"

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
import { useNavigate } from "react-router-dom"

const defaultTheme = createTheme()

export const SignUp = () => {
  const validateUserInput = (input: FormData) => {
    const username = input.get("username")?.toString()
    const firstName = input.get("firstName")?.toString()
    const lastName = input.get("lastName")?.toString()
    const email = input.get("email")?.toString()
    const password = input.get("password")?.toString()
    const confirmPassword = input.get("confirm-password")?.toString()

    if (
      !username ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      alert("Toate campurile sunt obligatorii")
      return null
    }

    if (password !== confirmPassword) {
      alert("Parolele nu coincid")
      return null
    }

    const strongPassword =
      password !== undefined &&
      password.match(
        /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$/,
      )
    // const strongPassword = true //! decomenteaza linia de mai sus si sterge linia asta cand ai terminat de testat sign up-ul

    if (password === undefined || !strongPassword) {
      alert(
        "Parola ar trebui sa fie lunga de cel putin 8 caractere si sa contina cel putin doua litere mari," +
          "un caracter special (!@#$&*), doua cifre si trei litere mici",
      )
      return null
    }

    if (
      email === undefined ||
      !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    ) {
      alert("Email-ul nu este valid")
      return null
    }

    if (
      firstName === undefined ||
      lastName === undefined ||
      !firstName.match(/^[A-Za-z -]+$/) ||
      !lastName.match(/^[A-Za-z -]+$/)
    ) {
      alert("Numele sau prenumele nu este valid")
      return null
    }

    return {
      firstName,
      lastName,
      email,
      password,
      username,
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const dataToSend = validateUserInput(data)
    if (dataToSend === null) return

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    }

    fetch("http://localhost:8080/users/register", requestOptions)
      .then((response) => {
        if (response.status === 200) return response.text()
        else
          return response
            .text()
            .then((errorText) => Promise.reject(new Error(errorText)))
      })
      .then((responseText) => {
        console.log("responseText: ", responseText)
        navigate("/log-in")
      })
      .catch((error) => {
        if (error.message) alert(error.message)
        else console.error(error)
      })
  }

  // const [data, setData] = useState({})
  const navigate = useNavigate()

  const fields = [
    {
      autoComplete: "username",
      name: "username",
      label: "Username",
      type: "text",
      required: true,
      autoFocus: true,
      id: "username",
      fullWidth: true,
      sm: 12,
    },
    {
      autoComplete: "given-name",
      name: "firstName",
      label: "Prenume",
      type: "text",
      required: true,
      autoFocus: false,
      id: "firstName",
      fullWidth: true,
      sm: 6,
    },
    {
      autoComplete: "family-name",
      name: "lastName",
      label: "Nume",
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
      label: "Email",
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
      label: "Parola",
      type: "password",
      required: true,
      autoFocus: false,
      id: "password",
      fullWidth: true,
      sm: 12,
    },
    {
      autoComplete: "new-password",
      name: "confirm-password",
      label: "Confirma parola",
      type: "password",
      required: true,
      autoFocus: false,
      id: "confirm-password",
      fullWidth: true,
      sm: 12,
    },
  ]

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/")
    }
  })

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
              {fields.map((field, index) => {
                return (
                  <Grid key={index} item xs={12} sm={field.sm}>
                    <TextField {...field} />
                  </Grid>
                )
              })}
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
