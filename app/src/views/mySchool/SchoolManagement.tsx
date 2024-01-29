import React from "react"
import { SchoolData } from "../../interfaces/SchoolData"
import UpdateSchoolForm from "./UpdateSchoolForm"
import InviteTeachers from "./InviteTeachers"
import "./style.css"
import TeachersTable from "./TeachersTable"
import ClassesTable from "./ClassesTable"

export default function SchoolManagement({
  schoolInfo,
  reRenderRoot,
  setSchoolInfo,
  teachersData,
  classesData,
}: {
  schoolInfo: SchoolData
  reRenderRoot: () => void
  setSchoolInfo: (schoolInfo: SchoolData) => void
  teachersData: Array<any>
  classesData: Array<any>
}) {
  return (
    <div
      className="centering-wrapper"
      style={{
        width: "100vw",
        gap: "5em",
        marginBottom: "2em",
      }}
    >
      <UpdateSchoolForm
        initialSchoolInfo={schoolInfo}
        setSchoolInfo={setSchoolInfo}
      />
      <TeachersTable teachersData={teachersData} reRenderRoot={reRenderRoot} />
      <ClassesTable
        classesData={classesData}
        reRenderRoot={reRenderRoot}
        teachersData={teachersData}
      />
    </div>
  )
}
