import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import { combineReducers } from "redux"
import { userReducer } from "./reducers"

const reducer = combineReducers({
  user: userReducer,
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
