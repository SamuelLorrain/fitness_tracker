import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

type UserState = {
    isLogged: Boolean,
    email: String | null,
    token: String | null
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLogged: false,
    email: '',
    token: null
  } as UserState,
  reducers: {
    setUserFromJwt: (state, action) => {
      const decoded = jwtDecode(action.payload.access_token);
      state.isLogged = true;
      state.email = decoded.name;
      state.token = action.payload.token;
    },
  }
})

export const { setUserFromJwt } = userSlice.actions
export default userSlice.reducer
