import React from "react"
import { SchoolData } from "../../interfaces/SchoolData"
import UpdateSchoolForm from "./UpdateSchoolForm"
import InviteTeachers from "./InviteTeachers"
import "./style.css"

export default function SchoolManagement({
  schoolInfo,
  reRenderRoot,
  setSchoolInfo,
}: {
  schoolInfo: SchoolData
  reRenderRoot: () => void
  setSchoolInfo: (schoolInfo: SchoolData) => void
}) {
  return (
    <div
      className="centering-wrapper"
      style={{
        width: "100vw",
        height: "auto",
      }}
    >
      <div className="two-columns">
        <UpdateSchoolForm
          initialSchoolInfo={schoolInfo}
          setSchoolInfo={setSchoolInfo}
        />
        <InviteTeachers />
      </div>
    </div>
  )
}
