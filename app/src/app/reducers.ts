import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
  name: "user",
  initialState: {
    value: null,
  },
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
