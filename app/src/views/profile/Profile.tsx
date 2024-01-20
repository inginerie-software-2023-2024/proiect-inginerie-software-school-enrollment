import React, { useEffect, useState } from "react"
import RoleSelector from "./RoleSelector"
import { getCurrentUserRole } from "../../tokenUtils"
import { useNavigate } from "react-router-dom"
import { Card } from "@mui/material"
import "./style.css"
import ChildrenList from "./ChildrenList"

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
      <Card className="role-display" style={{ margin: "1em" }}>
        {localStorage.getItem("username")}, rolul dvs. selectat este{" "}
        {roleMapping[userRole!]}
        <RoleSelector currentRole={userRole!} roleUpdater={updateRole} />
      </Card>

      {userRole === "parent" ? (
        <ChildrenList
          tableStyle={{
            maxHeight: "300px",
            overflowY: "scroll",
          }}
        />
      ) : null}
    </>
  )
}
