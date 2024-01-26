import React from "react"
import UpdateProfileData from "./UpdateProfileData"
import DeleteProfile from "./DeleteProfile"
import { Card } from "@mui/material"

export default function ProfileManagement() {
  return (
    <div className="two-columns" style={{ margin: "2em 0 2em 0" }}>
      <Card>
        <UpdateProfileData />
        <span style={{ fontWeight: "bold", display: "block", margin: "1em" }}>
          Dupa actualizare va trebui sa va autentificati din nou.
        </span>
      </Card>
      <Card style={{ padding: "1rem" }}>
        <DeleteProfile />
      </Card>
    </div>
  )
}
