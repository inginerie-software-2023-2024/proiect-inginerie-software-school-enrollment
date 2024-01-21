import React, { useContext } from "react"

import { ReactReduxContext } from "react-redux"
import "bootstrap/dist/css/bootstrap.min.css"
import { AddModal } from "./addModal"

export const SchoolDetails = () => {
  const { store } = useContext(ReactReduxContext)
  const state = store.getState()
  console.log("state in school details: ", state)
  const { school, user } = state
  if (school !== "Scoala 7") return null
  return (
    <div>
      <h2> {school.name} </h2>
      {user.role === "parent" && (
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
