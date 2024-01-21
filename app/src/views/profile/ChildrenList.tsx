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
import {
  domainName,
  romanianCNPRegex,
  romanianNameRegex,
} from "../../generalConstants"
import ChildDetails from "./ChildDetails"
import PropTypes from "prop-types"
import { ChildData } from "../../interfaces/ChildData"
import { toast } from "sonner"

export default function ChildrenList({ tableStyle }: { tableStyle?: object }) {
  const [addChildModalState, setAddChildModalState] = useState(false)
  const openAddChildModal = () => setAddChildModalState(true)
  const closeAddChildModal = () => setAddChildModalState(false)
  const [childDetailsModal, setChildDetailsModal] = useState(false)
  const openChildDetailsModal = () => setChildDetailsModal(true)
  const closeChildDetailsModal = () => setChildDetailsModal(false)
  const [dummyState, setDummyState] = useState(false) // used to force a re-render

  const [selectedChildInfo, setSelectedChildInfo] = useState<ChildData>({
    cnp: "",
    firstName: "",
    lastName: "",
    age: 0,
    id: 0,
    school: {},
    class: {},
  })

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
            school: rawChildInfo.school,
            class: rawChildInfo.schoolClass,
          }),
        )

        setChildrenData(formattedData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [dummyState])

  const validateStudentData = (studentData: any) => {
    if (
      studentData.firstName === "" ||
      studentData.lastName === "" ||
      studentData.cnp === ""
    ) {
      toast.error("Toate campurile sunt obligatorii")
      return false
    }

    if (!romanianNameRegex.test(studentData.firstName)) {
      toast.error("Prenumele introdus nu este valid")
      return false
    }
    if (!romanianNameRegex.test(studentData.lastName)) {
      toast.error("Numele introdus nu este valid")
      return false
    }

    if (!romanianCNPRegex.test(studentData.cnp)) {
      toast.error("CNP-ul introdus nu este valid")
      return false
    }

    if (studentData.age < 6 && studentData.age > 18) {
      toast.error("Varsta copilului trebuie sa fie intre 6 si 18 ani")
      return false
    }

    return true
  }

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
          <TableContainer style={tableStyle}>
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
                    onClick={() => {
                      setSelectedChildInfo(child), openChildDetailsModal()
                    }}
                    className="selected-row"
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
            marginTop: "1em",
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
              validateStudentData={validateStudentData}
            />
          </Box>
        </Modal>
        <Modal
          open={childDetailsModal}
          onClose={closeChildDetailsModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "fit-content",
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
            className="centering-wrapper"
          >
            <ChildDetails
              closeModal={closeChildDetailsModal}
              reRenderParent={forceRerender}
              childInfo={selectedChildInfo}
              validateStudentData={validateStudentData}
            />
          </Box>
        </Modal>
      </Card>
    </div>
  )
}

ChildrenList.prototype = {
  tableStyle: PropTypes.object,
}
