import React, { useState } from "react"
import Form from "../../components/form/Form"
import { Button } from "@mui/material"
import { toast } from "sonner"
import { fetchWithToken } from "../../tokenUtils"
import { domainName } from "../../generalConstants"
import { useNavigate } from "react-router-dom"

export default function AddSchoolForm({
  reRenderRoot,
}: {
  reRenderRoot: () => void
}) {
  const [formDetails, setFormDetails] = useState({
    name: "",
    description: "",
  })

  const fields = [
    {
      sm: 12,
      fullWidth: true,
      autoFocus: true,
      name: "name",
      id: "school-name-add",
      label: "Nume",
      type: "text",
      required: true,
    },
    {
      sm: 12,
      fullWidth: true,
      autoFocus: false,
      name: "description",
      id: "school-description-add",
      label: "Descriere",
      type: "text-area",
      multiline: true,
      rows: 6,
      required: true,
    },
  ]

  const handleAddSchool = () => {
    if (formDetails.name === "" || formDetails.description === "") {
      toast.info("Completati toate campurile")
      return
    }

    const addSchool = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDetails),
        }
        const response = await fetchWithToken(
          `${domainName}/schools/addSchool`,
          requestOptions,
        )
        if (response.status === 200) {
          toast.success("Scoala a fost adaugata cu succes")
          reRenderRoot()
          return
        } else {
          toast.error("A aparut o eroare")
          return
        }
      } catch (error) {
        console.log(error)
      }
    }
    addSchool()
  }

  return (
    <div
      className="centering-wrapper"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <h3 style={{ fontWeight: "bold" }}>Inregistrare Scoala</h3>
      <Form fields={fields} setFormData={setFormDetails} />
      <Button
        variant="contained"
        style={{
          backgroundColor: "var(--main-background-color)",
          color: "black",
          marginTop: "1em",
        }}
        onClick={handleAddSchool}
      >
        Adaugati Scoala
      </Button>
    </div>
  )
}
