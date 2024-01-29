import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ReactReduxContext } from "react-redux"
import "bootstrap/dist/css/bootstrap.min.css"
import { AddModal } from "./addModal"
import { getCurrentUserRole } from "../../tokenUtils"

export const SchoolDetails = () => {
  const { store } = useContext(ReactReduxContext)
  const state = store.getState()
  console.log("state in school details: ", state)
  const navigate = useNavigate()
  const { school, user } = state
  if(!user) {
    navigate("/scoli")
    return null
  }
  const schoolDetails = school?.value;
  if(!school || !schoolDetails) return null;
  console.log("school in school details: ", school)
  const currentUserRole = getCurrentUserRole();
  console.log("current user role: ", currentUserRole)
  return (
    <div>
      <h2> {schoolDetails.name} </h2>
      {currentUserRole === "parent" && (
        <div>
          <p>
            Daca vreti sa va inscrieti copilul la aceasta scoala, apasati
            butonul de mai jos:
          </p>
          <AddModal />
        </div>
      )}
    </div>
  )
}
