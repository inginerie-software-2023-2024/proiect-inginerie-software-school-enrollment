import React, { useState } from "react"
import { toast } from "sonner"
import {
  domainName,
  moreCharactersClassNameRegex,
  oneCharacterClassNameRegex,
} from "../../generalConstants"
import { fetchWithToken } from "../../tokenUtils"
import Form from "../../components/form/Form"
import { Button } from "@mui/material"

export default function AddClassForm({
  reRenderRoot,
}: {
  reRenderRoot: () => void
}) {
  const [classDetails, setClassDetails] = useState({
    name: "",
    maxNumberOfStudents: 0,
  })
  const fields = [
    {
      value: classDetails.name,
      sm: 12,
      fullWidth: true,
      name: "name",
      id: "class-name-add",
      label: "Numele Clasei",
      type: "text",
      required: true,
    },
    {
      value: classDetails.maxNumberOfStudents,
      sm: 12,
      fullWidth: true,
      name: "maxNumberOfStudents",
      id: "class-max-number-of-students-add",
      label: "Numarul maxim de elevi",
      type: "number",
      required: true,
    },
  ]

  const handleAddTeacher = () => {
    if (classDetails.name === "") {
      toast.info("Nu ati introdus nici un nume de clasa")
      return
    }

    if (
      (classDetails.name.length === 1 &&
        !oneCharacterClassNameRegex.test(classDetails.name)) ||
      (classDetails.name.length > 1 &&
        classDetails.name.length < 10 &&
        !moreCharactersClassNameRegex.test(classDetails.name))
    ) {
      toast.info("Numele clasei nu este valid")
      return
    }

    if (classDetails.name.length > 10) {
      toast.info("Numele clasei este prea lung")
      return
    }

    if (isNaN(classDetails.maxNumberOfStudents)) {
      toast.info("Numarul maxim de elevi trebuie sa fie un numar")
      return
    }

    if (classDetails.maxNumberOfStudents <= 0) {
      toast.info("Numarul maxim de elevi trebuie sa fie mai mare decat 0")
      return
    }

    const addClass = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(classDetails),
        }
        const response = await fetchWithToken(
          `${domainName}/schools/addClass`,
          requestOptions,
        )
        const responseMessage = await response.text()
        if (response.status === 200) {
          setClassDetails({ name: "", maxNumberOfStudents: 0 })
          toast.success(responseMessage)
          reRenderRoot()
        } else if (response.status !== 500) toast.error(responseMessage)
        else toast.error("A aparut o eroare")
      } catch (error) {
        console.log(error)
      }
    }
    addClass()
  }

  return (
    <div className="centering-wrapper">
      <h3 style={{ fontWeight: "bold" }}>Adaugati Clasa</h3>
      <Form
        fields={fields}
        setFormData={setClassDetails}
        intFields={["maxNumberOfStudents"]}
      />
      <Button
        variant="contained"
        style={{
          backgroundColor: "var(--main-background-color)",
          color: "black",
          marginTop: "1em",
        }}
        onClick={handleAddTeacher}
      >
        Adauga Clasa
      </Button>
    </div>
  )
}
