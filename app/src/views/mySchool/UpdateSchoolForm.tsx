import { Button, Card } from "@mui/material"
import React, { useState } from "react"
import Form from "../../components/form/Form"
import { toast } from "sonner"
import { fetchWithToken } from "../../tokenUtils"
import { domainName } from "../../generalConstants"
import { SchoolData } from "../../interfaces/SchoolData"

export default function UpdateSchoolForm({
  initialSchoolInfo,
  reRenderRoot,
  setSchoolInfo,
}: {
  initialSchoolInfo: SchoolData
  reRenderRoot: () => void
  setSchoolInfo: (schoolInfo: SchoolData) => void
}) {
  const [formDetails, setFormDetails] = useState(initialSchoolInfo)

  const [editMode, setEditMode] = useState(false)

  const fields = [
    {
      disabled: !editMode,
      value: formDetails.name,
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
      disabled: !editMode,
      value: formDetails.description,
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

  const handleSave = () => {
    if (formDetails.name === "" || formDetails.description === "") {
      toast.info("Toate campurile sunt obligatorii")
      return
    }

    const saveSchoolDetails = async () => {
      try {
        const requestOptions = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formDetails.name,
            description: formDetails.description,
          }),
        }

        const response = await fetchWithToken(
          `${domainName}/schools/updateMySchool`,
          requestOptions,
        )
        if (response.status === 200) {
          toast.success("Detaliile scolii au fost actualizate")
          setSchoolInfo(formDetails)
          setEditMode(false)
        } else {
          toast.error("A aparut o eroare")
          return
        }
      } catch (error) {
        console.log(error)
      }
    }
    saveSchoolDetails()
  }

  return (
    <Card className="padded-fit-wrapper centering-wrapper">
      <h3 style={{ fontWeight: "bold" }}>Modifica detaliile scolii</h3>
      <Form fields={fields} setFormData={setFormDetails} />
      {!editMode ? (
        <Button
          variant="contained"
          style={{
            backgroundColor: "var(--main-background-color)",
            color: "black",
            marginTop: "1em",
          }}
          onClick={() => {
            setEditMode(true)
          }}
        >
          Editeaza
        </Button>
      ) : (
        <div style={{ display: "flex", gap: "2em" }}>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#93fc83",
              color: "black",
              marginTop: "1em",
            }}
            onClick={handleSave}
          >
            Salveaza
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#fc6a62",
              color: "black",
              marginTop: "1em",
            }}
            onClick={() => {
              setFormDetails({ ...initialSchoolInfo })
              setEditMode(false)
            }}
          >
            Anuleaza
          </Button>
        </div>
      )}
    </Card>
  )
}
