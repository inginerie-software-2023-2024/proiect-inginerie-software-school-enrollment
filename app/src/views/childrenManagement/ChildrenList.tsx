import { Box, Button, Card, Modal } from "@mui/material"
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
import CustomTable from "../../components/table/CustomTable"

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
    backgroundColor: "#c0d1eb",
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithToken(domainName + "/students/ofMyself")
        console.log("Am facut apel la: ", domainName + "/students/ofMyself")
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

        formattedData.sort((a, b) => {
          if (a.firstName < b.firstName) return -1
          if (a.firstName > b.firstName) return 1
          if (a.lastName < b.lastName) return -1
          if (a.lastName > b.lastName) return 1
          return 0
        })

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

    if (isNaN(studentData.age)) {
      toast.error("Varsta copilului trebuie sa fie un numar")
      return false
    }

    if (studentData.age < 6 || studentData.age > 18) {
      toast.error("Varsta copilului trebuie sa fie intre 6 si 18 ani")
      return false
    }

    return true
  }

  const tableHeaders = ["Prenume", "Nume", "CNP", "Varsta"]

  return (
    <div
      className="padded-fit-wrapper centering-wrapper"
      style={{ width: "100vw" }}
    >
      <Card className="centering-wrapper padded-fit-wrapper">
        <h1
          style={{ fontWeight: "bold", display: "block", marginBottom: "1em" }}
        >
          Copii Adaugati
        </h1>
        {childrenData.length === 0 ? (
          <>
            <br />
            <h2 style={{ color: "red" }}>Nu aveti copii adaugati!</h2>
            <h2 style={{ color: "red" }}>
              Apasati butonul de mai jos pentru a adauga copii.
            </h2>
          </>
        ) : (
          <CustomTable
            tableHeaders={tableHeaders}
            tableData={childrenData}
            tableDataOrder={["firstName", "lastName", "cnp", "age"]}
            tableStyle={tableStyle}
            tableHeaderStyle={tableHeaderStyle}
            rowClickFunction={(data) => {
              setSelectedChildInfo(data), openChildDetailsModal()
            }}
          />
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
              width: "90vw",
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
