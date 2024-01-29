import {
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from "@mui/material"
import React, { useState } from "react"
import { toast } from "sonner"
import { fetchWithToken } from "../../tokenUtils"
import { domainName } from "../../generalConstants"

export default function ChangeTeacher({
  currentTeacherId,
  reRenderRoot,
  teachersData,
  classId,
}: {
  currentTeacherId: number
  reRenderRoot: () => void
  teachersData: Array<any>
  classId: number
}) {
  const [selectedTeahcerId, setSelectedTeacherId] = useState(currentTeacherId)

  const handleSubmit = () => {
    if (selectedTeahcerId === currentTeacherId) {
      toast.info("Deja aveti acest profesor selectat")
      return
    }

    const changeTeacher = async () => {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherId: selectedTeahcerId,
          classId: classId,
        }),
      }

      try {
        const response = await fetchWithToken(
          `${domainName}/schools/changeClassTeacher`,
          requestOptions,
        )
        const responseMessage = await response.text()
        if (response.ok) {
          reRenderRoot()
          toast.success(responseMessage)
        } else if (response.status !== 500) {
          toast.error(responseMessage)
        } else {
          toast.error("Eroare la schimbarea profesorului")
        }
      } catch (error) {
        console.error(error)
      }
    }
    changeTeacher()
  }

  return (
    <div className="centering-wrapper" style={{ textAlign: "center" }}>
      <h3 style={{ fontWeight: "bold" }}>Schimba Profesorul</h3>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          value={selectedTeahcerId}
          onChange={(event) =>
            setSelectedTeacherId(event.target.value as number)
          }
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem disabled={currentTeacherId === 0} key={0} value={0}>
            {`Fara Profesor`}
          </MenuItem>
          {teachersData.map((teacher) =>
            teacher.id === currentTeacherId ? (
              <MenuItem disabled key={teacher.id} value={teacher.id}>
                {`${teacher.firstName} ${teacher.lastName} (${teacher.username})`}
              </MenuItem>
            ) : (
              <MenuItem key={teacher.id} value={teacher.id}>
                {`${teacher.firstName} ${teacher.lastName} (${teacher.username})`}
              </MenuItem>
            ),
          )}
        </Select>
        <FormHelperText>Selectati Profesorul</FormHelperText>
        <Button
          variant="contained"
          onClick={handleSubmit}
          style={{
            backgroundColor: "var(--main-background-color)",
            color: "#000000",
          }}
        >
          Schimba Profesor
        </Button>
      </FormControl>
    </div>
  )
}
