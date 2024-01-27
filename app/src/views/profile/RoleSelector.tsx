import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Card,
} from "@mui/material"
import React, { useState } from "react"
import Button from "@mui/material/Button"
import { fetchWithToken, getAllUserRoles } from "../../tokenUtils"
import { toTitleCase } from "../../utilityFunctions"
import PropTypes from "prop-types"
import "../../style.css"
import { domainName } from "../../generalConstants"
import { toast } from "sonner"

export default function RoleSelector({
  currentRole,
  roleUpdater,
}: {
  roleUpdater: (role: string) => void
  currentRole: string
}) {
  const [selectedRole, setSelectedRole] = useState(currentRole)

  const allRoles = getAllUserRoles()
  if (allRoles === null) return <></>

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedRole(event.target.value as string)
  }

  const roleMapping: { [key: string]: string } = {
    admin: "administrator",
    principal: "director",
    teacher: "profesor",
    parent: "parinte",
  }

  const handleSubmit = () => {
    if (selectedRole === currentRole) {
      toast.error("Deja aveti acest rol selectat")
      return
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }

    fetchWithToken(
      domainName + `/users/changeRole/${selectedRole}`,
      requestOptions,
    )
      .then((response) => {
        if (response.ok) {
          roleUpdater(selectedRole)
          return response.text()
        } else
          return response.text().then((errorText) => Promise.reject(errorText))
      })
      .then((token: string) => {
        localStorage.setItem("token", token)
        window.location.reload()
      })
      .catch((error) => {
        if (error.message) toast.error(error.message)
        else console.error(error)
      })
  }

  return (
    <Card
      style={{
        width: "fit-content",
        margin: "auto",
        marginTop: "10px",
        padding: "20px",
        display: "grid",
        placeItems: "center",
      }}
    >
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          value={selectedRole}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          {allRoles.map((role, index) =>
            role === currentRole ? (
              <MenuItem disabled key={index} value={role}>
                {toTitleCase(roleMapping[role])}
              </MenuItem>
            ) : (
              <MenuItem key={index} value={role}>
                {toTitleCase(roleMapping[role])}
              </MenuItem>
            ),
          )}
        </Select>
        <FormHelperText>Selectati rolul</FormHelperText>
        <Button
          variant="contained"
          onClick={handleSubmit}
          style={{
            backgroundColor: "var(--main-background-color)",
            color: "#000000",
          }}
        >
          Schimba Rol
        </Button>
      </FormControl>
    </Card>
  )
}

RoleSelector.propTypes = {
  roleUpdater: PropTypes.func.isRequired, // Define roleUpdater as a required function prop
}
