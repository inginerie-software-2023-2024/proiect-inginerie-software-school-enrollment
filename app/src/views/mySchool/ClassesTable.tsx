import { Box, Button, Card, Modal } from "@mui/material"
import React, { useState } from "react"
import CustomTable from "../../components/table/CustomTable"
import AddClassForm from "./AddClassForm"
import { domainName } from "../../generalConstants"
import { fetchWithToken } from "../../tokenUtils"
import { toast } from "sonner"

export default function ClassesTable({
  classesData,
  reRenderRoot,
}: {
  classesData: Array<any>
  reRenderRoot: () => void
}) {
  const [addClassModalState, setAddClassModalState] = useState(false)

  const closeAddClassModal = () => setAddClassModalState(false)
  const openAddClassModal = () => setAddClassModalState(true)

  const tableHeaders = [
    "Nume Clasa",
    "Profesor",
    "Numar Elevi",
    "Numar Maxim Elevi",
    "Sterge Clasa",
  ]

  const tableStyle = {
    width: "100%",
    maxHeight: "50vh",
  }

  const tableHeaderStyle = {
    fontWeight: "bold",
    backgroundColor: "#c0d1eb",
  }

  const removeClass = async (classId: number) => {
    try {
      const requestOptions = {
        method: "PUT",
      }

      const response = await fetchWithToken(
        `${domainName}/schools/removeClass/${classId}`,
        requestOptions,
      )
      const responseMessage = await response.text()
      if (response.status === 200) {
        toast.success(responseMessage)
        reRenderRoot()
      } else if (response.status !== 500) toast.error(responseMessage)
      else toast.error("A aparut o eroare")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Card className="padded-fit-wrapper centering-wrapper">
      <h3 style={{ fontWeight: "bold", display: "block", marginBottom: "1em" }}>
        Clasele Dvs.
      </h3>
      {classesData.length > 0 ? (
        <CustomTable
          tableHeaders={tableHeaders}
          tableData={classesData.map((classData) => {
            return {
              ...classData,
              deleteButton: (
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#fc6a62",
                    color: "black",
                    marginTop: "1em",
                  }}
                  onClick={() => {
                    removeClass(classData.id)
                  }}
                  title="Stergerea clasei va elimina profesorul si elevii din clasa respectiva"
                >
                  Sterge
                </Button>
              ),
            }
          })}
          tableDataOrder={[
            "name",
            "teacher",
            "numberOfStudents",
            "maxNumberOfStudents",
            "deleteButton",
          ]}
          tableStyle={tableStyle}
          tableHeaderStyle={tableHeaderStyle}
        />
      ) : (
        <h4 style={{ fontWeight: "bold", color: "red" }}>
          Nu aveti clase adaugate
        </h4>
      )}
      <Button
        variant="contained"
        style={{
          backgroundColor: "var(--main-background-color)",
          color: "black",
          marginTop: "1em",
        }}
        onClick={openAddClassModal}
      >
        Adauga Clasa Noua
      </Button>
      <Modal
        open={addClassModalState}
        onClose={closeAddClassModal}
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
          <AddClassForm reRenderRoot={reRenderRoot} />
        </Box>
      </Modal>
    </Card>
  )
}
