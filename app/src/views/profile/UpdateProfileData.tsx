import { Button } from "@mui/material"
import React, { useEffect, useState } from "react"
import Form from "../../components/form/Form"
import {
  domainName,
  emailRegex,
  romanianNameRegex,
} from "../../generalConstants"
import { fetchWithToken } from "../../tokenUtils"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function UpdateProfileData() {
  const [updateData, setUpdateData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
  })

  const navigate = useNavigate()

  const [editMode, setEditMode] = useState(false)

  const [initialUserData, setInitialUserData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithToken(
          domainName + `/users/${localStorage.getItem("username")}`,
        )
        const rawData = await response.json()

        const newUserData = {
          username: rawData.username,
          firstName: rawData.firstName,
          lastName: rawData.lastName,
          email: rawData.email,
        }

        setUpdateData({ ...newUserData })
        setInitialUserData({ ...newUserData })
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const updateFields = [
    {
      value: updateData.username,
      autoComplete: "username",
      name: "username",
      label: "Username",
      type: "text",
      required: true,
      autoFocus: true,
      id: "username-update",
      fullWidth: true,
      sm: 12,
      disabled: !editMode,
    },
    {
      value: updateData.firstName,
      autoComplete: "first-name",
      name: "firstName",
      label: "Prenume",
      type: "text",
      required: true,
      autoFocus: false,
      id: "first-name-update",
      fullWidth: true,
      sm: 12,
      disabled: !editMode,
    },
    {
      value: updateData.lastName,
      autoComplete: "last-name",
      name: "lastName",
      label: "Nume",
      type: "text",
      required: true,
      autoFocus: false,
      id: "last-name-update",
      fullWidth: true,
      sm: 12,
      disabled: !editMode,
    },
    {
      value: updateData.email,
      autoComplete: "email",
      name: "email",
      label: "Email",
      type: "text",
      required: true,
      autoFocus: false,
      id: "email-update",
      fullWidth: true,
      sm: 12,
      disabled: !editMode,
    },
  ]

  const handleDetailsUpdate = () => {
    if (
      updateData.username === "" ||
      updateData.firstName === "" ||
      updateData.lastName === "" ||
      updateData.email === ""
    ) {
      toast.info("Toate campurile sunt obligatorii!")
      return
    }
    if (
      updateData.username === initialUserData.username &&
      updateData.firstName === initialUserData.firstName &&
      updateData.lastName === initialUserData.lastName &&
      updateData.email === initialUserData.email
    ) {
      toast.info("Nu s-a facut nicio modificare!")
      return
    }
    if (
      !romanianNameRegex.test(updateData.firstName) ||
      !romanianNameRegex.test(updateData.lastName)
    ) {
      toast.info("Numele sau prenumele nu este valid!")
      return
    }
    if (!emailRegex.test(updateData.email)) {
      toast.info("Email-ul nu este valid!")
      return
    }

    const updateUserData = async () => {
      try {
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
        const response = await fetchWithToken(
          domainName + "/users/updateUser",
          requestOptions,
        )
        if (response.status === 200) {
          toast.success("Datele au fost actualizate cu succes!")
          setEditMode(false)
          setInitialUserData({ ...updateData })
          navigate("/log-out")
        } else if (response.status === 404) {
          toast.error("Utilizatorul nu a fost gasit!")
        } else {
          toast.error("A aparut o eroare!")
        }
      } catch (error) {
        console.log(error)
      }
    }
    updateUserData()
  }

  return (
    <div className="role-display">
      Actualizare Date Profil
      <div style={{ maxWidth: "25vw" }}>
        <Form fields={updateFields} setFormData={setUpdateData} />
      </div>
      <div
        style={{
          marginTop: "1em",
          display: "flex",
          gap: "1em",
        }}
      >
        {!editMode ? (
          <Button
            onClick={() => setEditMode(true)}
            variant="contained"
            style={{
              backgroundColor: "var(--main-background-color)",
              color: "black",
              marginTop: "1em",
            }}
          >
            Editeaza
          </Button>
        ) : null}
        {editMode ? (
          <Button
            variant="contained"
            style={{
              backgroundColor: "#93fc83",
              color: "black",
              marginTop: "1em",
            }}
            onClick={handleDetailsUpdate}
          >
            Salveaza
          </Button>
        ) : null}
        {editMode ? (
          <Button
            variant="contained"
            style={{
              backgroundColor: "#fc6a62",
              color: "black",
              marginTop: "1em",
            }}
            onClick={() => {
              setUpdateData({ ...initialUserData })
              setEditMode(false)
            }}
          >
            Anuleaza
          </Button>
        ) : null}
      </div>
    </div>
  )
}
