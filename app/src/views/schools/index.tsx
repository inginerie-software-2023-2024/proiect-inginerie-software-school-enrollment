import React from "react"
import { SchoolsTable } from "./table"
import { StyledEngineProvider } from "@mui/material"
import { SearchSchools } from "./search"
import "bootstrap/dist/css/bootstrap.min.css"

export const Schools = () => {
  return (
    <>
      <h1
        style={{
          textAlign: "center",
          fontWeight: "bold",
          display: "block",
          margin: "0.5em 0 0.5em 0",
        }}
      >
        Scoli
      </h1>
      {/* <SearchSchools /> */}
      <StyledEngineProvider injectFirst>
        <SchoolsTable />
      </StyledEngineProvider>
    </>
  )
}
