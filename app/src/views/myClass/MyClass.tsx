import React, { useContext } from "react"
import { StyledEngineProvider } from "@mui/material"
import { TeacherStudentsTable } from "./table"
import { ReactReduxContext } from "react-redux"

export default function MyClass() {
  const { store } = useContext(ReactReduxContext)
  const state = store.getState()
  const { teacherStudents, teacherClass } = state
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
        Clasa {teacherClass?.name}
      </h1>
      <h3 style={{ textAlign: "center" }}>
        ({teacherStudents.length}/{teacherClass.maxNumberOfStudents} Elevi)
      </h3>
      <StyledEngineProvider injectFirst>
        <TeacherStudentsTable />
      </StyledEngineProvider>
    </>
  )
}
