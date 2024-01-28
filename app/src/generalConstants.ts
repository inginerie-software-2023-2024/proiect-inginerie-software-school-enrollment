export const domainName = "http://localhost:8080"
export const romanianNameRegex = /^([A-ZĂÎÂȘȚ]([a-zA-ZăîâșțĂÎÂȘȚ])*([-. ])*)+$/
export const romanianCNPRegex = /^[56][0-9]{12}$/
export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
export const moreCharactersClassNameRegex = /^[0-8][ \-a-zA-Z][ \-a-zA-Z0-9]*$/
export const oneCharacterClassNameRegex = /^[0-8]$/
export const strongPasswordRegex =
  /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/
