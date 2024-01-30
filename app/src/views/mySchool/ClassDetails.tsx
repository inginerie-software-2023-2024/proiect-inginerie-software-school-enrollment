import React from "react"
import EditClassDetails from "./EditClassDetails"
import ChangeTeacher from "./ChangeTeacher"
import ClassStudentsTable from "./ClassStudentsTable"

export default function ClassDetails({
  selectedClassInfo,
  teachersData,
  reRenderRoot,
}: {
  selectedClassInfo: any
  teachersData: Array<any>
  reRenderRoot: () => void
}) {
  return (
    <div className="two-columns-child-details">
      <div className="centering-wrapper" style={{ gap: "1em" }}>
        <EditClassDetails
          classDetails={selectedClassInfo}
          reRenderRoot={reRenderRoot}
        />
        <ChangeTeacher
          currentTeacherId={selectedClassInfo.teacherId}
          reRenderRoot={reRenderRoot}
          teachersData={teachersData}
          classId={selectedClassInfo.id}
        />
      </div>
      <ClassStudentsTable
        reRenderRoot={reRenderRoot}
        classData={selectedClassInfo}
      />
    </div>
  )
}
