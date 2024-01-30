import React, { useEffect, useState, useContext } from "react"
import { ReactReduxContext } from "react-redux"

import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import CssBaseline from "@mui/material/CssBaseline"
import TextField from "@mui/material/TextField"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { useNavigate } from "react-router-dom"
import {
  domainName,
  emailRegex,
  romanianNameRegex,
  strongPasswordRegex,
} from "../../generalConstants"
import { toast } from "sonner"
import Form from "../../components/form/Form"

const defaultTheme = createTheme()

export const SignUp = () => {
  const { store } = useContext(ReactReduxContext)
  const validateUserInput = (input: any) => {
    // const username = input.get("username")?.toString()
    // const firstName = input.get("firstName")?.toString()
    // const lastName = input.get("lastName")?.toString()
    // const email = input.get("email")?.toString()
    // const password = input.get("password")?.toString()
    // const confirmPassword = input.get("confirm-password")?.toString()

    const { username, firstName, lastName, email, password, confirmPassword } =
      input

    if (
      !username ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Toate campurile sunt obligatorii")
      return null
    }

    if (password !== confirmPassword) {
      toast.error("Parolele nu coincid")
      return null
    }

    const strongPassword =
      password !== undefined && strongPasswordRegex.test(password)
    // const strongPassword = true //! decomenteaza linia de mai sus si sterge linia asta cand ai terminat de testat sign up-ul

    if (password === undefined || !strongPassword) {
      toast.error(
        "Parola ar trebui sa fie lunga de cel putin 8 caractere si sa contina cel putin doua litere mari," +
          "un caracter special (!@#$&*), doua cifre si trei litere mici",
      )
      return null
    }

    if (email === undefined || !emailRegex.test(email)) {
      toast.error("Email-ul nu este valid")
      return null
    }

    if (
      firstName === undefined ||
      lastName === undefined ||
      !romanianNameRegex.test(firstName) ||
      !romanianNameRegex.test(lastName)
    ) {
      toast.error("Numele sau prenumele nu este valid")
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

  const handleSubmit = () => {
    const dataToSend = validateUserInput(user)
    if (dataToSend === null) return

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    }

    fetch(domainName + "/users/register", requestOptions)
      .then((response) => {
        if (response.status === 200) return response.text()
        else
          return response
            .text()
            .then((errorText) => Promise.reject(new Error(errorText)))
      })
      .then((responseText) => {
        console.log("responseText: ", responseText)
        console.log("user: ", user)
        navigate("/log-in")
        toast.success("Cont creat cu succes")
      })
      .catch((error) => {
        console.log("user in error", user)
        if (error.message) toast.error(error.message)
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
      name: "confirmPassword",
      label: "Confirma parola",
      type: "password",
      required: true,
      autoFocus: false,
      id: "confirmPassword",
      fullWidth: true,
      sm: 12,
    },
  ]

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/")
    }
  })

  const [user, setUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  console.log("user everytime: ", user)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

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
          <Box sx={{ mt: 3 }}>
            <Form fields={fields} setFormData={setUser} />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
