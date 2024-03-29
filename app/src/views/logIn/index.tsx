import React, { useEffect, useState } from "react"
import { useContext } from "react"
import { ReactReduxContext } from "react-redux"

import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import CssBaseline from "@mui/material/CssBaseline"
import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { useNavigate } from "react-router-dom"
import { decodeJWTToken } from "../../tokenUtils"

import { login } from "../../app/reducers"
import { domainName } from "../../generalConstants"
import { toast } from "sonner"

const defaultTheme = createTheme()

export const LogIn = () => {
  const { store } = useContext(ReactReduxContext)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const username = data.get("username")
    const password = data.get("password")
    if (
      username === null ||
      password === null ||
      username == "" ||
      password == ""
    ) {
      toast.error("Ambele campuri sunt obligatorii")
      return
    }

    const dataToSend = {
      username: username,
      password: password,
    }

    if (!dataToSend.username || !dataToSend.password) return

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.get("username"),
        password: data.get("password"),
      }),
    }

    fetch(domainName + "/users/login", requestOptions)
      .then((response) => {
        console.log("response: ", response)
        if (response.status === 200) return response.text()
        return response.text().then((errorText) => Promise.reject(errorText))
      })
      .then((token) => {
        const tokenPayload = decodeJWTToken(token)
        console.log("tokenPayload: ", tokenPayload)
        store.dispatch(login(tokenPayload.sub))
        localStorage.setItem("token", token)
        localStorage.setItem("username", tokenPayload.sub)
        navigate("/")
        toast.success("Autentificare cu succes")
      })
      .catch((errorMessage) => {
        if (errorMessage === "User not found")
          toast.error("Utilizator inexistent")
        else if (errorMessage === "Incorrect password")
          toast.error("Parola incorecta")
        else toast.error(errorMessage)
      })
  }

  const handleChange = (event: any, name: string) => {}

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
            Log in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {fields.map((field) => {
              return (
                <TextField
                  key={field.name}
                  margin="normal"
                  {...field}
                  onChange={(e) => handleChange(e, field.name)}
                />
              )
            })}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
