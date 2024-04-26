import { configureStore } from '@reduxjs/toolkit';
import userReducer from "../features/user/userSlice";
import { api } from './services/api';


export default configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
