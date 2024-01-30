import { Button, Card } from "@mui/material"
import React, { useEffect, useState } from "react"
import CustomTable from "../../components/table/CustomTable"
import { SchoolRequestData } from "../../interfaces/SchoolRequestData"
import { fetchWithToken } from "../../tokenUtils"
import { domainName } from "../../generalConstants"
import { SchoolRequestStatus } from "../../types/SchoolRequestStatus"
import { toast } from "sonner"
import { requestStatusMapping } from "../../usefulMappings"

export default function StudentsRequests({
  reRenderRoot,
}: {
  readonly reRenderRoot: () => void
}) {
  const [requestsData, setRequestsData] = useState<SchoolRequestData[]>([])

  useEffect(() => {
    const fetchRequests = async () => {
      const response = await fetchWithToken(`${domainName}/requests/ofMySchool`)
      const responseJSON = await response.json()
      if (response.status === 200) {
        setRequestsData(responseJSON)
      } else {
        console.error(responseJSON)
      }
    }
    fetchRequests()
  }, [])

  const tableStyle = {
    width: "100%",
    maxHeight: "50vh",
  }

  const tableHeaderStyle = {
    fontWeight: "bold",
    backgroundColor: "#c0d1eb",
  }

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
      if (response.ok) {
        toast.success("Statusul cererii a fost modificat cu succes")
        reRenderRoot()
      } else {
        const responseMessage = await response.text()
        toast.error(responseMessage)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Card className="centering-wrapper padded-fit-wrapper">
      <h3 style={{ fontWeight: "bold" }}>Cereri de inscriere</h3>
      {requestsData.filter((request) =>
        ["SENT", "ACCEPTED"].includes(request.status),
      ).length > 0 ? (
        <CustomTable
          tableHeaders={["Copil", "Clasa", "Status", "Actiuni"]}
          tableData={requestsData
            .map((request) => {
              return {
                child:
                  request.student.lastName + " " + request.student.firstName,
                grade: request.grade,
                status: requestStatusMapping[request.status],
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
                          backgroundColor: "#93fc83",
                          color: "black",
                          fontSize: 10,
                        }}
                        size="small"
                        onClick={(event) => {
                          event.stopPropagation()
                          changeRequestStatus(request.id, "ACCEPTED")
                        }}
                      >
                        Accepta
                      </Button>
                    ) : null}
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
                          changeRequestStatus(request.id, "REJECTED")
                        }}
                      >
                        Respinge
                      </Button>
                    ) : null}
                  </div>,
                ],
              }
            })
            .filter((request) =>
              [
                requestStatusMapping["SENT"],
                requestStatusMapping["ACCEPTED"],
              ].includes(request.status),
            )}
          tableDataOrder={["child", "grade", "status", "actions"]}
          tableStyle={tableStyle}
          tableHeaderStyle={tableHeaderStyle}
        />
      ) : (
        <h3 style={{ fontWeight: "bold", color: "red" }}>
          Nu exista cereri in asteptare
        </h3>
      )}
    </Card>
  )
}
