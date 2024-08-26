import { useState, useEffect, useRef } from "react";

interface AdOverlayProps {
  duration: number;
  onAdEnd: () => void;
  onAdSkip: () => void;
  videoPaused: boolean;
  setVideoPaused: (paused: boolean) => void;
}

const AdOverlay = ({
  duration,
  onAdEnd,
  onAdSkip,
  videoPaused,
  setVideoPaused,
}: AdOverlayProps) => {
  // const videoRef = useRef<HTMLVideoElement | null>(null);

  const [timeLeft, setTimeLeft] = useState(duration);
  const [paused, setPaused] = useState(videoPaused);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      onAdEnd();
    }
  }, [timeLeft]);

  useEffect(() => {
    setPaused(videoPaused);
  }, [videoPaused]);

  const handlePausePlay = () => {
    const newPaused = !paused;
    setPaused(newPaused);
    setVideoPaused(newPaused);
  };

  return (
    <>
      <video autoPlay controls className="w-full">
        <source
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-75 text-white">
        <div className="mb-4">
          <p>Реклама идет</p>
          <p>Осталось: {timeLeft} секунд</p>
        </div>
        <div className="flex items-center">
          <button onClick={handlePausePlay} className="mx-2">
            {paused ? "Плей" : "Пауза"}
          </button>
          <button onClick={onAdSkip} className="mx-2">
            Пропустить
          </button>
        </div>
        <div className="w-full bg-gray-800 h-2 mt-4">
          <div
            style={{ width: `${(timeLeft / duration) * 100}%` }}
            className="bg-green-500 h-full"
          />
        </div>
      </div>
    </>
  );
};

export default AdOverlay;
