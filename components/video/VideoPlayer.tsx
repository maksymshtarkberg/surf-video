"use client";
import React, { FC, useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { authorize } from "utils/helpers";
// import { Format } from "media-stream-player";
import "video.js/dist/video-js.css";
import videojs from "video.js";

// const BasicPlayer = dynamic(
//   () => import("media-stream-player").then((mod) => mod.BasicPlayer),
//   {
//     ssr: false,
//   }
// );

// import { Player } from "media-stream-player";
type Props = {
  videoRef?: React.RefObject<HTMLVideoElement>;
  duration?: number;
};

const VideoPlayer = ({}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const player = videojs(videoRef.current ? videoRef.current : "", {
      controls: true,
      autoplay: true,
      preload: "auto",
      // sources: [{ src, type: 'application/x-mpegURL' }]
      sources: [{ src: 'https://cams.cdn-surfline.com/cdn-int/pt-supertubes/chunklist.m3u8', type: 'application/x-mpegURL' }]
    });
    return () => player.dispose();
  }, []);

  return (
    <div>
      <video ref={videoRef} className="video-js vjs-default-skin" />
    </div>
  );
};

//className="w-full h-[600px] flex flex-col items-center"

export default VideoPlayer;
