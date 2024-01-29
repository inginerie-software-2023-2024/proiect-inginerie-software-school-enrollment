import { teacherStudentsReducer } from './reducers/students';
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import { combineReducers } from "redux"
import { userReducer } from "./reducers"
import { schoolReducer, schoolsReducer } from "./reducers/schools"
import { allUsersReducer } from "./reducers/allUsers"

const reducer = combineReducers({
  user: userReducer,
  school: schoolReducer,
  schools: schoolsReducer,
  allUsers: allUsersReducer,
  teacherStudents: teacherStudentsReducer,
})

export const store = configureStore({
  reducer,
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
