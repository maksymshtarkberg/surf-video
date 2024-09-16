import { useEffect, useState } from "react";
import { Range } from "react-range";
import { useAppSelector } from "store/hooks";

type Props = {
  minTime: number;
  maxTime: number;
  onRangeChange: (values: number[]) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
};

const STEP = 0.1;
const MIN = 0;

const RangeSlider: React.FC<Props> = ({
  minTime,
  maxTime,
  onRangeChange,
  videoRef,
}) => {
  const [values, setValues] = useState([minTime, maxTime]);

  const duration = useAppSelector((state) => state.video.duration);

  useEffect(() => {
    if (duration) {
      setValues([minTime, maxTime]);
    }
  }, [duration, minTime, maxTime]);

  const handleRangeChange = (newValues: number[]) => {
    setValues(newValues);
    onRangeChange(newValues);

    const videoElement = videoRef.current;
    if (videoElement) {
      const [min, max] = newValues;

      if (min !== values[0]) {
        videoElement.currentTime = min;
      }

      if (max !== values[1]) {
        videoElement.currentTime = max;
      }
    }
  };

  return (
    <>
      <Range
        values={values}
        step={STEP}
        min={MIN}
        max={duration}
        onChange={handleRangeChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="absolute bottom-0 left-0 h-[130px] w-full bg-transparent z-40"
          >
            <div
              className="absolute h-full border-4 border-green-500 border-t-6 rounded-md"
              style={{
                width: `${((values[1] - values[0]) / (duration || 1)) * 100}%`,
                left: `${((values[0] - MIN) / (duration || 1)) * 100}%`,
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props, index }) => (
          <div
            {...props}
            className="absolute h-[100px] w-[8px] bg-green-500 cursor-ew-resize rounded-md z-40"
            style={{
              transform: `translateX(${index === 0 ? "-50%" : "50%"})`,
            }}
          ></div>
        )}
      />
    </>
  );
};

export default RangeSlider;
