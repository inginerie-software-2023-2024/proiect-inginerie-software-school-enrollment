import React, { useState } from "react"
import { Button, Grid, TextField } from "@mui/material"
import { fetchWithToken } from "../../tokenUtils"
import PropTypes from "prop-types"
import {
  domainName,
  romanianCNPRegex,
  romanianNameRegex,
} from "../../generalConstants"
import { toast } from "sonner"

export default function AddChildForm({
  closeModal,
  reRenderParent,
}: {
  closeModal: () => void
  reRenderParent: () => void
}) {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    cnp: "",
    age: 0,
  })

  const handleFormSubmit = () => {
    if (
      formData.firstName === "" ||
      formData.lastName === "" ||
      formData.cnp === ""
    ) {
      toast.error("Toate campurile sunt obligatorii")
      return
    }

    if (!romanianNameRegex.test(formData.firstName)) {
      toast.error("Prenumele introdus nu este valid")
      return
    }
    if (!romanianNameRegex.test(formData.lastName)) {
      toast.error("Numele introdus nu este valid")
      return
    }

    if (!romanianCNPRegex.test(formData.cnp)) {
      toast.error("CNP-ul introdus nu este valid")
      return
    }

    if (formData.age < 6 && formData.age > 18) {
      toast.error("Varsta copilului trebuie sa fie intre 6 si 18 ani")
      return
    }

    const requestBody = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      cnp: formData.cnp,
      age: formData.age,
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    }

    fetchWithToken(domainName + "/students/add", requestOptions)
      .then((response) => {
        if (response.status === 409)
          return Promise.reject(
            new Error("CNP-ul introdus este deja inregistrat"),
          )
        else if (response.status === 201) return response.text()
        else return Promise.reject(new Error("Eroare la adaugarea copilului"))
      })
      .then(() => {
        toast.success("Copilul a fost adaugat cu succes")
        closeModal()
        reRenderParent()
      })
      .catch((error) => {
        toast.error(error.message)
      })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "age" ? parseInt(value) : value,
    }))
  }

  const fields = [
    {
      autoComplete: "child-last-name",
      name: "lastName",
      label: "Nume Copil",
      type: "text",
      required: true,
      autoFocus: true,
      id: "child-last-name",
      fullWidth: true,
      sm: 12,
    },
    {
      autoComplete: "child-first-name",
      name: "firstName",
      label: "Prenume Copil",
      type: "text",
      required: true,
      autoFocus: false,
      id: "child-first-name",
      fullWidth: true,
      sm: 12,
    },
    {
      autoComplete: "child-cnp",
      name: "cnp",
      label: "CNP Copil",
      type: "text",
      required: true,
      autoFocus: false,
      id: "child-cnp",
      fullWidth: true,
      sm: 12,
    },
    {
      autoComplete: "off",
      name: "age",
      label: "Varsta Copil",
      type: "number",
      required: true,
      autoFocus: false,
      id: "child-age",
      fullWidth: true,
      sm: 12,
    },
  ]

  return (
    <>
      <h1 style={{ fontWeight: "bold" }}>Adauga Copil</h1>
      <Grid container spacing={2} style={{ marginTop: "1em" }}>
        {fields.map((field, index) => {
          return (
            <Grid key={index} item xs={12} sm={field.sm}>
              <TextField {...field} onChange={handleChange} />
            </Grid>
          )
        })}
      </Grid>
      <Button
        variant="contained"
        style={{
          backgroundColor: "var(--main-background-color)",
          color: "black",
          marginTop: "1em",
        }}
        onClick={handleFormSubmit}
      >
        Adauga copil
      </Button>
    </>
  )
}

AddChildForm.propTypes = {
  closeModal: PropTypes.func,
  reRenderParent: PropTypes.func,
}
