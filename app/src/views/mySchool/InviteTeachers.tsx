import { Button, Card } from "@mui/material"
import React, { useState } from "react"
import "./style.css"
import Form from "../../components/form/Form"
import { fetchWithToken } from "../../tokenUtils"
import { domainName } from "../../generalConstants"
import { toast } from "sonner"

export default function InviteTeachers({
  reRenderRoot,
}: {
  reRenderRoot: () => void
}) {
  const [teacher, setTeacher] = useState({ teacherName: "" })
  const fields = [
    {
      value: teacher.teacherName,
      sm: 12,
      fullWidth: true,
      name: "teacherName",
      id: "teacher-username",
      label: "Username Profesor",
      type: "text",
      required: true,
    },
  ]

  const handleAddTeacher = () => {
    if (teacher.teacherName === "") {
      toast.info("Nu ati introdus nici un nume de utilizator")
      return
    }

    const addTeacher = async () => {
      try {
        const requestOptions = {
          method: "PUT",
        }
        const response = await fetchWithToken(
          `${domainName}/schools/addTeacher/${teacher.teacherName}`,
          requestOptions,
        )
        const responseMessage = await response.text()
        if (response.status === 200) {
          setTeacher({ teacherName: "" })
          toast.success(responseMessage)
          reRenderRoot()
        } else if (response.status !== 500) toast.error(responseMessage)
        else toast.error("A aparut o eroare")
      } catch (error) {
        console.log(error)
      }
    }
    addTeacher()
  }

  return (
    <div className="centering-wrapper">
      <h3 style={{ fontWeight: "bold" }}>Adaugati Profesor</h3>
      <Form fields={fields} setFormData={setTeacher} />
      <Button
        variant="contained"
        style={{
          backgroundColor: "var(--main-background-color)",
          color: "black",
          marginTop: "1em",
        }}
        onClick={handleAddTeacher}
      >
        Adauga Profesor
      </Button>
    </div>
  )
}
