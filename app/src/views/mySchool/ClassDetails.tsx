import React from "react"
import EditClassDetails from "./EditClassDetails"

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
      <EditClassDetails
        classDetails={selectedClassInfo}
        reRenderRoot={reRenderRoot}
      />
    </div>
  )
}
