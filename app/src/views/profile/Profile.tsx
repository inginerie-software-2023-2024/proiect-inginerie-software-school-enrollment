import React, { useState } from "react"
import RoleSelector from "./RoleSelector"
import { getCurrentUserRole } from "../../tokenUtils"
import { useNavigate } from "react-router-dom"
import { Card } from "@mui/material"

export default function Profile() {
  const currentRole = getCurrentUserRole()
  const navigate = useNavigate()
  if (currentRole === null) {
    navigate("/login")
  }
  const [userRole, setUserRole] = useState(currentRole)

  const updateRole = (role: string) => {
    setUserRole(role)
  }

  return (
    <>
      <Card
        style={{
          display: "grid",
          placeItems: "center",
          padding: "1rem",
          fontSize: "1.5rem",
          fontWeight: "bold",
          
        }}
      >
        {localStorage.getItem("username")}, you are a {userRole}
      </Card>
      <RoleSelector currentRole={userRole} roleUpdater={updateRole} />
    </>
  )
}
