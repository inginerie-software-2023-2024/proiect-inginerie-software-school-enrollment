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
import "./style.css"
import { fetchWithToken } from "../../tokenUtils"
import AddChildForm from "./AddChildForm"
import { domainName } from "../../generalConstants"

interface ChildData {
  cnp: string
  firstName: string
  lastName: string
  age: number
  id: number
}

export default function ChildrenList() {
  const [addChildModalState, setAddChildModalState] = useState(false)
  const openAddChildModal = () => setAddChildModalState(true)
  const closeAddChildModal = () => setAddChildModalState(false)
  const [dummyState, setDummyState] = useState(false) // used to force a re-render

  const forceRerender = () => {
    setDummyState((prev) => !prev)
  }

  const [childrenData, setChildrenData] = useState<Array<ChildData>>([])

  const tableHeaderStyle = {
    fontWeight: "bold",
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithToken(domainName + "/students/ofMyself")
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
  }, [dummyState])

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
                  <TableCell style={tableHeaderStyle}>Prenume</TableCell>
                  <TableCell align="right" style={tableHeaderStyle}>
                    Nume
                  </TableCell>
                  <TableCell align="right" style={tableHeaderStyle}>
                    CNP
                  </TableCell>
                  <TableCell align="right" style={tableHeaderStyle}>
                    Varsta
                  </TableCell>
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
            <AddChildForm
              closeModal={closeAddChildModal}
              reRenderParent={forceRerender}
            />
          </Box>
        </Modal>
      </Card>
    </div>
  )
}
