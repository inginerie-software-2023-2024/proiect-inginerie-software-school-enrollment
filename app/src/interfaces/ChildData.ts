import { ClassData } from "./ClassData"
import { SchoolData } from "./SchoolData"

export interface ChildData {
  cnp: string
  firstName: string
  lastName: string
  age: number
  id: number
  school: SchoolData
  class: ClassData
}
