import {
  Box,
  Button,
  Card,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { fetchWithToken } from "../../tokenUtils"
import AddChildForm from "./AddChildForm"
import { ChildData } from "./ChildrenList"

export default function ChildrenList() {
  const [addChildModalState, setAddChildModalState] = useState(false)
  const openAddChildModal = () => setAddChildModalState(true)
  const closeAddChildModal = () => setAddChildModalState(false)

  const [childrenData, setChildrenData] = useState<Array<ChildData>>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithToken(
          "https://localhost:8080/students/ofMyself",
        )
        const rawData = await response.json()

        const formattedData: Array<ChildData> = rawData.map(
          (rawChildInfo: any) => ({
            cnp: rawChildInfo.cnp,
            firstName: rawChildInfo.firstName,
            lastName: rawChildInfo.lastName,
            age: rawChildInfo.age,
            id: rawChildInfo.id,
          }),
        )

        setChildrenData(formattedData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <div
      className="padded-fit-wrapper centering-wrapper"
      style={{ width: "100vw" }}
    >
      <Card className="centering-wrapper padded-fit-wrapper">
        <h1 style={{ fontWeight: "bold" }}>Copii Adaugati</h1>
        {childrenData.length === 0 ? (
          <>
            <br />
            <h2 style={{ color: "red" }}>Nu aveti copii adaugati!</h2>
            <h2 style={{ color: "red" }}>
              Apasati butonul de mai jos pentru a adauga copii.
            </h2>
          </>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Prenume</TableCell>
                  <TableCell align="right">Nume</TableCell>
                  <TableCell align="right">CNP</TableCell>
                  <TableCell align="right">Age</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {childrenData.map((child) => (
                  <TableRow
                    key={child.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {child.firstName}
                    </TableCell>
                    <TableCell align="right">{child.lastName}</TableCell>
                    <TableCell align="right">{child.cnp}</TableCell>
                    <TableCell align="right">{child.age}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Button
          variant="contained"
          style={{
            backgroundColor: "var(--main-background-color)",
            color: "black",
          }}
          onClick={openAddChildModal}
        >
          Adaugati Copil
        </Button>
        <Modal
          open={addChildModalState}
          onClose={closeAddChildModal}
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
            <AddChildForm />
          </Box>
        </Modal>
      </Card>
    </div>
  )
}
