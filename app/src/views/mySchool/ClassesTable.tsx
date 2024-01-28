import { Box, Button, Card, Modal } from "@mui/material"
import React, { useState } from "react"
import CustomTable from "../../components/table/CustomTable"
import AddClassForm from "./AddClassForm"

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
  ]

  const tableStyle = {
    width: "100%",
    height: "auto",
  }

  const tableHeaderStyle = {
    fontWeight: "bold",
  }

  return (
    <Card className="padded-fit-wrapper centering-wrapper">
      <h3 style={{ fontWeight: "bold" }}>Clasele Dvs.</h3>
      {classesData.length > 0 ? (
        <CustomTable
          tableHeaders={tableHeaders}
          tableData={classesData}
          tableDataOrder={[
            "name",
            "teacher",
            "numberOfStudents",
            "maxNumberOfStudents",
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
