import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { jwtDecode } from "jwt-decode";
import { getUnixTime } from "date-fns";

export interface UserState {
  email: String;
  token: String | null;
  isLogged: Boolean;
  currentTimestamp: number; // Date is not serializable, so we store timestamp instead
}

const initialState: UserState = {
  email: '',
  token: null,
  isLogged: false,
  currentTimestamp: getUnixTime(new Date())
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
    setTimestamp: (state, action) => {
      state.currentTimestamp = action.payload.timestamp;
    }
  },
})

export const { initUser, setTimestamp } = userSlice.actions;
export default userSlice.reducer;
