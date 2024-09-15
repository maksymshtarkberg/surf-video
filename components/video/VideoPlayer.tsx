"use client";
import React, { FC, useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { authorize } from "utils/helpers";
// import { Format } from "media-stream-player";
import 'video.js/dist/video-js.css';
import videojs from 'video.js';

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
    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: true,
      preload: 'auto',
      // sources: [{ src, type: 'application/x-mpegURL' }]
      sources: [{ src: 'https://stream-akamai.castr.com/5b9352dbda7b8c769937e459/live_2361c920455111ea85db6911fe397b9e/index.fmp4.m3u8', type: 'application/x-mpegURL' }]
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
