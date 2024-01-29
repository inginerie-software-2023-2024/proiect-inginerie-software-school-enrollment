import React, { useEffect, useState } from "react"
import { fetchWithToken, getCurrentUserRole } from "../../tokenUtils"
import { useNavigate } from "react-router-dom"
import { SchoolData } from "../../interfaces/SchoolData"
import { domainName } from "../../generalConstants"
import NoSchoolComponent from "./NoSchoolComponent"
import SchoolManagement from "./SchoolManagement"
import "./style.css"

export default function MySchool() {
  const navigate = useNavigate()
  const [schoolInfo, setSchoolInfo] = useState<SchoolData | null>(null)
  const [dummyState, setDummyState] = useState(0)
  const [teachersData, setTeachersData] = useState<Array<any>>([])
  const [classesData, setClassesData] = useState<Array<any>>([])

  useEffect(() => {
    // check if the user is logged in and is a principal
    if (
      localStorage.getItem("token") === null ||
      getCurrentUserRole() !== "principal"
    )
      navigate("/")
  }, [])

  useEffect(() => {
    // fetch for the teachers of the school
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
  }, [dummyState])

  useEffect(() => {
    // fetch for the classes of the school
    const fetchClassesData = async () => {
      try {
        const response = await fetchWithToken(
          `${domainName}/schools/getClasses`,
        )
        if (response.status === 200) {
          const rawData = await response.json()
          rawData.sort((a: any, b: any) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
            return a.maxNumberOfStudents - b.maxNumberOfStudents
          })
          const processedData = rawData.map((classData: any) => {
            return {
              ...classData,
              teacherId: classData.teacher !== null ? classData.teacher.id : 0,
              teacher:
                classData.teacher !== null
                  ? `${classData.teacher.firstName} ${classData.teacher.lastName} (${classData.teacher.username})`
                  : "N/A",
              numberOfStudents: classData.students.length,
            }
          })
          setClassesData(processedData)
        } else {
          console.log("Error fetching classes data: ", response)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchClassesData()
  }, [dummyState])

  useEffect(() => {
    // fetch for the school basic data (name, description)
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
        margin: "0 0 2em 0",
      }}
    >
      <h1
        style={{
          fontWeight: "bold",
          display: "block",
          margin: "0.5em 0 1em 0",
        }}
      >
        Scoala Mea
      </h1>
      {schoolInfo === null ? (
        <NoSchoolComponent reRenderRoot={reRenderThis} />
      ) : (
        <SchoolManagement
          reRenderRoot={reRenderThis}
          schoolInfo={schoolInfo}
          setSchoolInfo={setSchoolInfo}
          teachersData={teachersData}
          classesData={classesData}
        />
      )}
    </div>
  )
}
