import { useEffect, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import Button from "@ui/Button";
import { fileToUint8Array } from "utils/helpers";
import RangeSlider from "components/RangeSlider/RangeSlider";

let ffmpeg: FFmpeg | null = null;

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
  captureSnapshots: (videoDuration: number) => Promise<void>;
  isLoadindCut: boolean;
  setIsLoadindCut: (newDuration: boolean) => void;
  minTime: number;
  maxTime: number;
  handleSetDuration: (newDuration: number) => void;
};

const VideoTrimmer: React.FC<Props> = ({
  videoRef,
  captureSnapshots,
  isLoadindCut,
  setIsLoadindCut,
  minTime,
  maxTime,
  handleSetDuration,
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [trimmedVideoBlob, setTrimmedVideoBlob] = useState<Blob | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isDownloadStarted, setIsDownloadStarted] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [fileReady, setFileReady] = useState<boolean>(false);
  const [isClipDisabled, setIsClipDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && ffmpeg === null) {
      ffmpeg = new FFmpeg();
    }
  }, []);

  useEffect(() => {
    if (videoRef.current && !videoFile) {
      loadVideoFile();
    }
  }, [!videoFile]);

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
          setProgress(percentComplete);
          // console.log(`Progress: ${percentComplete}%`);
        }

        const blob = new Blob(chunks, { type: "video/mp4" });
        const file = new File([blob], "input.mp4", { type: "video/mp4" });
        setVideoFile(file);
        setFileReady(true);
        // console.log("finished");
      }
    }
  };

  const trimVideo = async () => {
    if (!videoFile || !ffmpeg) return;

    setIsProcessing(true);
    setIsClipDisabled(true);

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

    setTrimmedVideoBlob(trimmedBlob);

    const url = URL.createObjectURL(trimmedBlob);
    setDownloadUrl(url);

    if (isDownloadStarted) {
      return;
    }

    if (videoRef.current && !isDownloadStarted) {
      const videoElement = videoRef.current;
      videoElement.src = url;
      videoElement.load();

      videoElement.onloadeddata = async () => {
        if (videoElement.src === url) {
          captureSnapshots(videoElement.duration || 0);
        }
      };
    }
    setIsProcessing(false);
    setIsLoadindCut(!isLoadindCut);
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
      <div className="flex items-center py-5 px-4 justify-between gap-5">
        <div className="flex space-x-4">
          <Button
            text="Select and Preview"
            onClickHandler={trimVideo}
            disabled={isProcessing || !fileReady || isClipDisabled}
            classTlw="whitespace-nowrap"
          />
        </div>

        <div className="flex space-x-4">
          <Button
            text="Download"
            onClickHandler={handleDownload}
            disabled={!downloadUrl}
          />
        </div>
      </div>
      <div className="text-center">
        {isProcessing && (
          <p className="text-white">Processing video, please wait...</p>
        )}

        {!fileReady && (
          <>
            <span className="loading loading-ring loading-lg"></span>
            <p className="text-white">Preparing video for cut: {progress}%</p>
          </>
        )}

        {fileReady && (
          <p className="text-white">
            File ready for {isClipDisabled ? "download" : "cut"}
          </p>
        )}
      </div>
    </>
  );
};

export default VideoTrimmer;
