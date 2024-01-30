import { createSlice } from "@reduxjs/toolkit"
import { domainName } from "../generalConstants"
import axios from "axios"
import { fetchWithToken } from "../tokenUtils";

const getUserByUsername = async (username: any) => {
  if(!username) return null;
  if(!localStorage.getItem("token")) return {};
  let user: any = {};
  try{
    const { data } = await axios.get(`${domainName}/users/${username}`, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
        mode: "cors",
      },
    })
    user = data;
  } catch (e) {
    console.log("getUserByUsername error: ", e);
    user = {};
  }
  // const response = await fetchWithToken(
  //   domainName + `/users/${username}`,
  // )
  // const rawData = await response.json();

  console.log("initState getUserByUsername response: ", user)
  return user
}

const initialState = await getUserByUsername(localStorage.getItem("username"));

const userSlice = createSlice({
  name: "user",
  // initialState: {
  //   value: null,
  // },
  initialState,
  reducers: {
    login: (state, action) => {
      return {
        ...state,
        value: action.payload,
      }
    },
    logout: (state) => {
      return {
        ...state,
        value: null,
      }
    },
  },
})

export const userReducer = userSlice.reducer
export const userActions = userSlice.actions

// Actions

export const { login, logout } = userSlice.actions
