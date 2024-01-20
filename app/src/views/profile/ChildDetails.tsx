import React from "react"
import PropTypes from "prop-types"

export default function ChildDetails({
  closeModal,
  reRenderParent,
  childId,
}: {
  closeModal: () => void
  reRenderParent: () => void
  childId: number
}) {
  return (
    <>
      <h1>Detalii despre Copilul {childId}</h1>
    </>
  )
}
