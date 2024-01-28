import { Card } from "@mui/material"
import React, { useEffect, useState } from "react"
import CustomTable from "../../components/table/CustomTable"
import { fetchWithToken } from "../../tokenUtils"
import { domainName } from "../../generalConstants"

export default function TeachersTable() {
  const [teachersData, setTeachersData] = useState<Array<any>>([])

  useEffect(() => {
    const fetchTeachersData = async () => {
      try {
        const response = await fetchWithToken(
          `${domainName}/schools/mySchoolTeachers`,
        )
        if (response.status === 200) {
          const rawData = await response.json()
          rawData.sort((a: any, b: any) => {
            if (a.lastName.toLowerCase() < b.lastName.toLowerCase()) return -1
            if (a.lastName.toLowerCase() > b.lastName.toLowerCase()) return 1
            if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) return -1
            if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) return 1
            if (a.username.toLowerCase() < b.username.toLowerCase()) return -1
            if (a.username.toLowerCase() > b.username.toLowerCase()) return 1
            return 0
          })
          setTeachersData(rawData)
        } else {
          console.log("Error fetching teachers data: ", response)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchTeachersData()
  }, [])

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
    </Card>
  )
}
