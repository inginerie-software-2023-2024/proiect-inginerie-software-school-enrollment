import React from "react"
import { Button, Grid, TextField } from "@mui/material"

export default function AddChildForm() {
  const fields = [
    {
      autoComplete: "child-last-name",
      name: "lastName",
      label: "Nume Copil",
      type: "text",
      required: true,
      autoFocus: true,
      id: "child-last-name",
      fullWidth: true,
      sm: 12,
    },
    {
      autoComplete: "child-first-name",
      name: "firstName",
      label: "Prenume Copil",
      type: "text",
      required: true,
      autoFocus: false,
      id: "child-first-name",
      fullWidth: true,
      sm: 12,
    },
    {
      autoComplete: "child-cnp",
      name: "cnp",
      label: "CNP Copil",
      type: "text",
      required: true,
      autoFocus: false,
      id: "child-cnp",
      fullWidth: true,
      sm: 12,
    },
    {
      autoComplete: "0",
      name: "age",
      label: "Varsta Copil",
      type: "number",
      required: true,
      autoFocus: false,
      id: "child-age",
      fullWidth: true,
      sm: 12,
    },
  ]

  return (
    <>
      <h1 style={{ fontWeight: "bold" }}>Adauga Copil</h1>
      <Grid container spacing={2} style={{ marginTop: "1em" }}>
        {fields.map((field, index) => {
          return (
            <Grid key={index} item xs={12} sm={field.sm}>
              <TextField {...field} />
              {/* TODO: pune aici un number input field pentru field-ul de varsta */}
            </Grid>
          )
        })}
      </Grid>
      <Button
        variant="contained"
        style={{
          backgroundColor: "var(--main-background-color)",
          color: "black",
          marginTop: "1em",
        }}
      >
        {/* TODO: creeaza functia de add child  && testeaza daca merge adaugarea de copil si lista de copii din profilul parintelui*/}
        Adauga copil
      </Button>
    </>
  )
}
