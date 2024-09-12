"use client";
import React, { FC, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { authorize } from "utils/helpers";
import { Format } from "media-stream-player";

const Player = dynamic(
  () => import("media-stream-player").then((mod) => mod.Player),
  {
    ssr: false,
  }
);
type Props = {
  videoRef?: React.RefObject<HTMLVideoElement>;
  duration?: number;
};

const VideoPlayer: FC<Props> = ({ videoRef, duration }) => {
  const [authorized, setAuthorized] = useState(false);
  const format: Format = "RTP_H264" as Format;

  useEffect(() => {
    authorize()
      .then(() => setAuthorized(true))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (!authorized) {
    return <div>authenticating...</div>;
  }

  return (
    <div className="w-full h-[600px] flex flex-col items-center">
      {authorized ? (
        <Player
          hostname="195.60.68.14:11068"
          initialFormat={format}
          autoPlay
          autoRetry
          vapixParams={{ resolution: "800x600" }}
          ref={videoRef}
        />
      ) : (
        <div>Failed to load video</div>
      )}
    </div>
  );
};

export default VideoPlayer;
