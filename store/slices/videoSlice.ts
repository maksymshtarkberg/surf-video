import { createSlice } from "@reduxjs/toolkit";

interface initialStateProps {
  duration: number;
}

const initialState: initialStateProps = {
  duration: 0,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setDuration(state, action) {
      state.duration = action.payload;
    },
  },
});

export const { setDuration } = videoSlice.actions;
export default videoSlice.reducer;
