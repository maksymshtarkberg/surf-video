import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateProps {
  openCut: boolean;
  isClipDisabled: boolean;
}

const initialState: initialStateProps = {
  openCut: false,
  isClipDisabled: false,
};

const openCutSlice = createSlice({
  name: "openCut",
  initialState,
  reducers: {
    setIsCutOpened(state, action: PayloadAction<boolean>) {
      state.openCut = action.payload;
    },
    setIsClipDisabled(state, action: PayloadAction<boolean>) {
      state.isClipDisabled = action.payload;
    },
  },
});

export const { setIsCutOpened, setIsClipDisabled } = openCutSlice.actions;
export default openCutSlice.reducer;
