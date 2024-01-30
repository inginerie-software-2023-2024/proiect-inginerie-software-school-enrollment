import React, { useState } from "react"
import { Button } from "@mui/material"
import { fetchWithToken } from "../../tokenUtils"
import PropTypes from "prop-types"
import { domainName } from "../../generalConstants"
import { toast } from "sonner"
import Form from "../../components/form/Form"

export default function AddChildForm({
  closeModal,
  reRenderParent,
  validateStudentData,
}: {
  closeModal: () => void
  reRenderParent: () => void
  validateStudentData: (studentData: any) => boolean
}) {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    cnp: "",
    age: 0,
  })

  const handleFormSubmit = () => {
    if (!validateStudentData(formData)) return

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
    console.log("Am facut apel la: ", domainName + "/students/add")
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
      <Form fields={fields} setFormData={setFormData} intFields={["age"]} />
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
