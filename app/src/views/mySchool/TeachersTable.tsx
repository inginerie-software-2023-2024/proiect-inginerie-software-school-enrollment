import { Box, Button, Card, Modal } from "@mui/material"
import React, { useEffect, useState } from "react"
import CustomTable from "../../components/table/CustomTable"
import { fetchWithToken } from "../../tokenUtils"
import { domainName } from "../../generalConstants"
import InviteTeachers from "./InviteTeachers"

export default function TeachersTable({
  teachersData,
  reRenderRoot,
}: {
  teachersData: Array<any>
  reRenderRoot: () => void
}) {
  const [addTeacherModalState, setAddTeacherModalState] = useState(false)

  const closeAddTeacherModal = () => setAddTeacherModalState(false)
  const openAddTeacherModal = () => setAddTeacherModalState(true)

  const tableHeaders = ["Nume", "Prenume", "Username", "Email", "Clasa"]

  const tableStyle = {
    width: "100%",
    height: "auto",
  }

  const tableHeaderStyle = {
    fontWeight: "bold",
  }

  return (
    <Card className="padded-fit-wrapper centering-wrapper">
      <h3 style={{ fontWeight: "bold" }}>Profesorii din Scoala Dvs.</h3>
      {teachersData.length > 0 ? (
        <CustomTable
          tableHeaders={tableHeaders}
          tableData={teachersData}
          tableDataOrder={[
            "lastName",
            "firstName",
            "username",
            "email",
            "className",
          ]}
          tableStyle={tableStyle}
          tableHeaderStyle={tableHeaderStyle}
        />
      ) : (
        <h4 style={{ fontWeight: "bold", color: "red" }}>
          Nu aveti profesori adaugati
        </h4>
      )}
      <Button
        variant="contained"
        style={{
          backgroundColor: "var(--main-background-color)",
          color: "black",
          marginTop: "1em",
        }}
        onClick={openAddTeacherModal}
      >
        Adauga Profesor Nou
      </Button>
      <Modal
        open={addTeacherModalState}
        onClose={closeAddTeacherModal}
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
          <InviteTeachers reRenderRoot={reRenderRoot} />
        </Box>
      </Modal>
    </Card>
  )
}
