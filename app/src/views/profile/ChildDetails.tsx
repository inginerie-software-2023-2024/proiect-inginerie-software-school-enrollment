import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { ChildData } from "../../interfaces/ChildData"
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material"
import { SchoolRequestData } from "../../interfaces/SchoolRequestData"
import { domainName } from "../../generalConstants"
import { fetchWithToken } from "../../tokenUtils"
import { toast } from "sonner"

export default function ChildDetails({
  closeModal,
  reRenderParent,
  childInfo,
  validateStudentData,
}: {
  closeModal: () => void
  reRenderParent: () => void
  childInfo: ChildData
  validateStudentData: (studentData: any) => boolean
}) {
  const [editMode, setEditMode] = useState(false)
  const [childData, setChildData] = useState(childInfo)
  const [requestsData, setRequestsData] = useState<SchoolRequestData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithToken(
          domainName + `requests/ofStudent/${childData.id}`,
        )
        const rawData = await response.json()
        setRequestsData(rawData)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setChildData((prevState) => ({
      ...prevState,
      [name]: name === "age" ? parseInt(value) : value,
    }))
  }

  const handleSave = () => {
    if (!validateStudentData(childData)) return
    if (childData === childInfo) {
      toast.info("Nu s-au facut modificari")
      return
    }

    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(childData),
        }

        const response = await fetchWithToken(
          domainName + "/students/update",
          requestOptions,
        )

        switch (response.status) {
          case 200:
            toast.success("Informatii modificate cu succes")
            break
          case 404:
            toast.error("Nu s-a gasit copilul")
            break
          case 409:
            toast.error("CNP-ul este deja folosit")
            break
          default:
            toast.error("A aparut o eroare. Modificari nesalvate!")
            break
        }
        closeModal()
        reRenderParent()
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }

  const fields = [
    {
      defaultValue: childData.lastName,
      autoComplete: "child-last-name",
      name: "lastName",
      label: "Nume Copil",
      type: "text",
      required: true,
      autoFocus: true,
      id: "child-last-name",
      fullWidth: true,
      sm: 12,
      disabled: !editMode,
    },
    {
      defaultValue: childData.firstName,
      autoComplete: "child-first-name",
      name: "firstName",
      label: "Prenume Copil",
      type: "text",
      required: true,
      autoFocus: false,
      id: "child-first-name",
      fullWidth: true,
      sm: 12,
      disabled: !editMode,
    },
    {
      defaultValue: childData.cnp,
      autoComplete: "child-cnp",
      name: "cnp",
      label: "CNP Copil",
      type: "text",
      required: true,
      autoFocus: false,
      id: "child-cnp",
      fullWidth: true,
      sm: 12,
      disabled: !editMode,
    },
    {
      defaultValue: childData.age,
      autoComplete: "off",
      name: "age",
      label: "Varsta Copil",
      type: "number",
      required: true,
      autoFocus: false,
      id: "child-age",
      fullWidth: true,
      sm: 12,
      disabled: !editMode,
    },
    {
      defaultValue:
        childData.school != null ? childData.school.name : "---------------",
      label: "Scoala",
      type: "text",
      fullWidth: true,
      sm: 12,
      disabled: true,
      autoFocus: false,
      name: "school-name",
      id: "child-school-name",
    },
    {
      defaultValue:
        childData.class != null ? childData.class.name : "---------------",
      label: "Clasa",
      type: "text",
      fullWidth: true,
      sm: 12,
      disabled: true,
      autoFocus: false,
      name: "school-name",
      id: "child-school-name",
    },
  ]

  return (
    <div
      className="two-columns"
      style={{ width: "fit-content", maxWidth: "100vw", minWidth: "1000px" }}
    >
      <div>
        <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
          Detalii Copil
        </h2>
        <Grid container spacing={2} style={{ marginTop: "1em" }}>
          {fields.map((field, index) => {
            return (
              <Grid key={index} item xs={12} sm={field.sm}>
                <TextField {...field} onChange={handleChange} />
              </Grid>
            )
          })}
        </Grid>
        <div
          style={{
            marginTop: "1em",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          {!editMode ? (
            <Button
              onClick={() => setEditMode(true)}
              variant="contained"
              style={{
                backgroundColor: "var(--main-background-color)",
                color: "black",
                marginTop: "1em",
              }}
            >
              Editeaza
            </Button>
          ) : null}
          {editMode ? (
            <Button
              variant="contained"
              style={{
                backgroundColor: "#93fc83",
                color: "black",
                marginTop: "1em",
              }}
              onClick={handleSave}
            >
              {/* //! TODO: la update nu se salveaza informatiile noi, ci se creeaza un nou student in BD*/}
              {/* //! TODO: TESTEAZA DACA MERGE BINE TABELUL DE REQUEST-URI SI UPDATE DE INFORMATII ALE COPILULUI*/}
              Salveaza
            </Button>
          ) : null}
          {editMode ? (
            <Button
              variant="contained"
              style={{
                backgroundColor: "#fc6a62",
                color: "black",
                marginTop: "1em",
              }}
              onClick={() => setEditMode(false)}
            >
              Anuleaza
            </Button>
          ) : null}
        </div>
      </div>
      <div style={{ width: "fit-content", maxWidth: "30vw" }}>
        <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
          Cererile pentru Copil
        </h2>
        {requestsData.length > 0 ? (
          childData.school == null ? (
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Scoala</TableCell>
                    <TableCell style={{ fontWeight: "bold" }} align="right">
                      Clasa
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }} align="right">
                      Status
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }} align="right">
                      Actiune
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requestsData.map((request) => (
                    <TableRow
                      key={request.id}
                      className="selected-row"
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {request.school.name}
                      </TableCell>
                      <TableCell align="right">{request.grade}</TableCell>
                      <TableCell align="right">{request.status}</TableCell>
                      <TableCell align="right">Action Placeholder</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <h3
              style={{
                color: "green",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Copilul este deja inscris la o scoala
            </h3>
          )
        ) : (
          <h3 style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>
            Nu exista cereri pentru acest copil
          </h3>
        )}
      </div>
    </div>
  )
}
