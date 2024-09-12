"use client";
import React, { FC, useEffect, useState } from "react";
import { FlagIcon, ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/outline";
import { Video } from "types/types";

import VideoCategories from "./VideoCategories";
import VideoTags from "./VideoTags";
import { fetchAds } from "lib/contentful";
import VideoPlayer from "./VideoPlayer";
import VideosSection from "components/videos/VideosSection";
import WeatherComponent from "components/weather";
import Button from "@ui/Button";
import { useRouter } from "next/router";
type Props = {
  video: Video;
  relatedVideos: Video[];
};

interface Ad {
  contentAddUrl: string;
  contentRedirectUrl: string;
  title: string;
}

const weatherData = [
  {
    waveHeight: 5.2,
    windSpeedFT: 2.8,
    windSpeedSec: "6",
    windDirection: "WNW",
    windDegrees: 300,
  },
  { title: "Onshore Wind", onshoreWind: 11, direction: "NNW", isMap: true },
  {
    title: "Dropping tide",
    waveDrop: 0.3,
    windSpeed: 14,
  },
  {
    title: "Rashguard",
    waterTemp: 28,
    airTemp: 14,
  },
];

const VideoSection: FC<Props> = ({ video, relatedVideos }) => {
  const router = useRouter();

  const handleRouter = () => {
    router.push(`${video.slug}/cut`);
  };
  return (
    <>
      <section className="mt-1">
        <h1 className="font-semibold text-xl md:text-4xl text-center">
          {video.title}
        </h1>
        <div className="w-full flex flex-col items-center text-main">
          <video
            // ref={videoRef}
            onError={() => console.error("Error loading video")}
            controls
            crossOrigin="anonymous"
            className="w-full max-w-4xl"
            autoPlay
          >
            <source
              src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              type="video/mp4"
            />
          </video>
          {/* <VideoPlayer /> */}
        </div>
        <div className="flex justify-end my-6">
          <Button
            text="Go to the cut mode"
            onClickHandler={handleRouter}
            classTlw="flex items-center justify-between"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2"
              width="24px"
              height="24px"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0 0 10.607 12m3.736 0 7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664"
              />
            </svg>
          </Button>
        </div>
      </section>
      {/* <VideosSection
        headline="Related Videos"
        variant="h3"
        videos={relatedVideos}
      /> */}
      <WeatherComponent weatherData={weatherData} />
    </>
  );
};

export default VideoSection;
