import { TimelineIcon } from "@ui/TimelineIcon";
import PreLoader from "components/PreLoader/PreLoader";
import RangeSlider from "components/RangeSlider/RangeSlider";
import VideoTrimmer from "components/VideoTrimmer/VideoTrimmer";
import VideoPlayer from "components/video/VideoPlayer";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { setDuration } from "store/slices/videoSlice";
import { formatTime } from "utils/helpers";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  snapshots: string[];
  openCut: boolean;
};

const VideoTimeline: React.FC<Props> = ({
  videoRef,
  canvasRef,
  snapshots,
  openCut,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [numDivisions, setNumDivisions] = useState<number>(0);
  const [divisionInterval, setDivisionInterval] = useState<number>(0);
  const [minTime, setMinTime] = useState<number>(Math.max(0, currentTime - 40));
  const [maxTime, setMaxTime] = useState<number>(currentTime + 40);

  const videoSrc = useAppSelector((state) => state.videoFile.videoSrc);
  const isLoadingCut = useAppSelector((state) => state.videoFile.isLoadingCut);
  const duration = useAppSelector((state) => state.video.duration);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.load();
    }
  }, [videoSrc]);

  useEffect(() => {
    if (duration > 0) {
      let interval = 1;
      let divisions = 0;

      if (duration <= 90) {
        interval = 1;
        divisions = Math.floor(duration / interval);
      } else if (duration <= 600) {
        interval = 10;
        divisions = Math.floor(duration / interval);
      } else {
        interval = 60;
        divisions = Math.floor(duration / interval);
      }

      setDivisionInterval(interval);
      setNumDivisions(divisions);
    }
  }, [duration, videoSrc]);

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
  }, [videoSrc]);

  const handleRangeChange = (values: number[]) => {
    setMinTime(values[0]);
    setMaxTime(values[1]);
  };

  const currentIndex = Math.floor((currentTime / duration) * 10);

  return (
    <>
      <div className="flex flex-col items-center py-5 px-4 sm:px-6 md:px-8 lg:px-10 ">
        <video
          ref={videoRef}
          onError={() => console.error("Error loading video")}
          controls
          crossOrigin="anonymous"
          className="w-full max-w-4xl"
          autoPlay
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        {/* <VideoPlayer videoRef={videoRef} duration={duration} /> */}

        <div className="relative w-full mt-4">
          <h2 className="text-base font-bold leading-4 text-white my-4">
            Find clips
          </h2>

          <div className="relative p-x-2 py-4 m-6 bg-gray-800 rounded-lg">
            <div className="flex flex-wrap items-center justify-between">
              {snapshots.slice(0, 10).map((snapshot, index) => {
                return (
                  <img
                    key={`${snapshot}-${index}`}
                    src={snapshot}
                    alt={`Snapshot at minute ${index}`}
                    className={`w-[10%] h-20 object-cover transition-opacity duration-300 border-2 rounded-sm ${
                      index === currentIndex ? "opacity-100" : "opacity-30"
                    } `}
                  />
                );
              })}
            </div>
            {isLoadingCut && (
              <div className="flex items-center space-x-4 mt-4">
                <RangeSlider
                  videoRef={videoRef}
                  minTime={minTime}
                  maxTime={maxTime}
                  onRangeChange={handleRangeChange}
                />
              </div>
            )}
            {/* Input slider */}
            <input
              type="range"
              min="0"
              max={duration}
              step="0.1"
              value={currentTime}
              onInput={handleSliderInput}
              className="absolute w-full h-2/3 left-0 bottom-9 bg-transparent opacity-0 cursor-pointer"
            />
            <div
              className="absolute top-0 h-[90%] w-1 bg-gray-300 rounded-md mt-4"
              style={{
                left: `${(currentTime / duration) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              <TimelineIcon />
            </div>

            {/* Timeline divisions */}
            <div className="relative -top-1 -left-[7px] md:top-0 lg:-left-[15px]  w-full flex justify-start">
              {[...Array(numDivisions)].map((_, index) => {
                const timeForDivision = index * divisionInterval;
                const isMinuteMark = index % 5 === 0;
                return (
                  <div
                    key={index}
                    className={`h-${isMinuteMark ? "3" : "px"} border-t ${
                      isMinuteMark ? "border-primary" : "border-gray-500"
                    } rotate-90`}
                    style={{
                      width: `${100 / numDivisions}%`,
                      marginLeft: index === 0 ? "0" : "auto",
                    }}
                  >
                    {isMinuteMark && (
                      <div className="relative md:text-xs text-[8px] lg:text-[10px] text-white -rotate-90 left-3 bottom-1">
                        {formatTime(timeForDivision)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {openCut && (
            <VideoTrimmer
              videoRef={videoRef}
              minTime={minTime}
              maxTime={maxTime}
            />
          )}
        </div>

        <canvas ref={canvasRef} width="600" height="400" className="hidden" />
      </div>
    </>
  );
};

export default VideoTimeline;
