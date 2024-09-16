import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import openCutReducer from "./slices/openCutSlice";
import isCapturingSlice from "./slices/isCapturingSlice";
import videoFileReducer from "./slices/videoFileSlice";
import videoSlice from "./slices/videoSlice";

const makeStore = () =>
  configureStore({
    reducer: {
      openCut: openCutReducer,
      isCapturing: isCapturingSlice,
      videoFile: videoFileReducer,
      video: videoSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper(makeStore);
