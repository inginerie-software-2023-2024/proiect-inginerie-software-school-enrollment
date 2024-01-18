import { createSlice } from "@reduxjs/toolkit"

const schoolSlice = createSlice({
  name: "school",
  initialState: {
    name: null,
  },
  reducers: {
    chooseSchool: (state, action) => {
      return {
        ...state,
        value: action.payload,
      }
    },
  },
})

export const schoolReducer = schoolSlice.reducer
export const schoolActions = schoolSlice.actions

// Actions

export const { chooseSchool } = schoolSlice.actions
