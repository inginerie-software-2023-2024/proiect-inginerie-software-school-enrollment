import React from "react"

export default function Profile() {
  return <div>{localStorage.getItem("username")}</div>
}
