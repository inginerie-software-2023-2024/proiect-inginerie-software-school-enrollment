export function fetchWithToken(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No token found")

  const headers = {
    ...options.headers,
    Authorization: token,
  }
  options = { ...options, headers }

  return fetch(url, options)
}

export function decodeJWTToken(token: string) {
  const payload = token.split(".")[1]
  const payloadDecoded = JSON.parse(atob(payload))
  return payloadDecoded
}

export function getAllUserRoles() {
  const token = localStorage.getItem("token")
  if (!token) return null
  const payloadDecoded = decodeJWTToken(token)
  const roles = {
    admin: payloadDecoded["admin"] as boolean,
    parent: payloadDecoded["parent"] as boolean,
    teacher: payloadDecoded["teacher"] as boolean,
    principal: payloadDecoded["principal"] as boolean,
  }
  const returnRoles: string[] = []
  for (const role in roles)
    if (roles[role as keyof typeof roles]) returnRoles.push(role)
  return returnRoles
}

export function getCurrentUserRole() {
  const token = localStorage.getItem("token")
  if (!token) return null
  const payloadDecoded = decodeJWTToken(token)
  return payloadDecoded["currentRole"]
}
