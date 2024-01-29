import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { domainName } from "../../generalConstants"

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

const getAllSchools = async () => {
  const {data} = await axios.get(`${domainName}/schools`)
  console.log('initState getSchools response: ', data)
  return data;
}

// const getAllSchools = createAsyncThunk("schools/getAllSchools", async () => {
//   const { data } = await axios.get(`${domainName}/schools`)
//   console.log("initState getSchools response: ", data)
//   return data
// })

// const initialState = getAllSchools().then((data) => data)

const initialState = await getAllSchools();

const schoolsSlice = createSlice({
  name: "schools",
  // initialState: {
  //   value: getAllSchools().then((data) => data),
  // },
  initialState,
  reducers: {
    setSchools: (state, action) => {
      return {
        ...state,
        schools: action.payload,
      }
    },
    getSchools: (state) => {
      return {
        ...state,
        schools: null,
      }
    },
  },
  // extraReducers(builder) {
  //   builder.addCase(getAllSchools.fulfilled, (state, action) => {
  //     state.value = action.payload
  //   })
  // },
})

export const schoolReducer = schoolSlice.reducer
export const schoolActions = schoolSlice.actions

export const schoolsReducer = schoolsSlice.reducer
export const schoolsActions = schoolsSlice.actions

// Actions

export const { chooseSchool } = schoolSlice.actions
export const { setSchools, getSchools } = schoolsSlice.actions
