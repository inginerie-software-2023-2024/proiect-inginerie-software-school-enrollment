import React, { useState } from "react"
import RoleSelector from "./RoleSelector"
import { getCurrentUserRole } from "../../tokenUtils"
import { useNavigate } from "react-router-dom"

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
      <div>
        {localStorage.getItem("username")}, you are a {userRole}
      </div>
      <RoleSelector currentRole={userRole} roleUpdater={updateRole} />
    </>
  )
}
