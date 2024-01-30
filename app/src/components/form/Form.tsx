import { Grid, TextField } from "@mui/material"
import React from "react"

//! For the moment only supports text and int fields, but the int fields need to be specified
export default function Form({
  fields,
  setFormData,
  intFields,
}: {
  fields: any[]
  setFormData: (arg0: any) => void
  intFields?: string[]
}) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: intFields?.includes(name) ? parseInt(value) : value,
    }))
  }

  return (
    <Grid container spacing={2} style={{ marginTop: "1em" }}>
      {fields.map((field, index) => {
        return (
          <Grid key={index} item xs={12} sm={field.sm}>
            <TextField {...field} onChange={handleChange} />
          </Grid>
        )
      })}
    </Grid>
  )
}
