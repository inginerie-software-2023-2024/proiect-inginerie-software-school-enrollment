import React, { useEffect } from "react"
import ChildrenList from "./ChildrenList"
import { getCurrentUserRole } from "../../tokenUtils"
import { useNavigate } from "react-router-dom"
import "./style.css"

export default function ChildrenManagement() {
  const navigate = useNavigate()

  useEffect(() => {
    if (
      localStorage.getItem("token") === null ||
      getCurrentUserRole() !== "parent"
    )
      navigate("/")
  }, [])

  return (
    <div
      className="centering-wrapper"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <ChildrenList
        tableStyle={{
          maxHeight: "300px",
          overflowY: "scroll",
        }}
      />
    </div>
  )
}
