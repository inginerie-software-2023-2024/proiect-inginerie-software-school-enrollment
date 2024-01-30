import { localHosted } from "./hostingConfig"
export const domainName = localHosted
  ? "http://localhost:8080"
  : "http://catag.go.ro:8080"
export const webAppDomainName = localHosted
  ? "http://localhost:5173"
  : "http://catag.go.ro"
export const romanianNameRegex = /^([A-ZĂÎÂȘȚ]([a-zA-ZăîâșțĂÎÂȘȚ])*([-. ])*)+$/
export const romanianCNPRegex = /^[56][0-9]{12}$/
export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
export const moreCharactersClassNameRegex = /^[0-8][ \-a-zA-Z][ \-a-zA-Z0-9]*$/
export const oneCharacterClassNameRegex = /^[0-8]$/
export const strongPasswordRegex =
  /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/
