import React, { useEffect, useState } from "react"
import { ChildData } from "../../interfaces/ChildData"
import { Button } from "@mui/material"
import { SchoolRequestData } from "../../interfaces/SchoolRequestData"
import { domainName } from "../../generalConstants"
import { fetchWithToken } from "../../tokenUtils"
import { toast } from "sonner"
import Form from "../../components/form/Form"
import CustomTable from "../../components/table/CustomTable"
import { SchoolRequestStatus } from "../../types/SchoolRequestStatus"
import { requestStatusMapping } from "../../usefulMappings"

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
  const [childData, setChildData] = useState({ ...childInfo })
  const [requestsData, setRequestsData] = useState<SchoolRequestData[]>([])
  const [tableRequestsData, setTableRequestsData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithToken(
          domainName + `/requests/ofStudent/${childData.id}`,
        )
        console.log(
          "Am facut apel la: ",
          domainName + `/requests/ofStudent/${childData.id}`,
        )
        const rawData = await response.json()
        if (Array.isArray(rawData)) {
          setRequestsData(rawData)
        } else {
          console.log("Error: rawData is not an array")
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const changeRequestStatus = async (
    requestId: number,
    status: SchoolRequestStatus,
  ) => {
    try {
      const requestOptions = {
        method: "PUT",
      }
      const response = await fetchWithToken(
        `${domainName}/requests/changeStatus/${requestId}/${status}`,
        requestOptions,
      )
      console.log(
        "Am facut apel la: ",
        `${domainName}/requests/changeStatus/${requestId}/${status}`,
      )
      if (response.ok) {
        toast.success("Statusul cererii a fost modificat cu succes")
        reRenderParent()
        closeModal()
      } else {
        const responseMessage = await response.text()
        toast.error(responseMessage)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    console.log("RequestsData: ", requestsData)
    setTableRequestsData(
      requestsData.map((request) => {
        return {
          school: request.school.name,
          grade: request.grade,
          status: requestStatusMapping[request.status],
          id: request.id,
          actions: [
            <div
              key={request.id}
              style={{
                display: "flex",
                gap: "0.5em",
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              {request.status === "SENT" ? (
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#fc6a62",
                    color: "black",
                    fontSize: 10,
                  }}
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation()
                    changeRequestStatus(request.id, "CANCELED")
                  }}
                >
                  Anuleaza
                </Button>
              ) : null}
              {request.status === "ACCEPTED" ? (
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#93fc83",
                    color: "black",
                    fontSize: 10,
                  }}
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation()
                    changeRequestStatus(request.id, "CONFIRMED")
                  }}
                >
                  Confirma
                </Button>
              ) : null}
              {request.status === "ACCEPTED" ? (
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#fc6a62",
                    color: "black",
                    fontSize: 10,
                  }}
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation()
                    changeRequestStatus(request.id, "DECLINED")
                  }}
                >
                  Refuza
                </Button>
              ) : null}
            </div>,
          ],
        }
      }),
    )
    console.log("TableRequestsData: ", tableRequestsData)
  }, [requestsData])

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
      value: childData.lastName,
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
      value: childData.firstName,
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
      value: childData.cnp,
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
      value: childData.age,
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
      value:
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
      value: childData.class != null ? childData.class.name : "---------------",
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
      className="two-columns-child-details"
      style={{ width: "fit-content", maxWidth: "100vw", minWidth: "1000px" }}
    >
      <div>
        <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
          Detalii Copil
        </h2>
        <Form fields={fields} setFormData={setChildData} intFields={["age"]} />
        <div
          style={{
            marginTop: "1em",
            display: "flex",
            justifyContent: "space-around",
            gap: "1em",
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
              onClick={() => {
                setChildData({ ...childInfo })
                setEditMode(false)
              }}
            >
              Anuleaza
            </Button>
          ) : null}
        </div>
      </div>
      <div style={{ width: "fit-content" }}>
        <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
          Cererile pentru Copil
        </h2>
        {childData.school == null ? (
          requestsData.length > 0 ? (
            <CustomTable
              tableHeaders={["Scoala", "Clasa", "Status", "Actiuni"]}
              tableData={tableRequestsData}
              tableDataOrder={["school", "grade", "status", "actions"]}
              tableStyle={{ maxHeight: "40vh", overflowY: "scroll" }}
            />
          ) : (
            <h3
              style={{ color: "red", textAlign: "center", fontWeight: "bold" }}
            >
              Nu exista cereri pentru acest copil
            </h3>
          )
        ) : (
          <h3
            style={{
              color: "green",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Copilul este deja inscris la scoala
            <br />
            <h3 style={{ fontWeight: "bold" }}>
              <a
                style={{ textDecoration: "none" }}
                href={`/scoli/${childData.school.id}`}
                target="_blank"
                rel="noreferrer"
              >
                {childData.school.name}
              </a>
            </h3>
          </h3>
        )}
      </div>
    </div>
  )
}
