import React from "react"
import CustomTable from "../../components/table/CustomTable"
import { Button } from "@mui/material"
import { fetchWithToken } from "../../tokenUtils"
import { domainName } from "../../generalConstants"
import { toast } from "sonner"

export default function ClassStudentsTable({
  reRenderRoot,
  classData,
}: {
  reRenderRoot: () => void
  classData: any
}) {
  const tableHeaders = ["Elev", "CNP", "Parinte", "Elimina din Clasa"]

  const removeStudentFromClass = async (studentId: number) => {
    try {
      const requestOptions = {
        method: "POST",
      }

      const response = await fetchWithToken(
        `${domainName}/students/remove/${studentId}/fromClass/${classData.id}`,
        requestOptions,
      )
      const responseMessage = await response.text()
      if (response.ok) {
        toast.success(responseMessage)
        reRenderRoot()
      } else if (response.status !== 500) {
        toast.error(responseMessage)
      } else {
        toast.error("Eroare la eliminarea elevului din clasa")
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="centering-wrapper">
      <h2 style={{ fontWeight: "bold" }}>Elevii din clasa</h2>
      {classData.students.length > 0 ? (
        <CustomTable
          tableHeaders={tableHeaders}
          tableHeaderStyle={{ fontWeight: "bold" }}
          tableStyle={{ width: "100%", maxHeight: "50vh", overflowY: "scroll" }}
          tableData={classData.students.map((studentData) => {
            return {
              ...studentData,
              fullName: studentData.lastName + " " + studentData.firstName,
              parent: `${studentData.parent.lastName} ${studentData.parent.firstName} (${studentData.parent.username})`,
              removeButton: (
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#fc6a62",
                    color: "black",
                    marginTop: "1em",
                  }}
                  onClick={(event) => {
                    event.stopPropagation()
                    removeStudentFromClass(studentData.id)
                  }}
                  title="Eliminarea unui elev il va face sa apara in lista elevilor neasignati la clase"
                >
                  Elimina
                </Button>
              ),
            }
          })}
          tableDataOrder={["fullName", "cnp", "parent", "removeButton"]}
        />
      ) : (
        <h3 style={{ fontWeight: "bold", color: "red" }}>
          Nu exista nici un copil in aceasta clasa
        </h3>
      )}
    </div>
  )
}
