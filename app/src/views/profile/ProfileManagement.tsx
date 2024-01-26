import React from "react"
import UpdateProfileData from "./UpdateProfileData"
import DeleteProfile from "./DeleteProfile"
import { Card } from "@mui/material"

export default function ProfileManagement() {
  return (
    <div
      className="centering-wrapper"
      style={{ margin: "2em 0 2em 0", gap: "2em" }}
    >
      <Card>
        <UpdateProfileData />
        <span style={{ fontWeight: "bold", display: "block", margin: "1em" }}>
          Dupa actualizare va trebui sa va autentificati din nou.
        </span>
      </Card>
      <Card style={{ padding: "1rem", display: "grid", placeItems: "center" }}>
        <span
          style={{
            fontWeight: "bold",
            display: "block",
            margin: "1em",
            color: "red",
          }}
        >
          ATENTIE: Stergerea contului este ireversibila.
        </span>
        <DeleteProfile />
      </Card>
    </div>
  )
}
