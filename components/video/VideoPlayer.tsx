"use client";
import React, { FC, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { authorize } from "utils/helpers";
import { Format } from "media-stream-player";

const BasicPlayer = dynamic(
  () => import("media-stream-player").then((mod) => mod.BasicPlayer),
  {
    ssr: false,
  }
);

// import { Player } from "media-stream-player";
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
        <BasicPlayer
          hostname="195.60.68.14:11068"
        />
    </div>
  );
};

export default VideoPlayer;
