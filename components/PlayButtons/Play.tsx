import React, { useState, useEffect } from "react";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
};

const PlayButtons: React.FC<Props> = ({ videoRef }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying((prevState) => !prevState);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      videoRef.current.addEventListener("play", handlePlay);
      videoRef.current.addEventListener("pause", handlePause);

      // Clean up event listeners on unmount
      return () => {
        videoRef.current?.removeEventListener("play", handlePlay);
        videoRef.current?.removeEventListener("pause", handlePause);
      };
    }
  }, [videoRef]);

  return (
    <div className="relative -left-[38%] sm:-left-[45%]  p-3 bg-primary rounded-full">
      <label className="relative flex items-center justify-center cursor-pointer select-none w-10 h-10">
        <input
          type="checkbox"
          checked={isPlaying}
          onChange={togglePlay}
          className="absolute opacity-0 w-0 h-0"
        />
        <svg
          viewBox="0 0 384 512"
          className={`absolute transition-opacity duration-500 ${
            isPlaying ? "opacity-0" : "opacity-100"
          } w-6 h-6 text-gray-400`}
        >
          <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
        </svg>
        <svg
          viewBox="0 0 320 512"
          className={`absolute transition-opacity duration-500 ${
            isPlaying ? "opacity-100" : "opacity-0"
          } w-6 h-6 text-gray-400`}
        >
          <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z" />
        </svg>
      </label>
    </div>
  );
};

export default PlayButtons;
