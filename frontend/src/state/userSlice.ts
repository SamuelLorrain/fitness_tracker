import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { getUnixTime } from "date-fns";

export interface UserState {
  email: String;
  token: String | null;
  isLogged: Boolean;
  currentTimestamp: number; // Date is not serializable, so we store timestamp instead
  first_name: String | null;
  last_name: String | null;
  // TODO real type
  nutrition_goals_per_day: Any;
  notification_enabled: boolean;
  notification_delta_hours: number | null;
  push_notification_token: Any;
}

const initialState: UserState = {
  email: "",
  token: null,
  isLogged: false,
  currentTimestamp: getUnixTime(new Date()), // TODO should be UTC (see date-fns-tz)
  notification_enabled: false,
  notification_delta_hours: null,
  push_notification_token: null,
};

export const userSlice = createSlice({
  name: "user",
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
      if (action.payload.nutrition_goals_per_day) {
        state.nutrition_goals_per_day = action.payload.nutrition_goals_per_day;
      }
      state.notification_enabled = action.payload.notification_enabled;
      state.notification_delta_hours = action.payload.notification_delta_hours;
    },
    setTimestamp: (state, action) => {
      state.currentTimestamp = action.payload.timestamp;
    },
    setToken: (state, action) => {
      state.push_notification_token = action.payload.token;
    },
  },
});

export const { initUser, setUserInfos, setTimestamp, setToken } =
  userSlice.actions;
export default userSlice.reducer;
