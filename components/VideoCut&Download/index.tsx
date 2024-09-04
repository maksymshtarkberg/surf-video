import { FC, useRef, useState } from "react";

type Props = {};

const VideoCutAndDownload: FC<Props> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const seekTime = (Number(event.target.value) / 100) * duration;
      videoRef.current.currentTime = seekTime;
      setProgress(Number(event.target.value));
    }
  };

  const handlePlay = () => {
    videoRef.current?.play();
  };

  const handlePause = () => {
    videoRef.current?.pause();
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const handlePictureInPicture = () => {
    if (videoRef.current) {
      videoRef.current.requestPictureInPicture();
    }
  };

  return (
    <div ref={containerRef} className="relative w-1/2 h-full">
      <video
        ref={videoRef}
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        controls={false}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        style={{ width: "100%", height: "auto" }}
      ></video>

      {/* Custom Timeline */}
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleSeek}
        className="w-full mt-4"
      />

      <div className="mt-4 flex gap-4">
        <button
          onClick={handlePlay}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Play
        </button>
        <button
          onClick={handlePause}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Pause
        </button>
        <button
          onClick={handleFullscreen}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Fullscreen
        </button>
        <button
          onClick={handlePictureInPicture}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Picture in Picture
        </button>
      </div>
    </div>
  );
};

export default VideoCutAndDownload;
