import React, { useState } from "react"
import Form from "../../components/form/Form"
import { Button } from "@mui/material"
import { toast } from "sonner"
import {
  domainName,
  moreCharactersClassNameRegex,
  oneCharacterClassNameRegex,
} from "../../generalConstants"
import { fetchWithToken } from "../../tokenUtils"

export default function EditClassDetails({
  classDetails,
  reRenderRoot,
}: {
  readonly classDetails: any
  reRenderRoot: () => void
}) {
  const [formDetails, setFormDetails] = useState(classDetails)
  const [editMode, setEditMode] = useState(false)

  const fields = [
    {
      disabled: !editMode,
      value: formDetails.name,
      sm: 12,
      fullWidth: true,
      autoFocus: true,
      name: "name",
      id: "class-name-edit",
      label: "Nume",
      type: "text",
      required: true,
    },
    {
      disabled: !editMode,
      value: formDetails.maxNumberOfStudents,
      sm: 12,
      fullWidth: true,
      autoFocus: false,
      name: "maxNumberOfStudents",
      id: "class-max-number-of-children-edit",
      label: "Numarul maxim de elevi",
      type: "number",
      required: true,
    },
    {
      disabled: true,
      value: formDetails.numberOfStudents,
      sm: 12,
      fullWidth: true,
      autoFocus: false,
      name: "numberOfStudents",
      id: "class-number-of-children-edit",
      label: "Numarul actual de elevi",
      type: "number",
      required: true,
    },
  ]

  const handleSave = () => {
    if (formDetails.name === "") {
      toast.info("Numele clasei nu poate fi gol")
      return
    }

    if (
      (formDetails.name.length === 1 &&
        !oneCharacterClassNameRegex.test(formDetails.name)) ||
      (formDetails.name.length > 1 &&
        formDetails.name.length < 10 &&
        !moreCharactersClassNameRegex.test(formDetails.name))
    ) {
      toast.info("Numele clasei nu este valid")
      return
    }

    if (formDetails.name.length > 10) {
      toast.info("Numele clasei este prea lung")
      return
    }

    if (isNaN(formDetails.maxNumberOfStudents)) {
      toast.info("Numarul maxim de elevi trebuie sa fie un numar")
      return
    }

    console.log(
      "Numarul maxim de elevi: " + isNaN(formDetails.maxNumberOfStudents),
    )

    if (formDetails.maxNumberOfStudents <= 0) {
      toast.info("Numarul maxim de elevi trebuie sa fie mai mare decat 0")
      return
    }

    if (formDetails.maxNumberOfStudents < formDetails.numberOfStudents) {
      toast.info(
        "Numarul maxim de elevi trebuie sa fie mai mare decat numarul actual",
      )
      return
    }

    const updateClassInfo = async () => {
      try {
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formDetails.name,
            maxNumberOfStudents: formDetails.maxNumberOfStudents,
          }),
        }

        const response = await fetchWithToken(
          `${domainName}/schools/updateClassDetails/${classDetails.id}`,
          requestOptions,
        )
        const responseMessage = await response.text()

        if (response.status === 200) {
          toast.success(responseMessage)
          reRenderRoot()
          setEditMode(false)
        } else if (response.status !== 500) toast.error(responseMessage)
        else toast.error("A aparut o eroare")
      } catch (error) {
        console.error(error)
      }
    }
    updateClassInfo()
  }

  return (
    <div
      className="centering-wrapper padded-fit-wrapper"
      style={{ textAlign: "center" }}
    >
      <h3 style={{ fontWeight: "bold" }}>Detaliile Clasei</h3>
      <Form
        fields={fields}
        setFormData={setFormDetails}
        intFields={["maxNumberOfStudents"]}
      ></Form>
      <div style={{ display: "flex", gap: "1em" }}>
        {!editMode ? (
          <Button
            onClick={() => setEditMode(true)}
            variant="contained"
            style={{
              backgroundColor: "var(--main-background-color)",
              color: "black",
              marginTop: "1em",
            }}
          >
            Editeaza
          </Button>
        ) : null}
        {editMode ? (
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
        ) : null}
        {editMode ? (
          <Button
            variant="contained"
            style={{
              backgroundColor: "#fc6a62",
              color: "black",
              marginTop: "1em",
            }}
            onClick={() => {
              setFormDetails({ ...classDetails })
              setEditMode(false)
            }}
          >
            Anuleaza
          </Button>
        ) : null}
      </div>
    </div>
  )
}
