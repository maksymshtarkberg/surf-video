import { useEffect, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import Button from "@ui/Button";
import { fileToUint8Array } from "utils/helpers";
import RangeSlider from "components/RangeSlider/RangeSlider";

let ffmpeg: FFmpeg | null = null;

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  captureSnapshots: (videoDuration: number) => Promise<void>;
  loadSnapshotsFromLocalStorage: () => void;
  removeSnapshotsFromLocalStorage: () => void;
  currentTime: number;
  snapshots: string[];
  isLoadindCut: boolean;
  setIsLoadindCut: React.Dispatch<React.SetStateAction<boolean>>;
};

const VideoTrimmer: React.FC<Props> = ({
  videoRef,
  canvasRef,
  captureSnapshots,
  currentTime,
  snapshots,
  removeSnapshotsFromLocalStorage,
  loadSnapshotsFromLocalStorage,
  isLoadindCut,
  setIsLoadindCut,
}) => {
  const [minTime, setMinTime] = useState<number>(Math.max(0, currentTime - 40));
  const [maxTime, setMaxTime] = useState<number>(currentTime + 40);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [trimmedVideoBlob, setTrimmedVideoBlob] = useState<Blob | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isDownloadStarted, setIsDownloadStarted] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && ffmpeg === null) {
      ffmpeg = new FFmpeg();
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      loadVideoFile();
    }
  }, [!videoFile]);

  const loadVideoFile = async () => {
    console.log("started");
    const videoElement = videoRef.current;
    if (videoElement) {
      const response = await fetch(videoElement.currentSrc);
      const blob = await response.blob();
      const file = new File([blob], "input.mp4", { type: "video/mp4" });
      setVideoFile(file);
      File != null && console.log("finished");
    }
  };

  useEffect(() => {
    setMinTime(Math.max(0, currentTime - 40));
    const videoElement = videoRef.current;
    if (videoElement) {
      setMaxTime(Math.min(currentTime + 40, videoElement.duration));
    }
  }, [videoRef.current, currentTime]);

  const trimVideo = async () => {
    if (!videoFile || !ffmpeg) return;

    setIsProcessing(true);

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
      videoRef.current.src = url;
      videoRef.current.load();
      videoRef.current.onloadeddata = () => {
        captureSnapshots(videoRef.current?.duration || 0);
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
      `${minTime}`, // Начало обрезки
      "-to",
      `${maxTime}`, // Конец обрезки
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
    a.download = "trimmed_video.mp4"; // Название файла
    a.click();

    setIsDownloadStarted(false);
  };

  return (
    <>
      <div className="flex flex-col items-center py-5 px-4">
        <Button
          text="Clip Video"
          onClickHandler={trimVideo}
          disabled={isProcessing || !!downloadUrl}
        />

        <div className="flex space-x-4">
          <Button
            text="Download"
            onClickHandler={handleDownload}
            disabled={isProcessing || !downloadUrl}
          />
        </div>

        {isProcessing && <p>Processing video, please wait...</p>}
      </div>
    </>
  );
};

export default VideoTrimmer;
