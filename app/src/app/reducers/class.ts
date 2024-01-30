import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { domainName } from "../../generalConstants"

const getClassOfTeacher = async () => {
  if(!localStorage.getItem("token")) return [];
  try {
    const { data } = await axios.get(
      `${domainName}/teacher/getMyClassDetails`,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          mode: "cors",
        },
      },
    )
    console.log("initState getClassOfTeacher response: ", data)
    return data
  } catch (e) {
    console.log("initState getClassOfTeacher error: ", e)
    return []
  }
}

const initialState = await getClassOfTeacher()

const teacherClassSlice = createSlice({
  name: "teacherClass",
  initialState,
  reducers: {
    setClass: (state, action) => {
      return {
        ...action.payload,
      }
    },
  },
})

export const teacherClassReducer = teacherClassSlice.reducer
export const teacherClassActions = teacherClassSlice.actions

// Actions

export const { setClass } = teacherClassSlice.actions
