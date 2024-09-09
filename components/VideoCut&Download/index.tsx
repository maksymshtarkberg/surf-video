import PreLoader from "components/PreLoader/PreLoader";
import React, { useRef, useState, useEffect } from "react";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  captureSnapshots: (videoDuration: number) => Promise<void>;
  loadSnapshotsFromLocalStorage: () => void;
  snapshots: string[];
};

const VideoTrimmer: React.FC<Props> = ({
  videoRef,
  canvasRef,
  captureSnapshots,
  loadSnapshotsFromLocalStorage,
  snapshots,
}) => {
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const removeSnapshotsFromLocalStorage = () => {
    localStorage.removeItem("snapshots");
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleLoadedMetadata = () => {
        const videoDuration = videoElement.duration;
        setDuration(videoDuration);
        if (snapshots.length === 0) {
          captureSnapshots(videoDuration);
        }
      };

      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        videoElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      };
    }
  }, [snapshots]);

  useEffect(() => {
    loadSnapshotsFromLocalStorage();
    removeSnapshotsFromLocalStorage();
    if (snapshots.length === 0) {
      const videoElement = videoRef.current;
      if (videoElement) {
        captureSnapshots(videoElement.duration);
      }
    }
  }, [snapshots]);

  const handleSliderInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleTimeUpdate = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      setCurrentTime(videoElement.currentTime);
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, []);

  const currentIndex = Math.floor((currentTime / duration) * snapshots.length);
  const numDivisions = Math.ceil(duration / 20);
  const numMinuteMarkers = Math.floor(duration / 60);

  return (
    <>
      <div className="flex flex-col items-center py-5 px-4 sm:px-6 md:px-8 lg:px-10 ">
        <video
          ref={videoRef}
          onError={() => console.error("Error loading video")}
          controls
          crossOrigin="anonymous"
          className="w-full max-w-4xl"
        >
          <source
            src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            type="video/mp4"
          />
        </video>

        <div className="relative w-full mt-4">
          <h2 className="text-base font-bold leading-4 text-white my-4">
            Find clips
          </h2>

          <div className="relative p-x-2 py-4 m-6 bg-gray-800 rounded-lg">
            <div className="flex flex-wrap items-center justify-between">
              {snapshots.map((snapshot, index) => (
                <img
                  key={index}
                  src={snapshot}
                  alt={`Snapshot at minute ${index}`}
                  className={`transition-opacity duration-300 border-2 rounded-sm ${
                    index === currentIndex ? "opacity-100" : "opacity-30"
                  } w-[10%] h-20 object-cover`}
                />
              ))}
            </div>
            {/* Input slider */}
            <input
              type="range"
              min="0"
              max={duration}
              step="0.1"
              value={currentTime}
              onInput={handleSliderInput}
              className="absolute w-[95%] h-full left-6 bottom-0 z-40 bg-transparent opacity-0"
            />
            <div
              className="absolute top-0 h-full w-1 bg-gray-300"
              style={{
                left: `${(currentTime / duration) * 100}%`,
                transform: "translateX(-50%)",
              }}
            ></div>
            {/* Timeline divisions */}
            <div className="relative top-0 -left-[9px] w-full flex justify-start">
              {[...Array(numDivisions)].map((_, index) => {
                const isMinuteMark = index % 3 === 0;
                return (
                  <div
                    key={index}
                    className={`h-${isMinuteMark ? "3" : "2"} border-t ${
                      isMinuteMark ? "border-primary" : "border-gray-500"
                    } rotate-90`}
                    style={{
                      width: `${50 / numDivisions}%`,
                      marginLeft: index === 0 ? "0" : "auto",
                    }}
                  >
                    {isMinuteMark && (
                      <div className="relative md:text-xs text-[10px] text-white -rotate-90 left-3 bottom-1">
                        {Math.floor((index * 20) / 60)}:
                        {((index * 20) % 60).toString().padStart(2, "0")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} width="600" height="400" className="hidden" />
      </div>
    </>
  );
};

export default VideoTrimmer;
