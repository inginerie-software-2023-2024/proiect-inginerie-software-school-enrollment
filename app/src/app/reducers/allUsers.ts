import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { domainName } from "../../generalConstants"

const getAllUsers = async () => {
  if(!localStorage.getItem("token")) return [];
  try {
    const { data } = await axios.get(
      `${domainName}/admin/getAllUsersForAdmin`,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          mode: "cors",
        },
      },
    )
    console.log("initState getAllUsers response: ", data)
    return data
  } catch (e) {
    console.log("initState getAllUsers error: ", e)
    return []
  }
}

const initialState = await getAllUsers()

const allUsersSlice = createSlice({
  name: "allUsers",
  initialState,
  reducers: {
    setDirector: (state, action) => {
      return {
        ...state,
        value: action.payload,
      }
    },
    setAllUsers: (state, action) => {
      return [
        ...action.payload,
      ]
    },
  },
})

export const allUsersReducer = allUsersSlice.reducer
export const allUsersActions = allUsersSlice.actions

// Actions

export const { setDirector, setAllUsers } = allUsersSlice.actions
