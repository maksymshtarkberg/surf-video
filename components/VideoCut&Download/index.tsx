import React, { useRef, useState, useEffect } from "react";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
};

const VideoTrimmer: React.FC<Props> = ({ videoRef }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const saveSnapshotsToLocalStorage = (snapshotsArray: string[]) => {
    localStorage.setItem("snapshots", JSON.stringify(snapshotsArray));
  };

  const removeSnapshotsFromLocalStorage = () => {
    localStorage.removeItem("snapshots");
  };

  const loadSnapshotsFromLocalStorage = () => {
    const storedSnapshots = localStorage.getItem("snapshots");
    if (storedSnapshots) {
      setSnapshots(JSON.parse(storedSnapshots));
    }
  };

  const captureSnapshots = async (videoDuration: number) => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (videoElement && canvasElement) {
      const ctx = canvasElement.getContext("2d");
      if (!ctx) {
        console.error("Unable to get 2D context for canvas");
        return;
      }

      const wasPlaying = !videoElement.paused;
      const originalTime = videoElement.currentTime;

      videoElement.pause();

      const snapshotIntervals = Math.min(Math.floor(videoDuration / 60), 10);
      let snapshotsArray: string[] = [];

      const captureFrame = (time: number): Promise<void> => {
        return new Promise<void>((resolve) => {
          videoElement.currentTime = time;

          videoElement.onseeked = () => {
            if (videoElement.readyState >= 2) {
              ctx.drawImage(
                videoElement,
                0,
                0,
                canvasElement.width,
                canvasElement.height
              );
              const imageDataURL = canvasElement.toDataURL("image/jpeg");
              snapshotsArray.push(imageDataURL);
              resolve();
            } else {
              resolve();
            }
          };
        });
      };

      for (let i = 0; i <= snapshotIntervals; i++) {
        await captureFrame(i * 60);
      }

      setSnapshots(snapshotsArray);
      saveSnapshotsToLocalStorage(snapshotsArray);
      videoElement.currentTime = originalTime;
      if (wasPlaying) {
        videoElement.play();
      }
    }
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

      {/* Timeline with snapshots */}
      <div className="relative w-3/4 mt-4">
        <h2 className="text-base font-bold leading-4 text-white my-4">
          Find clips
        </h2>
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between">
            {snapshots.map((snapshot, index) => (
              <img
                key={index}
                src={snapshot}
                alt={`Snapshot at minute ${index}`}
                className={`transition-opacity duration-300 ${
                  index === currentIndex ? "opacity-100" : "opacity-30"
                } w-[9.5%] h-16 object-cover`}
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
            className="absolute inset-x-0 bottom-0 z-40 h-[60px] bg-transparent opacity-0"
          />
          <div
            className="absolute top-0 h-full w-px bg-red-500"
            style={{
              left: `${(currentTime / duration) * 100}%`,
            }}
          ></div>
        </div>

        {/* Timeline divisions */}
        <div className="relative top-0 -left-[9px] w-full flex justify-start">
          {[...Array(numDivisions)].map((_, index) => (
            <div
              key={index}
              className="h-2 border-t border-primary rotate-90"
              style={{
                width: `${50 / numDivisions}%`,
                marginLeft: index === 0 ? "0" : "auto",
              }}
            >
              {index % 3 === 0 && (
                <div className="relative md:text-xs text-[10px] text-white -rotate-90 left-3 bottom-1">
                  {Math.floor((index * 20) / 60)}:
                  {((index * 20) % 60).toString().padStart(2, "0")}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <canvas ref={canvasRef} width="600" height="400" className="hidden" />
    </div>
  );
};

export default VideoTrimmer;
