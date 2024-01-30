import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { domainName } from "../../generalConstants"

const getStudentsOfTeacher = async () => {
  if(!localStorage.getItem("token")) return [];
  try {
    const { data } = await axios.get(
      `${domainName}/teacher/getMyClassStudents`,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          mode: "cors",
        },
      },
    )
    console.log("initState getStudentsOfTeacher response: ", data)
    return data
  } catch (e) {
    console.log("initState getStudentsOfTeacher error: ", e)
    return []
  }
}

const initialState = await getStudentsOfTeacher()

const teacherStudentsSlice = createSlice({
  name: "teacherStudents",
  initialState,
  reducers: {
    setStudents: (state, action) => {
      return [
        ...action.payload,
      ]
    },
  },
})

export const teacherStudentsReducer = teacherStudentsSlice.reducer
export const teacherStudentsActions = teacherStudentsSlice.actions

// Actions

export const { setStudents } = teacherStudentsSlice.actions
