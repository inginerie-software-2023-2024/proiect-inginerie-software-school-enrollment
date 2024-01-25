import React, { useEffect, useState } from "react"
import RoleSelector from "./RoleSelector"
import { getCurrentUserRole } from "../../tokenUtils"
import { useNavigate } from "react-router-dom"
import { Card } from "@mui/material"
import "./style.css"
import ChildrenList from "./ChildrenList"
import ProfileManagement from "./ProfileManagement"

export default function Profile() {
  const currentRole = getCurrentUserRole()
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState(currentRole)

  const updateRole = (role: string) => {
    setUserRole(role)
  }

  useEffect(() => {
    if (currentRole === null) {
      navigate("/log-in")
    }
  }, [])

  const roleMapping: { [key: string]: string } = {
    admin: "Administrator",
    teacher: "Profesor",
    parent: "Parinte",
    principal: "Director",
  }

  return (
    <>
      <Card
        style={{
          margin: "1em",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <div className="role-display">
          {localStorage.getItem("username")}, rolul dvs. selectat este{" "}
          {roleMapping[userRole!]}
          <RoleSelector currentRole={userRole!} roleUpdater={updateRole} />
        </div>
        <ProfileManagement />
      </Card>
      <RoleSelector currentRole={userRole!} roleUpdater={updateRole} />
      {userRole === "parent" ? <ChildrenList /> : null}
    </>
  )
}
