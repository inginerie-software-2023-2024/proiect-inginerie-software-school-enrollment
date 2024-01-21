import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const LogOut = () => {
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("role")
    navigate("/")
  })

  return null
}

export default LogOut
