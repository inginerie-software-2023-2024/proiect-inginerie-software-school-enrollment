import React from "react"
import { StyledEngineProvider } from "@mui/material"
import { TeacherStudentsTable } from "./table"

export default function MyClass() {
  return (
    <>
      <h1>Clasa mea</h1>
      <StyledEngineProvider injectFirst>
        <TeacherStudentsTable />
      </StyledEngineProvider>
    </>
  )
}
