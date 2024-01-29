import React, { useContext } from "react"
import { ReactReduxContext } from "react-redux"
import { AllUsersTable } from "./table"
import { StyledEngineProvider } from "@mui/material"

export default function AdminDashBoard() {
  const { store } = useContext(ReactReduxContext)
  const state = store.getState()
  console.log("state in admin dashboard: ", state)
  return (
    <>
      <h1>Admin Dashboard</h1>
      <StyledEngineProvider injectFirst>
        <AllUsersTable />
      </StyledEngineProvider>
    </>
  )
}
