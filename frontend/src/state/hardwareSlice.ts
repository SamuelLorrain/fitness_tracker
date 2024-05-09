import { createSlice } from "@reduxjs/toolkit";
import { Html5Qrcode } from "html5-qrcode";

export interface HardwareState {
  hasCameraPermission: boolean;
  cameras: {
    id: str;
    label: str;
  }[];
}

const initialState: HardwareState = {
  hasCameraPermission: false,
  cameras: [],
};

export const hardwareSlice = createSlice({
  name: "hardware",
  initialState,
  reducers: {
    initCameras: (state, action) => {
      state.hasCameraPermission = true;
      state.cameras = action.payload;
    },
  },
});

export const { initCameras } = hardwareSlice.actions;
export default hardwareSlice.reducer;
