import { Button } from "@mui/material"
import React, { useEffect, useState } from "react"
import Form from "../../components/form/Form"
import { domainName } from "../../generalConstants"
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
    if (updateData === initialUserData) {
      toast.info("Nu s-a facut nicio modificare!")
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
            onClick={handleDetailsUpdate} // TODO: implement the update functionality
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
