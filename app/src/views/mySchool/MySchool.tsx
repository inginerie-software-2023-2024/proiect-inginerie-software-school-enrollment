import React, { useEffect, useState } from "react"
import { fetchWithToken, getCurrentUserRole } from "../../tokenUtils"
import { useNavigate } from "react-router-dom"
import { SchoolData } from "../../interfaces/SchoolData"
import { domainName } from "../../generalConstants"
import NoSchoolComponent from "./NoSchoolComponent"
import SchoolManagement from "./SchoolManagement"

export default function MySchool() {
  const navigate = useNavigate()
  const [schoolInfo, setSchoolInfo] = useState<SchoolData | null>(null)
  const [dummyState, setDummyState] = useState(0)

  useEffect(() => {
    if (
      localStorage.getItem("token") === null ||
      getCurrentUserRole() !== "principal"
    )
      navigate("/")

    const fetchSchoolDetails = async () => {
      try {
        const response = await fetchWithToken(
          `${domainName}/schools/mySchoolDetails`,
        )
        if (response.status === 200) {
          const schoolData = await response.json()
          setSchoolInfo(schoolData)
        } else return
      } catch (error) {
        console.log(error)
      }
    }
    fetchSchoolDetails()
  }, [dummyState])

  const reRenderThis = () => {
    setDummyState((prev) => prev + 1)
  }

  return (
    <div
      key={dummyState}
      className="centering-wrapper"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      {schoolInfo === null ? (
        <NoSchoolComponent reRenderRoot={reRenderThis} />
      ) : (
        <SchoolManagement
          schoolInfo={schoolInfo}
          reRenderRoot={reRenderThis}
          setSchoolInfo={setSchoolInfo}
        />
      )}
    </div>
  )
}
