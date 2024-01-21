export const domainName = "http://localhost:8080"
export const romanianNameRegex = /^([A-ZĂÎÂȘȚ]([a-zA-ZăîâșțĂÎÂȘȚ])*([-. ])*)+$/
export const romanianCNPRegex = /^[56][0-9]{12}$/
export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
export const strongPasswordRegex =
  /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/
