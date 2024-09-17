import { useEffect, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import Button from "@ui/Button";
import { fileToUint8Array } from "utils/helpers";
import RangeSlider from "components/RangeSlider/RangeSlider";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { setIsCapturing } from "store/slices/isCapturingSlice";
import {
  setDownloadUrl,
  setFileReady,
  setIsLoadingCut,
  setIsProcessing,
  setProgressLoadingFile,
  setTrimmedVideoBlob,
  setVideoFile,
  setVideoSrc,
} from "store/slices/videoFileSlice";
import { setDuration } from "store/slices/videoSlice";
import { setIsClipDisabled } from "store/slices/openCutSlice";

let ffmpeg: FFmpeg | null = null;

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
  minTime: number;
  maxTime: number;
};

const VideoTrimmer: React.FC<Props> = ({ videoRef, minTime, maxTime }) => {
  const [isDownloadStarted, setIsDownloadStarted] = useState<boolean>(false);

  const videoFile = useAppSelector((state) => state.videoFile.videoFile);
  const progress = useAppSelector(
    (state) => state.videoFile.progressLoadingFile
  );
  const isFileReady = useAppSelector((state) => state.videoFile.isFileReady);
  const isProcessing = useAppSelector((state) => state.videoFile.isProcessing);
  const isLoadingCut = useAppSelector((state) => state.videoFile.isLoadingCut);

  const trimmedVideoBlob = useAppSelector(
    (state) => state.videoFile.trimmedVideoBlob
  );
  const downloadUrl = useAppSelector((state) => state.videoFile.dowloadUrl);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof window !== "undefined" && ffmpeg === null) {
      ffmpeg = new FFmpeg();
    }
  }, []);

  useEffect(() => {
    if (videoRef.current && !videoFile) {
      loadVideoFile();
    }
  }, []);

  const loadVideoFile = async () => {
    console.log("started");
    const videoElement = videoRef.current;
    if (videoElement) {
      const response = await fetch(videoElement.currentSrc);
      const contentLength = response.headers.get("content-length");

      if (!contentLength) {
        console.error("Unable to determine file size");
        return;
      }

      const total = parseInt(contentLength, 10);
      let loaded = 0;

      const reader = response.body?.getReader();
      const chunks = [];

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          loaded += value.length;

          const percentComplete = Math.round((loaded / total) * 100);
          dispatch(setProgressLoadingFile(percentComplete));
          // console.log(`Progress: ${percentComplete}%`);
        }

        const blob = new Blob(chunks, { type: "video/mp4" });
        const file = new File([blob], "input.mp4", { type: "video/mp4" });
        dispatch(setVideoFile(file));
        dispatch(setFileReady(true));
        // console.log("finished");
      }
    }
  };

  const trimVideo = async () => {
    if (!videoFile || !ffmpeg) return;

    dispatch(setIsProcessing(true));
    dispatch(setIsClipDisabled(true));

    if (!ffmpeg.loaded) {
      await ffmpeg.load();
    }

    const videoElement = videoRef.current;
    if (!videoElement) return;

    const currentTime = videoElement.currentTime;
    const minTimeForCutMode = Math.max(0, currentTime - 40);
    const maxTimeForCutMode = Math.min(currentTime + 40, videoElement.duration);

    const videoData = await fileToUint8Array(videoFile);
    await ffmpeg.writeFile("input.mp4", videoData);
    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-ss",
      `${minTimeForCutMode}`,
      "-to",
      `${maxTimeForCutMode}`,
      "-c",
      "copy",
      "output.mp4",
    ]);

    const data = await ffmpeg.readFile("output.mp4");
    const trimmedBlob = new Blob([data], { type: "video/mp4" });

    dispatch(setTrimmedVideoBlob(trimmedBlob));

    const url = URL.createObjectURL(trimmedBlob);
    dispatch(setDownloadUrl(url));

    dispatch(setVideoSrc(url));

    dispatch(setIsProcessing(false));
    dispatch(setIsLoadingCut(!isLoadingCut));
  };

  const handleDownload = async () => {
    setIsDownloadStarted(true);

    const fileToTrim = trimmedVideoBlob || videoFile;

    if (!fileToTrim || !ffmpeg) {
      console.error("No video available for trimming.");
      setIsDownloadStarted(false);
      return;
    }

    if (!ffmpeg.loaded) {
      await ffmpeg.load();
    }

    const videoData = await fileToUint8Array(fileToTrim);
    await ffmpeg.writeFile("input.mp4", videoData);
    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-ss",
      `${minTime}`,
      "-to",
      `${maxTime}`,
      "-c",
      "copy",
      "output.mp4",
    ]);

    const data = await ffmpeg.readFile("output.mp4");
    const downloadUrl = URL.createObjectURL(
      new Blob([data], { type: "video/mp4" })
    );

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "trimmed_video.mp4";
    a.click();

    setIsDownloadStarted(false);
  };

  return (
    <>
      <div className="flex items-center py-5 justify-between ">
        <div className="flex space-x-4">
          <Button
            text="Select and Cut"
            onClickHandler={trimVideo}
            disabled={isProcessing || !isFileReady || !!downloadUrl}
            classTlw="whitespace-nowrap"
          />
        </div>
        <div className="text-center">
          {isProcessing && (
            <p className="text-white">Processing video, please wait...</p>
          )}

          {!isFileReady && (
            <>
              <span className="loading loading-ring loading-lg"></span>
              <p className="text-white">Preparing video for cut: {progress}%</p>
            </>
          )}

          {isFileReady && (
            <p className="text-white">
              File ready for {downloadUrl ? "download" : "cut"}
            </p>
          )}
        </div>
        <div className="flex space-x-4">
          <Button
            text="Download"
            onClickHandler={handleDownload}
            disabled={!downloadUrl}
          />
        </div>
      </div>
    </>
  );
};

export default VideoTrimmer;
