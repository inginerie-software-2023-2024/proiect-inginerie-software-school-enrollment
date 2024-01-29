import React from "react"
import { StyledEngineProvider } from "@mui/material"
import { TeacherStudentsTable } from "./table"

export default function MyClass() {
  return (
    <>
      <h1
        style={{
          fontWeight: "bold",
          display: "block",
          width: "100vw",
          textAlign: "center",
          margin: "0.5em 0 1em 0",
        }}
      >
        Clasa mea
      </h1>
      <StyledEngineProvider injectFirst>
        <TeacherStudentsTable />
      </StyledEngineProvider>
    </>
  )
}
