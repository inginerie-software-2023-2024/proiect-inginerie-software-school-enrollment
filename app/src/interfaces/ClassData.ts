import { ChildData } from "./ChildData"
import { SchoolData } from "./SchoolData"
import { UserData } from "./UserData"

export interface ClassData {
  id: number
  name: string
  maxNumberOfStudents: number
  teacher: UserData
  school: SchoolData
  students: ChildData[]
}
