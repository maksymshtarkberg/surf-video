import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCapturing: false,
};

const isCapturingSlice = createSlice({
  name: "isCapturing",
  initialState,
  reducers: {
    setIsCapturing(state, action) {
      state.isCapturing = action.payload;
    },
  },
});

export const { setIsCapturing } = isCapturingSlice.actions;
export default isCapturingSlice.reducer;
