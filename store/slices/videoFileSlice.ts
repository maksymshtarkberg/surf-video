import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VideoFileState {
  videoFile: File | null;
  trimmedVideoBlob: Blob | null;
  dowloadUrl: string;
  isFileReady: boolean;
  isProcessing: boolean;
  videoSrc: string;
  isLoadingCut: boolean;
  progressLoadingFile: number;
}

const initialState: VideoFileState = {
  videoFile: null,
  trimmedVideoBlob: null,
  dowloadUrl: "",
  isFileReady: false,
  isProcessing: false,
  videoSrc:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  isLoadingCut: false,
  progressLoadingFile: 0,
};

const videoFileSlice = createSlice({
  name: "videoFile",
  initialState,
  reducers: {
    setVideoFile(state, action: PayloadAction<File | null>) {
      state.videoFile = action.payload;
    },
    setTrimmedVideoBlob(state, action: PayloadAction<Blob | null>) {
      state.trimmedVideoBlob = action.payload;
    },
    setFileReady(state, action: PayloadAction<boolean>) {
      state.isFileReady = action.payload;
    },
    setIsProcessing(state, action: PayloadAction<boolean>) {
      state.isProcessing = action.payload;
    },
    setVideoSrc(state, action: PayloadAction<string>) {
      state.videoSrc = action.payload;
    },
    setDownloadUrl(state, action: PayloadAction<string>) {
      state.dowloadUrl = action.payload;
    },
    setIsLoadingCut(state, action: PayloadAction<boolean>) {
      state.isLoadingCut = action.payload;
    },
    setProgressLoadingFile(state, action: PayloadAction<number>) {
      state.progressLoadingFile = action.payload;
    },
  },
});

export const {
  setVideoFile,
  setFileReady,
  setIsProcessing,
  setVideoSrc,
  setIsLoadingCut,
  setTrimmedVideoBlob,
  setDownloadUrl,
  setProgressLoadingFile,
} = videoFileSlice.actions;
export default videoFileSlice.reducer;
