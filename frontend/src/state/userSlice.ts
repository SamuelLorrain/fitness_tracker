import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { jwtDecode } from "jwt-decode";

export interface UserState {
  email: String,
  token: String | null
  isLogged: Boolean
}

const initialState: UserState = {
  email: '',
  token: null,
  isLogged: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    initUser: (state, action) => {
      const decoded = jwtDecode(action.payload.access_token);
      state.email = decoded.name;
      state.token = action.payload.access_token;
      state.isLogged = true;
    },
  },
})

export const { initUser } = userSlice.actions;
export default userSlice.reducer;
