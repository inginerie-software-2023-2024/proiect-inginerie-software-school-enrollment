import React, { useState } from "react"
import Form from "../../components/form/Form"
import { Box, Button, Modal } from "@mui/material"
import { toast } from "sonner"
import { domainName } from "../../generalConstants"
import { fetchWithToken } from "../../tokenUtils"
import { useNavigate } from "react-router-dom"

export default function DeleteProfile() {
  const [password, setPassword] = useState("")
  const [modalActivated, setModalActivated] = useState(false)
  const navigate = useNavigate()

  const deleteFields = [
    {
      placeholder: "Parola pentru confirmare",
      autoComplete: "password",
      name: "password",
      label: "Parola",
      type: "password",
      required: true,
      autoFocus: false,
      id: "password-delete",
      fullWidth: true,
      sm: 12,
    },
  ]

  const closeModal = () => {
    setModalActivated(false)
    setPassword("")
  }

  const handleDeleteAccount = () => {
    if (password === "") {
      toast.info("Introduceti parola pentru a confirma stergerea contului")
      return
    }

    const deleteAccount = async () => {
      try {
        const requestOptions = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: "", ...password }),
        }

        console.log(requestOptions.body)
        const response = await fetchWithToken(
          `${domainName}/users/delete`,
          requestOptions,
        )

        if (response.status === 200) {
          toast.success("Contul a fost sters cu succes!")
          navigate("/log-out")
        } else if (response.status === 403) {
          toast.error(
            "Aveti copii inregistrati la scoli. Nu puteti sterge contul! Va rugam contactati un Administrator!",
          )
          closeModal()
        } else if (response.status === 400) {
          toast.error("Parola introdusa nu este corecta!")
          closeModal()
        } else {
          toast.error("Eroare necunoscuta la stergerea contului!")
          closeModal()
        }
      } catch (error) {
        toast.error("A aparut o eroare. Va rugam incercati mai tarziu!")
      }
    }
    deleteAccount()
  }

  return (
    <div className="centering-wrapper">
      <Button
        variant="contained"
        style={{
          backgroundColor: "#fc6a62",
          color: "black",
          marginTop: "1em",
        }}
        onClick={() => setModalActivated(true)}
      >
        Sterge Contul
      </Button>
      <Modal
        open={modalActivated}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40vw",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <div className="centering-wrapper" style={{ textAlign: "center" }}>
            <h2 style={{ color: "red", fontWeight: "bold" }}>
              Va reamintim ca aceasta actiune este IREVERSIBILA.
            </h2>
            <h3>Pentru a confirma introduceti parola</h3>
            <Form fields={deleteFields} setFormData={setPassword}></Form>
            <div style={{ display: "flex", gap: "3em", alignItems: "center" }}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#fc6a62",
                  color: "black",
                  marginTop: "1em",
                }}
                onClick={handleDeleteAccount}
              >
                Confirma Stergerea
              </Button>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#77a2f2",
                  color: "black",
                  marginTop: "1em",
                }}
                onClick={() => closeModal()}
              >
                Anuleaza
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  )
}
