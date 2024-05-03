import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { jwtDecode } from "jwt-decode";
import { getUnixTime } from "date-fns";

export interface UserState {
  email: String;
  token: String | null;
  isLogged: Boolean;
  currentTimestamp: number; // Date is not serializable, so we store timestamp instead
  first_name: String | null;
  last_name: String | null;
  nutrition_goals: Any;
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
    setUserInfos: (state, action) => {
      state.first_name = action.payload.first_name;
      state.last_name = action.payload.last_name;
      state.nutrition_goals = action.payload.nutrition_goals;
    },
    setTimestamp: (state, action) => {
      state.currentTimestamp = action.payload.timestamp;
    }
  },
})

export const { initUser, setUserInfos, setTimestamp } = userSlice.actions;
export default userSlice.reducer;
