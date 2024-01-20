import { SchoolRequestStatus } from "../types/SchoolRequestStatus";
import { ChildData } from "./ChildData"
import { SchoolData } from "./SchoolData";

export interface SchoolRequestData {
  id: number,
  student: ChildData,
  grade: number,
  school: SchoolData,
  status: SchoolRequestStatus
}