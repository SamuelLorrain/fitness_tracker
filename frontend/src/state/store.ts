import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./userSlice";
import hardwareReducer from "./hardwareSlice";
import { api } from "./api"

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: userReducer,
    hardware: hardwareReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
