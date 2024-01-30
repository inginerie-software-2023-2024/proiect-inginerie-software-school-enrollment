import {
  Box,
  Button,
  Card,
  FormControl,
  FormHelperText,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import CustomTable from "../../components/table/CustomTable"
import { fetchWithToken } from "../../tokenUtils"
import { domainName } from "../../generalConstants"
import { toast } from "sonner"

export default function UnasignedStudents({
  reRenderRoot,
  classesData,
}: {
  reRenderRoot: () => void
  classesData: Array<any>
}) {
  const [unasignedStudents, setUnasignedStudents] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [assignModalState, setAssignModalState] = useState(false)

  const closeAssignModal = () => setAssignModalState(false)
  const openAssignModal = () => setAssignModalState(true)

  useEffect(() => {
    const fetchUnassignedStudents = async () => {
      const response = await fetchWithToken(
        `${domainName}/schools/getUnassignedStudentsOfMySchool`,
      )
      const responseJSON = await response.json()
      if (response.status === 200) {
        setUnasignedStudents(responseJSON)
      } else {
        console.error(responseJSON)
      }
    }
    fetchUnassignedStudents()
  }, [])

  const tableStyle = {
    width: "100%",
    maxHeight: "50vh",
  }

  const tableHeaderStyle = {
    fontWeight: "bold",
    backgroundColor: "#c0d1eb",
  }

  const handleAssign = async () => {
    try {
      const requestOptions = {
        method: "POST",
      }
      const response = await fetchWithToken(
        `${domainName}/students/assign/${selectedStudent.id}/toClass/${selectedClass.id}`,
        requestOptions,
      )
      const responseMessage = await response.text()
      if (response.ok) {
        toast.success(responseMessage)
        closeAssignModal()
        reRenderRoot()
      } else if (response.status !== 500) toast.error(responseMessage)
      else toast.error("A aparut o eroare")
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedClass(event.target.value)
  }

  return (
    <Card className="centering-wrapper padded-fit-wrapper">
      <h3 style={{ fontWeight: "bold" }}>Elevi neasignati la clase</h3>
      {unasignedStudents.length > 0 ? (
        <CustomTable
          tableHeaders={[
            "Copil",
            "Parinte",
            "Clasa Ceruta",
            "Asigneaza in clasa",
          ]}
          tableData={unasignedStudents.map((student, index) => {
            return {
              child: student.lastName + " " + student.firstName,
              requiredGrade: student.requiredGrade,
              parent: `${student.parentLastName} ${student.parentFirstName} (${student.parentUsername})`,
              actions: [
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "var(--main-background-color)",
                    color: "black",
                    marginTop: "1em",
                  }}
                  key={index}
                  onClick={() => {
                    setSelectedStudent(student)
                    openAssignModal()
                  }}
                >
                  Asigneaza Clasa
                </Button>,
              ],
            }
          })}
          tableDataOrder={["child", "parent", "requiredGrade", "actions"]}
          tableStyle={tableStyle}
          tableHeaderStyle={tableHeaderStyle}
        />
      ) : (
        <h3 style={{ fontWeight: "bold", color: "red" }}>
          Nu exista elevi care sa nu faca parte dintr-o clasa
        </h3>
      )}
      <Modal
        open={assignModalState}
        onClose={closeAssignModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
          className="centering-wrapper"
        >
          <h3 style={{ fontWeight: "bold", textAlign: "center" }}>
            Asigneaza elevul{" "}
            <span style={{ color: "darkBlue" }}>
              {selectedStudent?.lastName} {selectedStudent?.firstName}
            </span>{" "}
            in clasa
          </h3>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select
              value={selectedClass}
              onChange={handleChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {classesData.map((classData, index) => (
                <MenuItem key={index} value={classData}>
                  {classData.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Selectati clasa</FormHelperText>
            <Button
              variant="contained"
              onClick={handleAssign}
              style={{
                backgroundColor: "var(--main-background-color)",
                color: "#000000",
              }}
            >
              Asigneaza
            </Button>
          </FormControl>
        </Box>
      </Modal>
    </Card>
  )
}
