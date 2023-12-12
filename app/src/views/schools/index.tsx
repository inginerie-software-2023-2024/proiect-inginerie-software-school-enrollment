import React from "react"
import { SchoolsTable } from "./table"
import { StyledEngineProvider } from "@mui/material"

export const Schools = () => {
  return (
    <>
      <h1 style={{textAlign: "center"}}>Scoli</h1>
      <StyledEngineProvider injectFirst>
        <SchoolsTable />
      </StyledEngineProvider>
    </>
  )
}
