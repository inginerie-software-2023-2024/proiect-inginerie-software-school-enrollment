import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ReactReduxContext } from "react-redux"
import "bootstrap/dist/css/bootstrap.min.css"
import { AddModal } from "./addModal"
import { getCurrentUserRole } from "../../tokenUtils"
import { Card } from "@mui/material"

export const SchoolDetails = () => {
  const { store } = useContext(ReactReduxContext)
  const state = store.getState()
  console.log("state in school details: ", state)
  const navigate = useNavigate()
  const { school, user } = state
  if (!user) {
    navigate("/scoli")
    return null
  }
  const schoolDetails = school?.value
  if (!school || !schoolDetails) return null
  console.log("school in school details: ", school)
  const currentUserRole = getCurrentUserRole()
  console.log("current user role: ", currentUserRole)
  return (
    <div>
      <h1
        style={{
          fontWeight: "bold",
          display: "block",
          margin: "0.5em 0 0.5em 0",
          width: "100vw",
          textAlign: "center",
        }}
      >
        Detalii Scoala
      </h1>
      <div className="two-columns" style={{ height: "70vh" }}>
        <Card className="padded-fit-wrapper" style={{ maxWidth: "45vw" }}>
          <h2 style={{ fontWeight: "bold" }}>
            {" "}
            Nume Scoala:{" "}
            <span style={{ fontWeight: "normal" }}>{schoolDetails.name} </span>
          </h2>
          <h2 style={{ fontWeight: "bold" }}>
            {" "}
            Descriere Scoala:{" "}
            <span style={{ fontWeight: "normal" }}>
              {schoolDetails.description}{" "}
            </span>
          </h2>
          <h2 style={{ fontWeight: "bold" }}>
            {" "}
            Nume Director:{" "}
            <span style={{ fontWeight: "normal" }}>
              {`${schoolDetails.principal.lastName} ${schoolDetails.principal.lastName} (${schoolDetails.principal.username})`}{" "}
            </span>
          </h2>
        </Card>
        <div className="padded-fit-wrapper centering-wrapper">
          <p style={{ fontWeight: "bold" }}>
            Daca vreti sa va inscrieti copilul la aceasta scoala, apasati
            butonul de mai jos:
          </p>
          <AddModal />
        </div>
      </div>
    </div>
  )
}
